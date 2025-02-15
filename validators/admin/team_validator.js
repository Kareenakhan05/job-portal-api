const { body, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg); // Throw the first validation error
    }
};

// ✅ Validate Team Member Data
const validate_team = [
    body('name').notEmpty().withMessage('Name is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('department').isIn(['HR', 'Tech', 'Design', 'Operations']).withMessage('Invalid department'),
    body('contact').notEmpty().withMessage('Contact is required'),
    body('address').notEmpty().withMessage('Address is required'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

module.exports = { validate_team };
