const express = require('express');
const assessmentsController = require('../../controllers/assessments.controller');
const validate = require('../../middleware/validate');
const { authenticate, optionalAuthenticate } = require('../../middleware/authenticate');
const { SaveAssessmentBody, AnalyzeAssessmentBody } = require('../../schemas/assessments.schema');

const router = express.Router();

// Analyze endpoint is accessible to guests, but will save assessments if user is logged in
router.post('/analyze', optionalAuthenticate, validate(AnalyzeAssessmentBody), assessmentsController.analyzeAssessment);

// Routes requiring authentication below
router.use(authenticate);

router.get('/', assessmentsController.listAssessments);
router.post('/', validate(SaveAssessmentBody), assessmentsController.saveAssessment);

module.exports = router;

