const { body } = require('express-validator');

const registerValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').isMobilePhone().withMessage('Valid phone number is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const loginValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const otpValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isNumeric().withMessage('OTP must be numeric'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const forgotPasswordValidator = [
    body('email').isEmail().withMessage('Valid email is required')
];

const resetPasswordValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('resetToken').isNumeric().withMessage('Reset token must be numeric'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

module.exports = {
    registerValidator,
    loginValidator,
    otpValidator,
    forgotPasswordValidator,
    resetPasswordValidator
};
