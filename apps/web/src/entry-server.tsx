import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { App } from './App.js';
import { getPublicPage, SITE_URL } from './seo/publicPages.js';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function render(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
  });
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </QueryClientProvider>,
  );
}

export function getSeoHead(path: string) {
  const page = getPublicPage(path);
  const title = page?.title ?? 'rentridesk — Software RENTRI semplice per officine';
  const description =
    page?.description ??
    'Software RENTRI per officine, carrozzerie, elettrauto e gommisti: registro rifiuti, FIR digitale e gestione quotidiana in un unico flusso.';
  const route = page?.path ?? '/';
  const canonical = `${SITE_URL}${route === '/' ? '' : route}`;
  const image = `${SITE_URL}/og-rentridesk.png`;

  return [
    `<title data-seo="true">${escapeHtml(title)}</title>`,
    `<meta data-seo="true" name="description" content="${escapeHtml(description)}">`,
    '<meta data-seo="true" name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">',
    `<link data-seo="true" rel="canonical" href="${canonical}">`,
    '<meta data-seo="true" property="og:locale" content="it_IT">',
    '<meta data-seo="true" property="og:type" content="website">',
    '<meta data-seo="true" property="og:site_name" content="rentridesk">',
    `<meta data-seo="true" property="og:title" content="${escapeHtml(title)}">`,
    `<meta data-seo="true" property="og:description" content="${escapeHtml(description)}">`,
    `<meta data-seo="true" property="og:url" content="${canonical}">`,
    `<meta data-seo="true" property="og:image" content="${image}">`,
    '<meta data-seo="true" property="og:image:width" content="1200">',
    '<meta data-seo="true" property="og:image:height" content="630">',
    '<meta data-seo="true" property="og:image:alt" content="rentridesk, software RENTRI per officine">',
    '<meta data-seo="true" name="twitter:card" content="summary_large_image">',
    `<meta data-seo="true" name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta data-seo="true" name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta data-seo="true" name="twitter:image" content="${image}">`,
  ].join('\n    ');
}

export function getSiteUrl() {
  return SITE_URL;
}
