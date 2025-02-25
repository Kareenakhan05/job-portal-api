const express = require('express');
const router = express.Router();
const { get_recruiter_dashboard } = require('../../../controllers/dashboard/recruiter/recruiter_dashboard_controller');
const { validate_recruiter_dashboard } = require('../../../validators/dashboard/recruiter/recruiter_dashboard_validator');
const { auth_middleware } = require('../../../middlewares/auth_middleware');  // ✅ Corrected import

// ✅ Route to fetch recruiter dashboard data
router.get('/', auth_middleware, validate_recruiter_dashboard, get_recruiter_dashboard);  // ✅ Corrected function name

module.exports = router;
