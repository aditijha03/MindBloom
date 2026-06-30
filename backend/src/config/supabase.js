const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

if (!env.supabaseUrl || !env.supabaseAnonKey || !env.supabaseServiceRoleKey) {
  throw new Error('Supabase configuration missing in environment variables.');
}

// supabaseAnon: Used ONLY for auth verification (getClaims/getUser)
const supabaseAnon = createClient(env.supabaseUrl, env.supabaseAnonKey);

// supabaseAdmin: Used for ALL database queries (bypasses RLS - server-side only)
const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Creates a user-scoped Supabase client that passes the user's JWT token
 * to enforce database RLS policies.
 * @param {string} token - The user's Bearer JWT access token
 */
const getSupabaseUserClient = (token) => {
  if (!token) return supabaseAnon;
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};

module.exports = {
  supabaseAnon,
  supabaseAdmin,
  getSupabaseUserClient
};
