import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isConfigured = 
  Boolean(rawUrl) && 
  !rawUrl.includes('your-project') &&
  !rawUrl.includes('mock-ruralcare');

const supabaseUrl = rawUrl || 'https://demo-ruralcare.supabase.co';
const supabaseAnonKey = rawKey || 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
