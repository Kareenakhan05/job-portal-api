const { check, validationResult } = require("express-validator");

// Helper function to handle validation errors
const handleValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg); // Throw first validation error
    }
};

const validate_dashboard = [
    check("admin_id").isMongoId().withMessage("Invalid admin ID"),
    (req, res, next) => {
        try {
            handleValidationErrors(req);
            next();
        } catch (err) {
            return res.status(400).json({ status: 400, message: err.message });
        }
    }
];

module.exports = { validate_dashboard };
