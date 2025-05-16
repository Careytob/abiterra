// lib/watermark.ts
import sharp from 'sharp';
import fetch from 'node-fetch';
import * as Sentry from '@sentry/nextjs';

// Export the WatermarkOptions interface
export interface WatermarkOptions {
  text?: string;
  opacity?: number;
  fontSize?: number;
  color?: string;
}

export async function addWatermark(
  imageUrl: string,
  options: WatermarkOptions = {}
): Promise<Buffer> {
  const {
    text = 'Abiterra.com',
    opacity = 0.3,
    fontSize = 40,
    color = 'rgba(255, 255, 255, 0.5)',
  } = options;

  try {
    console.log(`[Watermark] Fetching image: ${imageUrl}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const imageBuffer = await response.buffer();
    if (imageBuffer.length === 0) {
      throw new Error('Empty image buffer');
    }

    console.log(`[Watermark] Image fetched, size: ${imageBuffer.length} bytes`);

    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    if (!width || !height) {
      throw new Error('Could not determine image dimensions');
    }

    const svgWatermark = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .watermark { 
            font-family: Arial, sans-serif; 
            font-size: ${fontSize}px; 
            font-weight: bold;
            fill: ${color};
          }
        </style>
        <text 
          x="50%" 
          y="50%" 
          class="watermark" 
          text-anchor="middle"
          dominant-baseline="middle"
        >
          ${text}
        </text>
      </svg>
    `;

    const watermarkedBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(svgWatermark),
          top: 0,
          left: 0,
          blend: 'over',
        },
      ])
      .jpeg({ quality: 80 })
      .toBuffer();

    console.log(`[Watermark] Successfully watermarked image: ${imageUrl}, size: ${watermarkedBuffer.length} bytes`);
    return watermarkedBuffer;
  } catch (error) {
    console.error(`[Watermark] Error for ${imageUrl}:`, error);
    Sentry.captureException(error, { extra: { imageUrl } });
    throw error;
  }
}

export async function getWatermarkedImageUrl(
  originalUrl: string,
  options: WatermarkOptions = {}
): Promise<string> {
  try {
    const watermarkedBuffer = await addWatermark(originalUrl, options);
    const base64 = `data:image/jpeg;base64,${watermarkedBuffer.toString('base64')}`;
    if (base64.length < 1000) {
      console.warn(`[Watermark] Base64 URL too short for ${originalUrl}: ${base64.length} bytes`);
      Sentry.captureMessage(`Base64 URL too short for ${originalUrl}`, {
        level: 'warning',
        extra: { length: base64.length },
      });
      return originalUrl;
    }
    if (!/^[A-Za-z0-9+/=]+$/.test(base64.split(',')[1])) {
      console.warn(`[Watermark] Malformed base64 URL for ${originalUrl}: ${base64.substring(0, 30)}...`);
      Sentry.captureMessage(`Malformed base64 URL for ${originalUrl}`, {
        level: 'warning',
        extra: { prefix: base64.substring(0, 30) },
      });
      return originalUrl;
    }
    console.log(`[Watermark] Generated base64 URL for ${originalUrl}: ${base64.substring(0, 50)}...`);
    return base64;
  } catch (error) {
    console.error(`[Watermark] Failed to generate watermarked URL for ${originalUrl}:`, error);
    Sentry.captureException(error, { extra: { originalUrl } });
    return originalUrl;
  }
}