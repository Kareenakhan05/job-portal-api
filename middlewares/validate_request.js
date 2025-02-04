const { validationResult } = require('express-validator');
const { send_response } = require('./responseMiddleware'); // Import the centralized response handler

// Middleware for handling validation errors
const validate_request = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return send_response(res, 400, 'Validation failed', errors.array());
    }
    next();
};

module.exports = {
    validate_request
};
