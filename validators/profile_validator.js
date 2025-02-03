const { check } = require('express-validator');

// Validator for creating and updating profile
const validateCreateProfile = [
    check('email').isEmail().withMessage('Invalid email format'),
    check('name').notEmpty().withMessage('Name is required'),
    check('phone').notEmpty().withMessage('Phone number is required'),
    check('address').optional().notEmpty().withMessage('Address cannot be empty'),
    check('bio').optional().notEmpty().withMessage('Bio cannot be empty')
];

// Validator for changing password
const validateChangePassword = [
    check('current_password').notEmpty().withMessage('Current password is required'),
    check('new_password').isLength({ min: 6 }).withMessage('New password should be at least 6 characters long')
];

module.exports = {
    validateCreateProfile,
    validateChangePassword
};
