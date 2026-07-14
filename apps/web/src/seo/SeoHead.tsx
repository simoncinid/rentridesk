import { useEffect } from 'react';
import { SITE_URL, type PublicPage } from './publicPages.js';

type SeoHeadProps = {
  page?: PublicPage;
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.dataset.seoClient = 'true';
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

export function SeoHead({ page }: SeoHeadProps) {
  useEffect(() => {
    const title = page?.title ?? 'rentridesk — Software RENTRI semplice per officine';
    const description =
      page?.description ??
      'Software RENTRI per officine, carrozzerie, elettrauto e gommisti: registro rifiuti, FIR digitale e gestione quotidiana in un unico flusso.';
    const path = page?.path ?? '/';
    const canonical = `${SITE_URL}${path === '/' ? '' : path}`;

    document.title = title;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });

    let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      canonicalElement.dataset.seoClient = 'true';
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = canonical;
  }, [page]);

  return null;
}
