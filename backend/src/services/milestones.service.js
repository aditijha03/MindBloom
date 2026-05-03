const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const createMilestone = async (userId, data) => {
  // Check ownership of child_profile first
  const { data: child, error: childError } = await supabaseAdmin
    .from('child_profiles')
    .select('id')
    .eq('id', data.childId)
    .eq('parent_id', userId)
    .single();

  if (childError || !child) throw new AppError('Child profile not found or access denied.', 404, 'NOT_FOUND');

  const { data: milestone, error } = await supabaseAdmin
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

const getMilestones = async (userId, childId) => {
  // Check ownership
  const { data: child, error: childError } = await supabaseAdmin
    .from('child_profiles')
    .select('id')
    .eq('id', childId)
    .eq('parent_id', userId)
    .single();

  if (childError || !child) throw new AppError('Child profile not found or access denied.', 404, 'NOT_FOUND');

  const { data, error } = await supabaseAdmin
    .from('milestones')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data;
};

const updateMilestone = async (id, userId, updates) => {
  // RLS will handle the base ownership, but we can double check or just let Supabase do its thing.
  // We'll use the service role, so we need to check manual ownership if we want to be safe, 
  // or use the authenticate user context if we were using supabaseAnon.
  // Since we use supabaseAdmin, we MUST check manually.

  const { data: milestone, error: getError } = await supabaseAdmin
    .from('milestones')
    .select('child_id')
    .eq('id', id)
    .single();

  if (getError || !milestone) throw new AppError('Milestone not found.', 404, 'NOT_FOUND');

  const { data: child, error: childError } = await supabaseAdmin
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

  const { data: updated, error } = await supabaseAdmin
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
