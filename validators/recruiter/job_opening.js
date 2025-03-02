const { check, validationResult } = require('express-validator');

// ✅ Validator for Editing Job
const validate_edit_job = [
    check('job_id').notEmpty().withMessage('Job ID is required'),
    check('title').notEmpty().withMessage('Job title is required'),
    check('department').notEmpty().withMessage('Department is required'),
    check('location').notEmpty().withMessage('Location is required'),
    check('hiring_manager').notEmpty().withMessage('Hiring manager is required'),
    check('status')
        .isIn(['active', 'inactive', 'closed', 'filled'])
        .withMessage('Invalid status. Allowed values: active, inactive, closed, filled'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

module.exports = { validate_edit_job };
