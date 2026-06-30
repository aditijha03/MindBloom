const remindersService = require('../services/reminders.service');
const { success } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const listReminders = asyncHandler(async (req, res) => {
  const reminders = await remindersService.listReminders(req.user.id, req.token);
  return success(req, res, { reminders });
});

const createReminder = asyncHandler(async (req, res) => {
  const reminder = await remindersService.createReminder(req.user.id, req.body, req.token);
  return success(req, res, { reminder }, 201);
});

const deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await remindersService.deleteReminder(req.params.id, req.user.id, req.token);
  return success(req, res, { reminder });
});

module.exports = {
  listReminders,
  createReminder,
  deleteReminder
};
