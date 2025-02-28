const express = require('express');
const router = express.Router();
const { get_job_openings, edit_job_details } = require('../../../controllers/dashboard/recruiter/job_opening_controller');
const { validate_edit_job } = require('../../../validators/dashboard/recruiter/job_opening_validator');
const { auth_middleware } = require('../../../middlewares/auth_middleware');

// ✅ Fetch job openings (Recruiter only)
router.get('/', auth_middleware, get_job_openings);

// ✅ Edit job details
router.put('/edit', auth_middleware, validate_edit_job, edit_job_details);

module.exports = router;
