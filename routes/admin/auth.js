const express = require('express');
const { 
    register_user, 
    login_admin_recruiter, 
    login_user, 
    forgot_password, 
    reset_password 
} = require('../../controllers/admin/auth');
const { 
    validate_register_user, 
    validate_login_admin_recruiter, 
    validate_login_user, 
    validate_forgot_password, 
    validate_reset_password 
} = require('../../validators/admin/auth');

const router = express.Router();

router.post('/register-user', validate_register_user, register_user);
router.post('/login-admin-recruiter', validate_login_admin_recruiter, login_admin_recruiter);
router.post('/login-user', validate_login_user, login_user);
router.post('/forgot-password', validate_forgot_password, forgot_password);
router.post('/reset-password', validate_reset_password, reset_password);

module.exports = router;
