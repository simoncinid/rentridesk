import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSeoHead, getSiteUrl, render } from '../dist-ssr/entry-server.js';

const directory = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(directory, '..');
const dist = resolve(webRoot, 'dist');
const template = await readFile(resolve(dist, 'index.html'), 'utf8');
const routes = [
  '/',
  '/software-rentri-officine',
  '/fir-digitale-officina',
  '/rentri-carrozzerie',
  '/software-rentri-consulenti',
  '/obbligo-rentri-officine',
  '/prezzi',
  '/faq-rentri-officine',
];

for (const route of routes) {
  const appHtml = render(route);
  const pageHtml = template
    .replace('<!--seo-head-->', getSeoHead(route))
    .replace('<div id="root"></div>', `<div id="root" data-prerender-path="${route}">${appHtml}</div>`);
  const output = route === '/' ? resolve(dist, 'index.html') : resolve(dist, route.slice(1), 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, pageHtml);
}

const siteUrl = getSiteUrl();
const sitemapEntries = routes
  .map((route, index) => {
    const location = `${siteUrl}${route === '/' ? '/' : route}`;
    const priority = index === 0 ? '1.0' : index === 1 || index === 2 || index === 5 ? '0.9' : '0.8';
    const frequency = index === 0 || index === 1 || index === 2 || index === 5 || index === 7 ? 'weekly' : 'monthly';
    return `  <url>\n    <loc>${location}</loc>\n    <lastmod>2026-07-14</lastmod>\n    <changefreq>${frequency}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');
await writeFile(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`,
);
await writeFile(
  resolve(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /app/\nDisallow: /admin/\nDisallow: /partner/\nDisallow: /login\nDisallow: /register\nDisallow: /verify-email\nDisallow: /forgot-password\nDisallow: /reset-password\nDisallow: /mfa\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
