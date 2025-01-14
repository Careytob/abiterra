import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadImage(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('properties') // your bucket name
    .upload(path, file);

  if (error) throw error;
  return data;
}