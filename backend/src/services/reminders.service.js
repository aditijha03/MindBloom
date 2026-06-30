const { getSupabaseUserClient } = require('../config/supabase');
const AppError = require('../utils/AppError');

const listReminders = async (userId, token) => {
  const { data, error } = await getSupabaseUserClient(token)
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('time', { ascending: true });

  if (error) throw error;
  return data;
};

const createReminder = async (userId, reminderData, token) => {
  const { text, time } = reminderData;

  const { data, error } = await getSupabaseUserClient(token)
    .from('reminders')
    .insert({
      user_id: userId,
      text,
      time
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteReminder = async (reminderId, userId, token) => {
  const { data, error } = await getSupabaseUserClient(token)
    .from('reminders')
    .delete()
    .eq('id', reminderId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  listReminders,
  createReminder,
  deleteReminder
};
