const { validationResult } = require('express-validator');
const { send_response } = require('../middlewares/responseMiddleware'); // ✅ Fix relative path

const validate_request = (req, res, next) => {
    console.log("🛠 Running validate_request middleware...");
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("❌ Validation failed:", errors.array());
        return send_response(res, 400, 'Validation failed', errors.array());
    }
    
    next();
};

module.exports = validate_request; // ✅ Ensure it's exported correctly
