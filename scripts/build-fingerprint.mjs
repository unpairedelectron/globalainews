import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excludedDirectories = new Set([
  '.agents',
  '.cache',
  '.git',
  '.local',
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
  'target',
  'attached_assets',
]);
const sourceExtensions = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.sql',
  '.svg',
  '.toml',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);
const rootBuildFiles = new Set([
  '.gitignore',
  '.replit',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'replit.md',
  'tsconfig.json',
]);

function isBuildSource(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  const segments = normalized.split('/');
  if (segments.some((segment) => excludedDirectories.has(segment))) return false;
  if (
    segments.some(
      (segment) =>
        segment === '.npmrc' ||
        segment === '.netrc' ||
        segment === '.env' ||
        segment.startsWith('.env.'),
    )
  ) {
    return false;
  }

  const topLevel = segments[0];
  const includedRoot = topLevel === 'artifacts' || topLevel === 'scripts';
  return (
    rootBuildFiles.has(normalized) ||
    (includedRoot && sourceExtensions.has(path.extname(normalized).toLowerCase()))
  );
}

async function walkWorkspace(directory, relativeDirectory = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relativePath = relativeDirectory
      ? path.join(relativeDirectory, entry.name)
      : entry.name;
    if (entry.isDirectory()) {
      if (!excludedDirectories.has(entry.name)) {
        files.push(...(await walkWorkspace(path.join(directory, entry.name), relativePath)));
      }
    } else if (entry.isFile() && isBuildSource(relativePath)) {
      files.push(relativePath);
    }
  }
  return files;
}

function listWorkspaceFiles() {
  try {
    return execFileSync(
      'git',
      ['-C', workspaceRoot, 'ls-files', '-z', '--cached', '--others', '--exclude-standard'],
      { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
    )
      .split('\0')
      .filter((file) => file && isBuildSource(file));
  } catch {
    return null;
  }
}

async function getSourceDigest(files) {
  const workspaceHash = createHash('sha256');
  for (const relativePath of files.sort()) {
    const content = await readFile(path.join(workspaceRoot, relativePath));
    const fileHash = createHash('sha256').update(content).digest('hex');
    workspaceHash.update(relativePath.split(path.sep).join('/'));
    workspaceHash.update('\0');
    workspaceHash.update(fileHash);
    workspaceHash.update('\n');
  }
  return workspaceHash.digest('hex');
}

function getGitCommit() {
  try {
    return execFileSync('git', ['-C', workspaceRoot, 'rev-parse', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'unavailable';
  }
}

const gitFiles = listWorkspaceFiles();
const sourceFiles = gitFiles ?? (await walkWorkspace(workspaceRoot));
const sourceDigest = await getSourceDigest(sourceFiles);
const sourceCommit = getGitCommit();
const artifactRevision = (artifact) =>
  `${artifact}-sha256:${createHash('sha256')
    .update(artifact)
    .update('\0')
    .update(sourceDigest)
    .digest('hex')}`;

process.stdout.write(
  JSON.stringify({
    sourceRevision: `${sourceCommit}+source-sha256:${sourceDigest}`,
    webArtifactRevision: artifactRevision('web'),
    apiArtifactRevision: artifactRevision('api'),
  }),
);