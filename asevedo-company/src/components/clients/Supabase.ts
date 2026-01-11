/**
 * Supabase Client
 * Centralized Supabase client for authentication and database operations
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
// Try both naming conventions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON || process.env.SUPABASE_ANON || '';

// Create the Supabase client (will fail gracefully if env vars are missing)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Export types for convenience
export type { User, Session } from '@supabase/supabase-js';