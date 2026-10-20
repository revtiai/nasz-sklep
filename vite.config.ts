import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};

export default defineConfig({
  base: env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  define: { __ASSET_VERSION__: JSON.stringify(Date.now().toString(36)) },
  build: { rollupOptions: { input: { main: 'index.html', board: 'board.html', social: 'social.html' } } },
});
