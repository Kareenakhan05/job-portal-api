const { query, param, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg); // Return the first validation error
    }
};

// ✅ Job Search Validator
const validate_job_search = [
    query('keyword')
        .notEmpty()
        .withMessage('Keyword is required')
        .isString()
        .withMessage('Keyword must be a string'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

// ✅ Job Application Validator
const validate_job_application = [
    param('job_id')
        .isMongoId()
        .withMessage('Invalid Job ID'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

// ✅ Job Details Validator
const validate_job_details = [
    param('job_id')
        .isMongoId()
        .withMessage('Invalid Job ID'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

module.exports = {
    validate_job_search,
    validate_job_application,
    validate_job_details
};
