import { getSitemapUrls } from '@/lib/blogHelpers';

// Force dynamic rendering to allow runtime fetches
export const dynamic = 'force-dynamic';

export async function GET() {
  const urls = await getSitemapUrls();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        ({ url, lastmod, priority }) => `
      <url>
        <loc>https://www.abiterra.com${url}</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>${priority}</priority>
      </url>`
      )
      .join('')}
  </urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}