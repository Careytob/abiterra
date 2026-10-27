// app/sitemap.xml/route.ts
//
// Lists the public pages for search engines: static pages, every published listing, and the blog.
// Addresses come from the configured site URL, so it works on any domain.
import prisma from '@/lib/prisma';
import { getSitemapUrls } from '@/lib/blogHelpers';
import { absoluteUrl } from '@/lib/site-config';
import { loadSiteConfig } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

const today = () => new Date().toISOString().split('T')[0];

function toDate(input: unknown): string {
  const d = new Date(input as string);
  return Number.isNaN(d.getTime()) ? today() : d.toISOString().split('T')[0];
}

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export async function GET(): Promise<Response> {
  const config = await loadSiteConfig();
  const rentalsOn = config.features.rentals;

  // path -> entry; a Map keeps each address once even if several sources list it.
  const entries = new Map<string, { lastmod: string; priority: string }>();
  const add = (path: string, lastmod: unknown, priority: number | string) => {
    if (!entries.has(path)) entries.set(path, { lastmod: toDate(lastmod), priority: String(priority) });
  };

  add('/', new Date(), '1.0');
  add('/buy', new Date(), '0.9');
  if (rentalsOn) add('/rent', new Date(), '0.9');
  add('/aboutus', new Date(), '0.5');
  add('/contact', new Date(), '0.5');

  // Published, available listings.
  try {
    const properties = await prisma.property.findMany({
      where: { publishstatus: 'PUBLISHED', availability: true },
      select: { id: true, slug: true, type: true, updatedat: true },
      orderBy: { createdat: 'desc' },
    });
    for (const p of properties) {
      if (p.type === 'RENT') {
        if (rentalsOn) add(`/rent/${p.id}`, p.updatedat, '0.8');
      } else if (p.slug) {
        add(`/buy/${p.slug}`, p.updatedat, '0.8');
      }
    }
  } catch (err) {
    console.error('[Sitemap] Could not load listings:', err);
  }

  // Blog pages (the blog helper also lists a few static paths; duplicates are ignored).
  try {
    for (const item of await getSitemapUrls()) {
      if (item.url === '/rent' && !rentalsOn) continue;
      add(item.url, item.lastmod, item.priority ?? 0.7);
    }
  } catch (err) {
    console.error('[Sitemap] Could not load blog URLs:', err);
  }

  const body = [...entries.entries()]
    .map(
      ([path, { lastmod, priority }]) =>
        `  <url>\n    <loc>${escapeXml(absoluteUrl(path))}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } });
}
