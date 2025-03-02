const express = require('express');
const router = express.Router();

const { 
    post_job, 
    get_recruiter_jobs, 
    update_job, 
    delete_job, 
    get_job_applications 
} = require('../../controllers/recruiter/job_management');

const { 
    validate_job_post, 
    validate_job_update, 
    validate_job_id 
} = require('../../validators/recruiter/job_management');

const validate_request = require('../../middlewares/validate_request'); // ✅ Fix import



// ✅ Use Correct Middleware Order
router.post('/jobs', validate_job_post, validate_request, post_job);
router.get('/jobs', get_recruiter_jobs);
router.put('/jobs/:job_id', validate_job_id, validate_job_update, validate_request, update_job);
router.delete('/jobs/:job_id', validate_job_id, validate_request, delete_job);
router.get('/jobs/:job_id/applications', validate_job_id, validate_request, get_job_applications);

module.exports = router;
