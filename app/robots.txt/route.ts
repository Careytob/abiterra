export async function GET() {
    const robots = `
  User-agent: *
  Allow: /
  Allow: /blog
  Allow: /blog/*
  Allow: /buy
  Allow: /rent
  Disallow: /api/*
  Disallow: /auth/*
  Sitemap: https://www.abiterra.com/sitemap.xml
    `;
  
    return new Response(robots, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }