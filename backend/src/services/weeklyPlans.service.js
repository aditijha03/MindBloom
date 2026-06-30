const { getSupabaseUserClient } = require('../config/supabase');
const AppError = require('../utils/AppError');

const getLatestWeeklyPlan = async (userId, token) => {
  const { data, error } = await getSupabaseUserClient(token)
    .from('weekly_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
};

const saveWeeklyPlan = async (userId, planData, token) => {
  const { childId, ageGroup, minutes, concerns, activities } = planData;

  const { data, error } = await getSupabaseUserClient(token)
    .from('weekly_plans')
    .insert({
      user_id: userId,
      child_id: childId || null,
      age_group: ageGroup,
      minutes,
      concerns: concerns || [],
      activities: activities || [],
      feedback: {}
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateWeeklyPlanFeedback = async (planId, userId, feedback, token) => {
  const { data, error } = await getSupabaseUserClient(token)
    .from('weekly_plans')
    .update({ feedback })
    .eq('id', planId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  getLatestWeeklyPlan,
  saveWeeklyPlan,
  updateWeeklyPlanFeedback
};
