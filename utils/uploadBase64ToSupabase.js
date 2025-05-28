// utils/uploadBase64ToSupabase.js
import { supabase } from '@/lib/supabaseClient';

export async function uploadBase64ToSupabase(base64String, filename) {
  const base64Data = base64String.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  const { data, error } = await supabase.storage
    .from('bugreport')
    .upload(`reports/${filename}.png`, buffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('bugreport')
    .getPublicUrl(`reports/${filename}.png`);

  return urlData.publicUrl;
}
