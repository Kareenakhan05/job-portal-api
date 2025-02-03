const { Router } = require('express');
const {
    search_jobs,
    apply_for_job,
    get_job_details
} = require('../controllers/jobController');
const { authenticate } = require('../middlewares/auth');
const {
    searchJobsValidator,
    applyJobValidator,
    jobIdValidator
} = require('../validators/job_validator');  // Import validators
const { validationResult } = require('express-validator');

const router = Router();

// Route to search jobs (Accessible by all users)
router.get('/search-jobs', authenticate, searchJobsValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, search_jobs);

// Route for users to apply for a job (Accessible by authenticated users)
router.post('/apply-job/:job_id', authenticate, applyJobValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, apply_for_job);

// Route to get details of a specific job (Accessible by users)
router.get('/job/:job_id', authenticate, jobIdValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, get_job_details);

module.exports = router;
