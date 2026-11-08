// Locates the Astro CLI entry point from the installed package's `bin` field,
// so builds work regardless of the Astro version or how node_modules is laid out.
import fs from 'node:fs';
import path from 'node:path';

export function astroBin(fromDir) {
  let dir = path.resolve(fromDir);
  while (true) {
    const pkgFile = path.join(dir, 'node_modules', 'astro', 'package.json');
    if (fs.existsSync(pkgFile)) {
      const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
      const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.astro;
      if (bin) return path.join(path.dirname(fs.realpathSync(pkgFile)), bin);
    }
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error(`Astro is not installed (searched up from ${fromDir}). Run: cd site && npm ci`);
    dir = parent;
  }
}
