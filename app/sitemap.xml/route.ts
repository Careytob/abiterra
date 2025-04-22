// app/sitemap.xml/route.ts
import { getSitemapUrls } from '@/lib/blogHelpers';
import { getAllProperties } from '@/lib/propertyHelpers';

// Define a URL entry type for sitemap
interface SitemapUrl {
  url: string;
  lastmod: string;
  priority: string; // Must be string
}

// Force dynamic rendering to allow runtime fetches
export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  // Get blog URLs and ensure priority is a string
  const blogUrlsRaw = await getSitemapUrls();
  const blogUrls: SitemapUrl[] = blogUrlsRaw.map(item => ({
    url: item.url,
    lastmod: item.lastmod,
    priority: String(item.priority) // Ensure it's a string
  }));
  
  // Get property URLs
  const properties = await getAllProperties();
  const propertyUrls: SitemapUrl[] = properties.map(property => ({
    url: `/properties/${property.slug}`,
    lastmod: property.updated_at || property.created_at,
    priority: '0.8'  // String with quotes, not number
  }));
  
  // Add homepage and other static pages
  const staticUrls: SitemapUrl[] = [
    { url: '/', lastmod: new Date().toISOString().split('T')[0], priority: '1.0' },
    { url: '/about', lastmod: new Date().toISOString().split('T')[0], priority: '0.5' },
    { url: '/contact', lastmod: new Date().toISOString().split('T')[0], priority: '0.5' }
  ];
  
  // Combine all URLs, ensuring all priorities are strings
  const allUrls: SitemapUrl[] = [
    ...staticUrls, 
    ...propertyUrls, 
    ...blogUrls
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls
      .map(
        ({ url, lastmod, priority }) => `
      <url>
        <loc>https://abiterra.com${url}</loc>
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