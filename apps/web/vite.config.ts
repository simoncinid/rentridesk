import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const prerenderedRoutes = new Set([
  '/software-rentri-officine',
  '/fir-digitale-officina',
  '/rentri-carrozzerie',
  '/software-rentri-consulenti',
  '/obbligo-rentri-officine',
  '/prezzi',
  '/faq-rentri-officine',
]);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-prerendered-public-pages',
      configurePreviewServer(server) {
        server.middlewares.use((request, response, next) => {
          const path = request.url?.split(/[?#]/, 1)[0]?.replace(/\/$/, '') ?? '';
          if (!prerenderedRoutes.has(path)) return next();
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(readFileSync(resolve('dist', path.slice(1), 'index.html')));
        });
      },
    },
  ],
  server: { port: 5173 },
  build: { sourcemap: true },
});
