const { getSupabaseUserClient } = require('../config/supabase');
const AppError = require('../utils/AppError');

const getMe = async (userId, token) => {
  const { data, error } = await getSupabaseUserClient(token)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) throw new AppError('Profile not found.', 404, 'NOT_FOUND');

  return data;
};

const updateMe = async (userId, { displayName, bio }, token) => {
  const updates = {};
  if (displayName) updates.display_name = displayName;
  if (bio !== undefined) updates.bio = bio;

  const { data, error } = await getSupabaseUserClient(token)
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

const updateAvatar = async (userId, avatarUrl, token) => {
  const { data, error } = await getSupabaseUserClient(token)
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

const getUserById = async (id, token) => {
  const { data, error } = await getSupabaseUserClient(token)
    .from('profiles')
    .select('id, display_name, avatar_url, bio, created_at')
    .eq('id', id)
    .single();

  if (error || !data) throw new AppError('User not found.', 404, 'NOT_FOUND');

  return data;
};

module.exports = {
  getMe,
  updateMe,
  updateAvatar,
  getUserById
};
