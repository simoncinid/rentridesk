import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

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
const siteUrl = (process.env.VITE_PUBLIC_SITE_URL ?? 'https://rentridesk.it').replace(/\/$/, '');

const failures = [];
for (const route of routes) {
  const file = route === '/' ? 'dist/index.html' : `dist${route}/index.html`;
  const html = await readFile(resolve(file), 'utf8');
  const checks = {
    'titolo unico': (html.match(/<title\b/g) ?? []).length === 1,
    description: /<meta[^>]+name="description"[^>]+content="[^"]{80,}/.test(html),
    canonical: html.includes(`rel="canonical" href="${siteUrl}${route === '/' ? '' : route}"`),
    'H1 unico': (html.match(/<h1\b/g) ?? []).length === 1,
    prerender: html.includes(`data-prerender-path="${route}"`),
    Organization: html.includes('"@type":"Organization"'),
    SoftwareApplication: html.includes('"@type":"SoftwareApplication"'),
    BreadcrumbList: html.includes('"@type":"BreadcrumbList"'),
    OpenGraph: html.includes('property="og:image"'),
    favicon: html.includes('rel="icon" href="/favicon.ico"'),
  };
  for (const [name, valid] of Object.entries(checks)) {
    if (!valid) failures.push(`${route}: ${name}`);
  }
}

const faqHtml = await readFile(resolve('dist/faq-rentri-officine/index.html'), 'utf8');
for (const question of [
  'RENTRI è obbligatorio per le officine?',
  'Da quando il FIR digitale diventa obbligatorio?',
  'Quali rifiuti deve registrare un’officina?',
  'Il portale RENTRI è gratuito?',
  'Serve un software esterno?',
  'Come si firma un FIR digitale?',
  'Come si conserva il FIR digitale?',
  'Quanto costa un software RENTRI per officine?',
]) {
  if (!faqHtml.includes(question)) failures.push(`/faq-rentri-officine: domanda mancante “${question}”`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`SEO check superato per ${routes.length} pagine prerenderizzate.`);
}
