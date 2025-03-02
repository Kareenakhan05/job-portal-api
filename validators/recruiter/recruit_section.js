const { body, validationResult } = require('express-validator');

// ✅ Validate candidate status update request
const validate_candidate_status = [
    body('candidate_id').isInt().withMessage('Candidate ID must be a valid integer'),
    body('status').isIn(['Applied', 'Interview Scheduled', 'Hired', 'Rejected'])
        .withMessage('Invalid status. Allowed values: Applied, Interview Scheduled, Hired, Rejected'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

module.exports = { validate_candidate_status };
