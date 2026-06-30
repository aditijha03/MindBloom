const express = require('express');
const router = express.Router();
const remindersController = require('../../controllers/reminders.controller');
const { authenticate } = require('../../middleware/authenticate');

router.use(authenticate);

router.get('/', remindersController.listReminders);
router.post('/', remindersController.createReminder);
router.delete('/:id', remindersController.deleteReminder);

module.exports = router;
