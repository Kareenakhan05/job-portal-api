const express = require('express');
const router = express.Router();
const userJobController = require('../../controllers/user/job_management');
const {
    validate_job_search,
    validate_job_application
} = require('../../validators/user/job_management');
const responseMiddleware = require('../../middlewares/responseMiddleware');

//  Search Jobs (GET request - validation should be inside the controller)
router.get('/jobs/search', userJobController.search_jobs);

//  Apply for a Job (POST request - with validation)
router.post(
    '/jobs/:job_id/apply',
    validate_job_application,  // ✅ Validation should be BEFORE the controller
    userJobController.apply_for_job
);

//  Get Job Details (No validation middleware needed for GET request)
router.get('/jobs/:job_id', userJobController.get_job_details);

module.exports = router;
