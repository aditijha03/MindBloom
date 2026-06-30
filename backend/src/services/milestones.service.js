const { getSupabaseUserClient } = require('../config/supabase');
const AppError = require('../utils/AppError');

const createMilestone = async (userId, data, token) => {
  const userClient = getSupabaseUserClient(token);
  
  // Check ownership of child_profile first
  const { data: child, error: childError } = await userClient
    .from('child_profiles')
    .select('id')
    .eq('id', data.childId)
    .eq('parent_id', userId)
    .single();

  if (childError || !child) throw new AppError('Child profile not found or access denied.', 404, 'NOT_FOUND');

  const { data: milestone, error } = await userClient
    .from('milestones')
    .insert({
      child_id: data.childId,
      category: data.category,
      title: data.title,
      status: data.status
    })
    .select()
    .single();

  if (error) throw error;

  return milestone;
};

const getMilestones = async (userId, childId, token) => {
  const userClient = getSupabaseUserClient(token);

  // Check ownership
  const { data: child, error: childError } = await userClient
    .from('child_profiles')
    .select('id')
    .eq('id', childId)
    .eq('parent_id', userId)
    .single();

  if (childError || !child) throw new AppError('Child profile not found or access denied.', 404, 'NOT_FOUND');

  const { data, error } = await userClient
    .from('milestones')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data;
};

const updateMilestone = async (id, userId, updates, token) => {
  const userClient = getSupabaseUserClient(token);

  const { data: milestone, error: getError } = await userClient
    .from('milestones')
    .select('child_id')
    .eq('id', id)
    .single();

  if (getError || !milestone) throw new AppError('Milestone not found.', 404, 'NOT_FOUND');

  const { data: child, error: childError } = await userClient
    .from('child_profiles')
    .select('id')
    .eq('id', milestone.child_id)
    .eq('parent_id', userId)
    .single();

  if (childError || !child) throw new AppError('Access denied.', 403, 'FORBIDDEN');

  const updateData = { status: updates.status };
  if (updates.status === 'achieved') {
    updateData.achieved_at = new Date().toISOString();
  }

  const { data: updated, error } = await userClient
    .from('milestones')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return updated;
};

module.exports = {
  createMilestone,
  getMilestones,
  updateMilestone
};
