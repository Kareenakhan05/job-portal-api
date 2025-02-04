const { body } = require('express-validator');

const registerRecruiterValidator = [
    body('company_name').notEmpty().withMessage('Company name is required'),
    body('recruiter_name').notEmpty().withMessage('Recruiter name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('contact_number').isMobilePhone().withMessage('Valid contact number is required')
];

const loginValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const forgotPasswordValidator = [
    body('email').isEmail().withMessage('Valid email is required')
];

const resetPasswordValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isNumeric().withMessage('OTP must be numeric'),
    body('new_password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

module.exports = {
    registerRecruiterValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator
};
