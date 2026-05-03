const express = require('express');
const assessmentsController = require('../../controllers/assessments.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');
const { SaveAssessmentBody } = require('../../schemas/assessments.schema');

const router = express.Router();

router.use(authenticate);

router.get('/', assessmentsController.listAssessments);
router.post('/', validate(SaveAssessmentBody), assessmentsController.saveAssessment);

module.exports = router;
