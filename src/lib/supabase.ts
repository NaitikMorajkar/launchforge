import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Central Supabase client.
 *
 * Environment variables (see `.env.example`):
 *   VITE_SUPABASE_URL       – your project URL
 *   VITE_SUPABASE_ANON_KEY  – the public "anon" key (safe for the browser)
 *
 * NEVER put a `service_role` key or any secret in a `VITE_`-prefixed variable.
 * Anything prefixed `VITE_` is inlined into the public browser bundle.
 */

// Optional chaining keeps this module importable outside Vite too (tests,
// scripts); Vite always defines import.meta.env at build time.
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True only when both variables are present and non-placeholder. */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey.length > 20
);

let client: SupabaseClient | null = null;

/**
 * Lazily create the Supabase client. Returns `null` when the backend has not
 * been configured so the UI can render an honest "backend not connected"
 * state instead of faking responses.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (client) return client;

  client = createClient(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}

export type { SupabaseClient };
