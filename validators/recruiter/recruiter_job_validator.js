const { body, param, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg); // Throw the first validation error
    }
};

// ✅ Job Posting Validator
const validate_job_post = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('skills').isArray({ min: 1 }).withMessage('Skills must be an array with at least one skill'),
    body('location').notEmpty().withMessage('Location is required'),
    body('salary').isNumeric().withMessage('Salary must be a number'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

// ✅ Job Update Validator
const validate_job_update = [
    param('job_id').isMongoId().withMessage('Invalid job ID'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('location').optional().isString().withMessage('Location must be a string'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

// ✅ Job ID Validator
const validate_job_id = [
    param('job_id').isMongoId().withMessage('Invalid job ID'),

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
    validate_job_post, 
    validate_job_update, 
    validate_job_id 
};
