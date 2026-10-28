import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const imageDirectory = path.resolve(scriptDirectory, '../public/images/editorial');
const widths = [480, 768, 1024];
const originals = readdirSync(imageDirectory)
  .filter((filename) => filename.endsWith('.jpg') && !/-(480|768|1024)\.jpg$/.test(filename))
  .sort();

for (const filename of originals) {
  const source = path.join(imageDirectory, filename);
  const slug = filename.slice(0, -'.jpg'.length);

  for (const width of widths) {
    for (const format of ['avif', 'webp']) {
      const destination = path.join(imageDirectory, `${slug}-${width}.${format}`);
      const formatOptions = format === 'avif'
        ? ['-define', 'heic:speed=6', '-quality', '46']
        : ['-define', 'webp:method=6', '-quality', '78'];
      execFileSync('magick', [
        source,
        '-auto-orient',
        '-strip',
        '-resize',
        `${width}x`,
        ...formatOptions,
        destination,
      ], { stdio: 'inherit' });
    }
  }
}

console.log(`Generated ${originals.length * widths.length * 2} responsive editorial image variants.`);
