const express = require('express');
const router = express.Router();
const userJobController = require('../../controllers/user/user_job_controller');
const {
    validate_job_search,
    validate_job_application,
    validate_job_details
} = require('../../validators/user/user_job_validator');
const responseMiddleware = require('../../middlewares/responseMiddleware');




//  Search Jobs
router.get(
    '/jobs/search',
    validate_job_search,
    userJobController.search_jobs,
    responseMiddleware
);

//  Apply for a Job
router.post(
    '/jobs/:job_id/apply',
    validate_job_application,
    userJobController.apply_for_job,
    responseMiddleware
);

//  Get Job Details
router.get(
    '/jobs/:job_id',
    validate_job_details,
    userJobController.get_job_details,
    responseMiddleware
);

module.exports = router;
