// app/robots.txt/route.ts
import { absoluteUrl } from '@/lib/site-config';

export async function GET() {
  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /admin',
    'Disallow: /agent',
    'Disallow: /login',
    'Disallow: /signup',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    '',
  ].join('\n');

  return new Response(robots, { headers: { 'Content-Type': 'text/plain' } });
}
