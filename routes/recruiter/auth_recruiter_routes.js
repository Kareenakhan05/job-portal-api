const express = require('express');
const router = express.Router();
const {
    register_recruiter,
    verify_otp,
    login_recruiter,
    logout_recruiter,
    forgot_password,
    reset_password
} = require("../../controllers/recruiter/auth_recruiter_controller");

const authenticate_recruiter = require('../../middlewares/authenticate_recruiter');


const {
    registerRecruiterValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator
} = require("../../validators/recruiter/auth_recruiter_validator");

router.post('/register', registerRecruiterValidator, register_recruiter);
router.post('/verify-otp', verify_otp);
router.post('/login', loginValidator, login_recruiter);
router.post('/logout', authenticate_recruiter, logout_recruiter);
router.post('/forgot-password', forgotPasswordValidator, forgot_password);
router.post('/reset-password', resetPasswordValidator, reset_password);

module.exports = router;
