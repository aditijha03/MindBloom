const childProfilesService = require('../services/childProfiles.service');
const { success } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const createChildProfile = asyncHandler(async (req, res) => {
  const profile = await childProfilesService.createChildProfile(req.user.id, req.body);
  return success(req, res, { profile }, 201);
});

const getChildProfiles = asyncHandler(async (req, res) => {
  const profiles = await childProfilesService.getChildProfiles(req.user.id);
  return success(req, res, { profiles });
});

const updateChildProfile = asyncHandler(async (req, res) => {
  const profile = await childProfilesService.updateChildProfile(req.params.id, req.user.id, req.body);
  return success(req, res, { profile });
});

module.exports = {
  createChildProfile,
  getChildProfiles,
  updateChildProfile
};
