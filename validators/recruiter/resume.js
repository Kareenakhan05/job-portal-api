const { body, param, query, validationResult } = require('express-validator');

// ✅ Validate fetching resumes
const validate_fetch_resumes = [
    query('role').optional().isString().withMessage('Role must be a valid string'),
    query('search').optional().isString().withMessage('Search must be a valid string'),
];

// ✅ Validate issuing an offer letter
const validate_issue_offer = [
    body('candidate_id').notEmpty().withMessage('Candidate ID is required'),
    body('offer_type')
        .notEmpty()
        .withMessage('Offer type is required')
        .isIn(['standard', 'internship', 'contract'])
        .withMessage('Invalid offer type'),
];

// ✅ Validate fetching a single resume
const validate_view_resume = [
    param('candidate_id').notEmpty().withMessage('Candidate ID is required'),
];

// ✅ Validate pin/unpin resume
const validate_toggle_pin = [
    body('candidate_id').notEmpty().withMessage('Candidate ID is required'),
];

// ✅ Middleware to check validation errors
const validate_request = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, errors: errors.array() });
    }
    next();
};

module.exports = {
    validate_fetch_resumes,
    validate_issue_offer,
    validate_view_resume,
    validate_toggle_pin,
    validate_request,
};
