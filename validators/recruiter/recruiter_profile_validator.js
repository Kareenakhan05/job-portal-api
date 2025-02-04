const { body } = require('express-validator');

//  Profile Validator
const validate_profile = [
    body('company_name')
        .optional()
        .isString()
        .withMessage('Company name must be a string'),
    body('company_website')
        .optional()
        .isURL()
        .withMessage('Company website must be a valid URL'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    body('profile_picture')
        .optional()
        .isURL()
        .withMessage('Profile picture must be a valid URL')
];

//  Password Change Validator
const validate_password_change = [
    body('old_password')
        .notEmpty()
        .withMessage('Old password is required'),
    body('new_password')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
];

module.exports = {
    validate_profile,
    validate_password_change
};
