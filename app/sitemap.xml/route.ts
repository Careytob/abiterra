// app/sitemap.xml/route.ts
import { getSitemapUrls } from '@/lib/blogHelpers';
import { getAllProperties } from '@/lib/propertyHelpers';

// Helper function to format date to YYYY-MM-DD
function formatDateForSitemap(dateInput: any): string {
    if (!dateInput) {
        // Return undefined or a default if no date is available,
        // but for sitemap <lastmod>, it's better to return a valid date or omit the tag.
        // Let's use a default if no date exists.
        // A better approach is to ensure your data sources always provide a valid date.
        // For now, let's try to parse and format whatever we get.
         try {
             // Attempt to parse a default date if input is invalid
             const defaultDate = new Date();
             return defaultDate.toISOString().split('T')[0];
         } catch (error) {
             // Fallback in case even default date fails (highly unlikely)
             console.error("Error formatting default date:", error);
             return '2000-01-01'; // Safe default
         }
    }

    try {
        const dateObj = new Date(dateInput);
        // Check if the parsed date is valid
        if (isNaN(dateObj.getTime())) {
             console.error("Invalid date received for sitemap:", dateInput);
             // Attempt to parse a default date if input is invalid
             const defaultDate = new Date();
             return defaultDate.toISOString().split('T')[0];
        }
        return dateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } catch (error) {
        console.error("Error formatting date for sitemap:", dateInput, error);
        // Return a fallback date if parsing fails
        try {
             const fallbackDate = new Date();
             return fallbackDate.toISOString().split('T')[0];
         } catch (e) {
              console.error("Error formatting fallback date:", e);
             return '2000-01-01'; // Safe default
         }
    }
}

// Define a URL entry type for sitemap
interface SitemapUrl {
    url: string;
    lastmod: string; // Must be YYYY-MM-DD format
    priority: string; // Must be string
}

// Force dynamic rendering to allow runtime fetches
// This is needed because you're fetching data dynamically
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Optional: ensure data is never cached

export async function GET(): Promise<Response> {
    // Get blog URLs and format the date
    const blogUrlsRaw = await getSitemapUrls();
    const blogUrls: SitemapUrl[] = blogUrlsRaw.map(item => ({
        url: item.url,
        lastmod: formatDateForSitemap(item.lastmod), // FORMAT DATE
        priority: String(item.priority || '0.7') // Ensure it's a string, default if missing
    }));

    // Get property URLs and format the date
    const properties = await getAllProperties();
    const propertyUrls: SitemapUrl[] = properties.map(property => ({
        url: `/properties/${property.slug}`,
        lastmod: formatDateForSitemap(property.updated_at || property.created_at), // FORMAT DATE
        priority: '0.8' // String with quotes
    }));

    // Add homepage and other static pages - Date format already correct here
    const staticUrls: SitemapUrl[] = [
        { url: '/', lastmod: formatDateForSitemap(new Date()), priority: '1.0' }, // Use helper for consistency
        { url: '/about', lastmod: formatDateForSitemap(new Date()), priority: '0.5' }, // Use helper
        { url: '/contact', lastmod: formatDateForSitemap(new Date()), priority: '0.5' }, // Use helper
        // Add other static pages like /buy, /rent if they exist
        { url: '/buy', lastmod: formatDateForSitemap(new Date()), priority: '0.9' },
        { url: '/rent', lastmod: formatDateForSitemap(new Date()), priority: '0.9' },
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