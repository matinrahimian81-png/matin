import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Advanced cleaning: handle many common copy-paste errors
let cleanUrl = rawUrl.trim()
  .replace(/\/$/, "")            // No trailing slashes
  .replace(/\/rest\/v1$/, "")    // Remove if full API URL was pasted
  .replace(/\/auth\/v1$/, "");    // Remove if full Auth URL was pasted

// Ensure it starts with https:// if it looks like a domain
const supabaseUrl = cleanUrl && !cleanUrl.startsWith('http') ? `https://${cleanUrl}` : cleanUrl;
const supabaseAnonKey = rawKey.trim();

// A URL is valid if it has at least one dot (domain) and starts with https
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.') &&
  supabaseAnonKey.length > 20 // basic length check
);

if (rawUrl || rawKey) {
  if (!isSupabaseConfigured) {
    console.error('❌ Supabase Config Error:', { 
      isUrlValid: supabaseUrl.startsWith('https://'),
      hasDot: supabaseUrl.includes('.'),
      keyLength: supabaseAnonKey.length,
      url: supabaseUrl 
    });
  } else {
    console.log('✅ Supabase configuration detected successfully.');
  }
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key'
);
