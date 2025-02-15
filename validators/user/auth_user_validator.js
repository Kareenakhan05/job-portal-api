const { body, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg); // Return the first validation error
    }
};

// ✅ Register Validator
const registerValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').isMobilePhone().withMessage('Valid phone number is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

// ✅ Login Validator
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

// ✅ OTP Validator
const otpValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isNumeric().withMessage('OTP must be numeric'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

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
    body('resetToken').isNumeric().withMessage('Reset token must be numeric'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

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
    registerValidator,
    loginValidator,
    otpValidator,
    forgotPasswordValidator,
    resetPasswordValidator
};
