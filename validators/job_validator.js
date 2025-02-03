const { body, param, query } = require('express-validator');

// Validator for searching jobs
const searchJobsValidator = [
    query('keyword')
        .notEmpty().withMessage('Search keyword is required')
        .isString().withMessage('Keyword must be a string')
];

// Validator for applying to a job
const applyJobValidator = [
    param('job_id')
        .isMongoId().withMessage('Invalid job ID')
];

// Validator for job ID (used in routes that require a job ID)
const jobIdValidator = [
    param('job_id')
        .isMongoId().withMessage('Invalid job ID')
];

module.exports = {
    searchJobsValidator,
    applyJobValidator,
    jobIdValidator
};
