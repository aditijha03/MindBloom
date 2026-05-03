const express = require('express');
const multer = require('multer');
const usersController = require('../../controllers/users.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');
const { UserIdParams, UpdateProfileBody } = require('../../schemas/users.schema');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/me', authenticate, usersController.getMe);
router.patch('/me', authenticate, validate(UpdateProfileBody), usersController.updateMe);
router.post('/me/avatar', authenticate, upload.single('file'), usersController.uploadAvatar);
router.get('/:id', validate.params(UserIdParams), usersController.getUserById);

module.exports = router;
