const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const saveAssessment = async (userId, assessmentData) => {
  const { score, resultType, summary, responses } = assessmentData;

  const { data, error } = await supabaseAdmin
    .from('assessments')
    .insert({
      user_id: userId,
      score,
      result_type: resultType,
      summary,
      responses
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

const listAssessments = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

module.exports = {
  saveAssessment,
  listAssessments
};
