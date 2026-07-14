import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.js';
import './styles/app.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});
const root = document.getElementById('root');
if (!root) throw new Error('Elemento root non trovato');
const application = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

const normalizePath = (path: string) => (path !== '/' ? path.replace(/\/$/, '') : path);
const prerenderedPath = root.dataset.prerenderPath;

if (prerenderedPath && normalizePath(prerenderedPath) === normalizePath(window.location.pathname)) {
  hydrateRoot(root, application);
} else {
  root.replaceChildren();
  createRoot(root).render(application);
}
