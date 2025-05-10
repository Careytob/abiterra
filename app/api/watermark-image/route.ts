import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bucket = searchParams.get('bucket');
    const path = searchParams.get('path');

    if (!bucket || !path) {
      console.error('[WatermarkAPI] Missing parameters', { bucket, path });
      return NextResponse.json({ error: 'Missing bucket or path' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error || !data) {
      console.error('[WatermarkAPI] Download error', { bucket, path, error: error?.message });
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const imageBuffer = Buffer.from(await data.arrayBuffer());

    const watermarkedBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(
            `<svg width="400" height="100">
              <text x="50%" y="50%" font-size="40" fill="white" fill-opacity="0.5" text-anchor="middle" font-family="Arial">Abiterra.com</text>
            </svg>`
          ),
          gravity: 'center',
        },
      ])
      .webp({ quality: 80 })
      .toBuffer();

    return new NextResponse(watermarkedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[WatermarkAPI] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}