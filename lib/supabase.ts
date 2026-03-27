import { createClient } from '@supabase/supabase-js';

function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  return value;
}

function getAnonKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!value) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return value;
}

export function getPublicSupabaseClient() {
  return createClient(getSupabaseUrl(), getAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export function getServiceSupabaseClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return createClient(getSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
