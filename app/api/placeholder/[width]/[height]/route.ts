// app/api/placeholder/[width]/[height]/route.ts
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { width: string; height: string } }
) {
  const params = await context.params;
  const width = parseInt(params.width, 10) || 800;
  const height = parseInt(params.height, 10) || 600;
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f5f5f5"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="#aaaaaa">
        Image Placeholder
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}