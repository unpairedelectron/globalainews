import { SITE } from '../site.config';

export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE.url}/sitemap.xml
Sitemap: ${SITE.url}/news-sitemap.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
