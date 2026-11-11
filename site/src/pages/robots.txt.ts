import { SITE } from '../site.config';

export function GET() {
  const body = `User-agent: Googlebot
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE.url}/sitemap.xml
Sitemap: ${SITE.url}/news-sitemap.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
