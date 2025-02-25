const { check, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg); // Throw first validation error
    }
};

const register_admin_validator = [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('name').notEmpty().withMessage('Name is required'),
    check('phone').notEmpty().withMessage('Phone number is required'),
    check('role').notEmpty().withMessage('Role is required'),
    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

const login_admin_validator = [
    check('email').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

const forgot_password_validator = [
    check('email').isEmail().withMessage('Invalid email'),
    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

const reset_password_validator = [
    check('email').isEmail().withMessage('Invalid email'),
    check('otp').isNumeric().withMessage('OTP must be a numeric value'),
    check('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

const logout_admin_validator = [
    check('token').notEmpty().withMessage('Token is required'),
    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

//export all functions

module.exports = {
    register_admin_validator,
    login_admin_validator,
    forgot_password_validator,
    reset_password_validator,
    logout_admin_validator
};
