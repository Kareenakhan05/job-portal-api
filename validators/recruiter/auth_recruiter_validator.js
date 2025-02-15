const { body, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg); // Throw the first validation error
    }
};

// ✅ Recruiter Registration Validator
const registerRecruiterValidator = [
    body('company_name').notEmpty().withMessage('Company name is required'),
    body('recruiter_name').notEmpty().withMessage('Recruiter name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('contact_number').isMobilePhone().withMessage('Valid contact number is required'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

// ✅ Recruiter Login Validator
const loginValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

// ✅ Forgot Password Validator
const forgotPasswordValidator = [
    body('email').isEmail().withMessage('Valid email is required'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

// ✅ Reset Password Validator
const resetPasswordValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isNumeric().withMessage('OTP must be numeric'),
    body('new_password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

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
    registerRecruiterValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator
};
