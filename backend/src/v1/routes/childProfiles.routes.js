const express = require('express');
const childProfilesController = require('../../controllers/childProfiles.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');
const { ChildProfileBody } = require('../../schemas/childProfiles.schema');

const router = express.Router();

router.use(authenticate);

router.get('/', childProfilesController.getChildProfiles);
router.post('/', validate(ChildProfileBody), childProfilesController.createChildProfile);
router.patch('/:id', validate(ChildProfileBody), childProfilesController.updateChildProfile);

module.exports = router;
