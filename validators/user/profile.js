const { body, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg); // Return the first validation error
    }
};

// ✅ Profile Creation Validator
const validate_create_profile = [
    body('email')
        .isEmail()
        .withMessage('Invalid email format'),
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('phone')
        .isMobilePhone()
        .withMessage('Invalid phone number'),
    body('address')
        .optional()
        .isString()
        .withMessage('Address must be a string'),
    body('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio should be under 500 characters'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

// ✅ Profile Update Validator
const validate_update_profile = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Name cannot be empty'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Invalid phone number'),
    body('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio should be under 500 characters'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

// ✅ Password Change Validator
const validate_change_password = [
    body('current_password')
        .notEmpty()
        .withMessage('Current password is required'),
    body('new_password')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),

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
    validate_create_profile,
    validate_update_profile,
    validate_change_password
};
