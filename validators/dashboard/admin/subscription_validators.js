const { check, validationResult } = require('express-validator');

// Helper function for handling validation errors
const handleValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg); // Throw the first validation error
    }
};

// ✅ Validate Subscription Plan Data
const validate_subscription = [
    check('plan_name').notEmpty().withMessage('Plan name is required'),
    check('job_post_limit')
        .isInt({ min: 0 })
        .withMessage('Job post limit must be a valid number'),
    check('resume_check_limit')
        .isInt({ min: 0 })
        .withMessage('Resume check limit must be a valid number'),
    check('validity_days')
        .isInt({ min: 1 })
        .withMessage('Subscription validity must be at least 1 day'),
    check('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a valid number'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

module.exports = { validate_subscription };
