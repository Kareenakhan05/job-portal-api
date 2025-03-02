const { body, param, validationResult } = require('express-validator');

// ✅ Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: errors.array()[0].msg });
    }
    next();
};

// ✅ Validate Team Member Data (For Adding & Updating)
const validate_team = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone')
        .isMobilePhone()
        .withMessage('Valid phone number is required'),
    body('experience')
        .isNumeric()
        .withMessage('Experience should be a number'),
    body('department')
        .isIn(['HR', 'Tech', 'Design', 'Operations'])
        .withMessage('Invalid department'),
    body('salary')
        .isNumeric()
        .withMessage('Salary must be a valid number'),
    body('position').notEmpty().withMessage('Position is required'),
    body('status')
        .isIn(['Active', 'Inactive'])
        .withMessage('Invalid status'),
    body('join_date')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Join date must be a valid date'),
    body('release_date')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Release date must be a valid date'),
    body('remark').optional().isString(),

    // 🛠️ Handle validation errors
    handleValidationErrors
];

// ✅ Validate Status Change (For PATCH /:id/status)
const validate_status = [
    body('status')
        .isIn(['Active', 'Inactive'])
        .withMessage('Invalid status'),
    handleValidationErrors
];

// ✅ Validate MongoDB Object ID
const validate_id = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
    handleValidationErrors
];

// ✅ Export all validators
module.exports = { validate_team, validate_status, validate_id };
