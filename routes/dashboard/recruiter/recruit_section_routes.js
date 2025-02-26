const express = require('express');
const router = express.Router();
const { get_recruit_section, update_candidate_status } = require('../../../controllers/dashboard/recruiter/recruit_section_controller');
const { validate_candidate_status } = require('../../../validators/dashboard/recruiter/recruit_section_validator');
const { auth_middleware } = require('../../../middlewares/auth_middleware');

// ✅ Route to fetch candidates in the recruiter's dashboard
router.get('/', auth_middleware, get_recruit_section);

// ✅ Route to update candidate hiring status
router.patch('/update-status', auth_middleware, validate_candidate_status, update_candidate_status);

module.exports = router;
