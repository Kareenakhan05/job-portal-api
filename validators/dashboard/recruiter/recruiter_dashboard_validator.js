const { check } = require('express-validator');

exports.validate_recruiter_dashboard = [
    check('recruiter_id')
        .optional()
        .isMongoId()
        .withMessage("Invalid recruiter ID format"),
];
