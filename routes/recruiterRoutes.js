// /routes/recruiterRoutes.js
const express = require('express');
const { post_job, get_recruiter_jobs, update_job, delete_job, get_job_applications } = require('../controllers/admin/recruiterController');
const { validateJobPost, validateJobUpdate } = require('../validators/recruiter_validator');
const { responseMiddleware } = require('../middleware/responseMiddleware');

const router = express.Router();

// Post a Job
router.post('/post', validateJobPost, post_job, responseMiddleware);

// Get Jobs by Recruiter
router.get('/recruiter-jobs', get_recruiter_jobs, responseMiddleware);

// Update a Job
router.put('/update/:job_id', validateJobUpdate, update_job, responseMiddleware);

// Delete a Job
router.delete('/delete/:job_id', delete_job, responseMiddleware);

// Get Job Applications
router.get('/applications/:job_id', get_job_applications, responseMiddleware);

module.exports = router;
