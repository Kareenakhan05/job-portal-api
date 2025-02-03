const { check } = require('express-validator');

// Validator for User Registration
const validateRegistration = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('name').notEmpty().withMessage('Name is required'),
    check('phone').isLength({ min: 10 }).withMessage('Valid phone number is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validator for OTP Verification
const validateOtpVerification = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('otp').isNumeric().withMessage('Valid OTP is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validator for User Login
const validateLogin = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password is required')
];

// Validator for Forgot Password
const validateForgotPassword = [
    check('email').isEmail().withMessage('Valid email is required')
];

// Validator for Reset Password
const validateResetPassword = [
    check('email').isEmail().withMessage('Valid email is required'),
    check('resetToken').isNumeric().withMessage('Valid reset token is required'),
    check('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

module.exports = {
    validateRegistration,
    validateOtpVerification,
    validateLogin,
    validateForgotPassword,
    validateResetPassword
};
