const express = require('express');
const router = express.Router();

// Import Controllers
const { 
    register_admin, 
    login_admin, 
    forgot_password, 
    reset_password,
    logout_admin
} = require("../../controllers/admin/admin_auth_controller.js");

// Import Middlewares
const validate_request = require("../../middlewares/validate_request.js");

// Import Validators
const { 
    register_admin_validator, 
    login_admin_validator, 
    forgot_password_validator, 
    reset_password_validator,
    logout_admin_validator 
} = require('../../validators/admin/admin_auth_validators.js');

// ✅ Correct Middleware Usage
router.post('/register', register_admin_validator, validate_request, register_admin);
router.post('/login', login_admin_validator, validate_request, login_admin);
router.post('/forgot-password', forgot_password_validator, validate_request, forgot_password);
router.post('/reset-password', reset_password_validator, validate_request, reset_password);
router.post('/logout', logout_admin_validator, validate_request, logout_admin);

module.exports = router;
