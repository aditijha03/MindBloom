const usersService = require('../services/users.service');
const storageService = require('../services/storage.service');
const { success } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getMe = asyncHandler(async (req, res) => {
  const profile = await usersService.getMe(req.user.id);
  return success(req, res, { profile });
});

const updateMe = asyncHandler(async (req, res) => {
  const profile = await usersService.updateMe(req.user.id, req.body);
  return success(req, res, { profile });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Avatar file is required.', 400, 'VALIDATION_ERROR');
  }

  const avatarUrl = await storageService.uploadAvatar(req.user.id, req.file);
  await usersService.updateAvatar(req.user.id, avatarUrl);

  return success(req, res, { avatarUrl });
});

const getUserById = asyncHandler(async (req, res) => {
  const profile = await usersService.getUserById(req.params.id);
  return success(req, res, { profile });
});

module.exports = {
  getMe,
  updateMe,
  uploadAvatar,
  getUserById
};
