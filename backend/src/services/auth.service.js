const { supabaseAdmin, supabaseAnon } = require('../config/supabase');
const AppError = require('../utils/AppError');

const register = async ({ email, password, displayName }) => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { display_name: displayName },
    email_confirm: true  // force confirm so user can log in immediately
  });

  if (error) {
    const msg = error.message?.toLowerCase() || '';
    if (msg.includes('already registered') || msg.includes('already been registered')) {
      throw new AppError('An account with this email already exists.', 409, 'EMAIL_EXISTS');
    }
    throw error;
  }

  return {
    id: data.user.id,
    email: data.user.email,
    displayName: data.user.user_metadata.display_name,
    role: data.user.user_metadata.role || 'user'
  };
};

const login = async ({ email, password }) => {
  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    const msg = error.message?.toLowerCase() || '';
    if (msg.includes('email not confirmed')) {
      throw new AppError('Please confirm your email address before logging in.', 403, 'EMAIL_NOT_CONFIRMED');
    }
    if (msg.includes('invalid login credentials')) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }
    throw new AppError(error.message, 401, 'AUTH_ERROR');
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
    user: {
      id: data.user.id,
      email: data.user.email,
      displayName: data.user.user_metadata.display_name,
      role: data.user.user_metadata.role || 'user'
    }
  };
};

const logout = async (accessToken) => {
  const { error } = await supabaseAnon.auth.admin.signOut(accessToken);
  if (error) throw error;
  return true;
};

const refreshToken = async (rawToken) => {
  const { data, error } = await supabaseAnon.auth.refreshSession({
    refresh_token: rawToken
  });

  if (error) throw error;

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at
  };
};

const forgotPassword = async (email) => {
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email
  });

  if (error) throw error;

  return { message: 'Password reset link generated successfully.' };
};

const resetPassword = async (token, password) => {
  const { data, error } = await supabaseAnon.auth.updateUser({
    password
  });

  if (error) throw error;

  return { message: 'Password reset successfully.' };
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
};
