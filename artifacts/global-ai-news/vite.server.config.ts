import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(projectRoot, '..', '..');
const fingerprintPath = path.join(workspaceRoot, 'scripts', 'build-fingerprint.mjs');
const buildFingerprint = JSON.parse(
  execFileSync(process.execPath, [fingerprintPath], {
    cwd: workspaceRoot,
    encoding: 'utf8',
  }),
);

export default defineConfig({
  configFile: false,
  root: projectRoot,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, 'src'),
      '@assets': path.resolve(projectRoot, '..', '..', 'attached_assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  ssr: {
    noExternal: true,
  },
  define: {
    'process.env.GAN_BUILD_SOURCE_REVISION': JSON.stringify(buildFingerprint.sourceRevision),
    'process.env.GAN_BUILD_WEB_ARTIFACT_REVISION': JSON.stringify(
      buildFingerprint.webArtifactRevision,
    ),
    'process.env.GAN_BUILD_API_ARTIFACT_REVISION': JSON.stringify(
      buildFingerprint.apiArtifactRevision,
    ),
  },
  build: {
    ssr: path.resolve(projectRoot, 'src/server.ts'),
    outDir: path.resolve(projectRoot, 'dist/server'),
    emptyOutDir: false,
    rollupOptions: {
      external: ['express'],
      output: {
        format: 'es',
        entryFileNames: 'server.mjs',
      },
    },
  },
});