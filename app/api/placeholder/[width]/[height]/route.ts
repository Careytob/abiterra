{/*
    import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// Cache response headers - long cache for placeholders
const cacheControl = {
  'Cache-Control': 'public, max-age=604800, immutable', // Cache for 1 week
  'CDN-Cache-Control': 'public, max-age=604800, immutable',
  'Vercel-CDN-Cache-Control': 'public, max-age=604800, immutable',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { width: string; height: string } }
): Promise<NextResponse> {
  try {
    // Parse dimensions with defaults and limits
    const width = Math.min(parseInt(params.width, 10) || 400, 1200);
    const height = Math.min(parseInt(params.height, 10) || 300, 1200);

    // Generate SVG placeholder
    const svgBuffer = Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <rect width="100%" height="100%" fill="url(#pattern)" opacity="0.1"/>
        <defs>
          <pattern id="pattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <path d="M0,0 l20,20" stroke="#cccccc" stroke-width="1"/>
          </pattern>
        </defs>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.max(width, height) / 30}px" 
          fill="#999" text-anchor="middle" dominant-baseline="middle">Property Image</text>
      </svg>
    `);

    // Convert SVG to PNG with Sharp
    const pngBuffer = await sharp(svgBuffer)
      .resize(width, height)
      .png()
      .toBuffer();

    // Return PNG image
    return new NextResponse(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        ...cacheControl,
      },
    });
  } catch (error) {
    console.error('Error generating placeholder:', error);

    // Fallback SVG
    const fallbackSvg = Buffer.from(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16px" 
          fill="#999" text-anchor="middle" dominant-baseline="middle">Property Image</text>
      </svg>
    `);

    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        ...cacheControl,
      },
    });
  }
}
  
  */}