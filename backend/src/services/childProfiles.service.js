const { getSupabaseUserClient } = require('../config/supabase');
const AppError = require('../utils/AppError');

const createChildProfile = async (parentId, data, token) => {
  const { data: profile, error } = await getSupabaseUserClient(token)
    .from('child_profiles')
    .insert({
      parent_id: parentId,
      name: data.name,
      age_months: data.ageMonths,
      gender: data.gender,
      medical_history: data.medicalHistory,
      concerns: data.concerns
    })
    .select()
    .single();

  if (error) throw error;

  return profile;
};

const getChildProfiles = async (parentId, token) => {
  const { data, error } = await getSupabaseUserClient(token)
    .from('child_profiles')
    .select('*')
    .eq('parent_id', parentId);

  if (error) throw error;

  return data;
};

const updateChildProfile = async (id, parentId, updates, token) => {
  const { data, error } = await getSupabaseUserClient(token)
    .from('child_profiles')
    .update({
      name: updates.name,
      age_months: updates.ageMonths,
      gender: updates.gender,
      medical_history: updates.medicalHistory,
      concerns: updates.concerns,
      avatar_url: updates.avatarUrl
    })
    .eq('id', id)
    .eq('parent_id', parentId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

module.exports = {
  createChildProfile,
  getChildProfiles,
  updateChildProfile
};
