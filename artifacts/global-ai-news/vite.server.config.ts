import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

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