// app/api/admin/upload-image/route.ts
//
// Accepts a single image file (multipart/form-data) from the admin UI,
// pushes it straight into the "properties" Supabase Storage bucket, and
// returns the storage path plus a long-lived signed URL. The admin
// property form calls this once per selected image before submitting the
// create/update request, so the DB write only ever deals with URLs.
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseServiceRole } from '@/lib/supabase';
import * as Sentry from '@sentry/nextjs';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const slug = formData.get('slug');
    const imageType = (formData.get('imageType') as string) || 'other';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (typeof slug !== 'string' || !slug) {
      return NextResponse.json({ error: 'Missing property slug' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPEG, PNG, or WebP.' },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File is larger than 10MB' }, { status: 400 });
    }

    const extension = file.name.split('.').pop() || 'jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const filepath = `images/properties/${slug}/${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseServiceRole.storage
      .from('properties')
      .upload(filepath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error('[AdminUploadImage] Upload failed:', uploadError.message);
      Sentry.captureException(uploadError);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const { data: signedData, error: signedError } = await supabaseServiceRole.storage
      .from('properties')
      .createSignedUrl(filepath, 31536000); // 1 year, matches the rest of the app

    if (signedError || !signedData?.signedUrl) {
      console.error('[AdminUploadImage] Failed to sign URL:', signedError?.message);
      Sentry.captureException(signedError);
      return NextResponse.json({ error: 'Upload succeeded but signing failed' }, { status: 500 });
    }

    return NextResponse.json({
      url: signedData.signedUrl,
      filepath,
      imagetype: imageType,
    });
  } catch (err) {
    console.error('[AdminUploadImage] Unexpected error:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
