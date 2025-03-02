const { check, validationResult } = require('express-validator');


const validate_request = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
    }
    next();
};

/**
 * User (Job Seeker) Registration Validator
 */
const validate_register_user = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('otp').notEmpty().withMessage('OTP is required'),
    validate_request
];

/**
 * Universal Login (Admin & Recruiter) Validator
 */
const validate_login_admin_recruiter = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
    validate_request
];

/**
 * User (Job Seeker) Login Validator
 */
const validate_login_user = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
    validate_request
];

/**
 * Forgot Password Validator
 */
const validate_forgot_password = [
    check('email').isEmail().withMessage('Valid email is required'),
    validate_request
];

/**
 * Reset Password Validator
 */
const validate_reset_password = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('otp').notEmpty().withMessage('OTP is required'),
    check('new_password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate_request
];

module.exports = {
    validate_register_user,
    validate_login_admin_recruiter,
    validate_login_user,
    validate_forgot_password,
    validate_reset_password
};
