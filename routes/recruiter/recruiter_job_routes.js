const express = require('express');
const router = express.Router();
const recruiterJobController = require('../../controllers/recruiter/recruiter_job_controller');
const { validate_job_post, validate_job_update, validate_job_id } = require('../../validators/recruiter/recruiter_job_validator');
const responseMiddleware = require('../../middlewares/responseMiddleware');
const authenticateRecruiter = require('../../middlewares/authenticate_recruiter'); // Assuming recruiter auth middleware

// Apply recruiter authentication to all routes
router.use(authenticateRecruiter);

// POST a Job
router.post(
    '/jobs',
    validate_job_post,
    recruiterJobController.post_job,
    responseMiddleware
);

// GET all Jobs by Recruiter
router.get(
    '/jobs',
    recruiterJobController.get_recruiter_jobs,
    responseMiddleware
);

// UPDATE a Job
router.put(
    '/jobs/:job_id',
    validate_job_update,
    recruiterJobController.update_job,
    responseMiddleware
);

// DELETE a Job
router.delete(
    '/jobs/:job_id',
    validate_job_id,
    recruiterJobController.delete_job,
    responseMiddleware
);

// GET Job Applications
router.get(
    '/jobs/:job_id/applications',
    validate_job_id,
    recruiterJobController.get_job_applications,
    responseMiddleware
);

module.exports = router;
