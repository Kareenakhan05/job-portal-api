const express = require('express');
const router = express.Router();
const {
    register,
    verify_registration_otp,
    login,
    logout_user,
    forgot_password,
    reset_password
} = require('../../controllers/user/auth_user_controller');

const authenticate_user = require('../middlewares/authenticate_user');
const {
    registerValidator,
    loginValidator,
    otpValidator,
    forgotPasswordValidator,
    resetPasswordValidator
} = require('../../validators/user/auth_user_validator');

router.post('/register', registerValidator, register);
router.post('/verify-otp', otpValidator, verify_registration_otp);
router.post('/login', loginValidator, login);
router.post('/logout', authenticate_user, logout_user);
router.post('/forgot-password', forgotPasswordValidator, forgot_password);
router.post('/reset-password', resetPasswordValidator, reset_password);

module.exports = router;
