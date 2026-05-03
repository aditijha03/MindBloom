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

module.exports = {
  supabaseAnon,
  supabaseAdmin
};
