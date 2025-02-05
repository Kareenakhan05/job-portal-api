const express = require('express');
const router = express.Router();
const {
    registerRecruiter,
    verifyOtp,
    loginRecruiter,
    logout_recruiter,
    forgotPassword,
    resetPassword
} = require("../controllers/auth_recruiter");
const authenticate_recruiter = require('../middlewares/authenticate_recruiter');
const {
    registerRecruiterValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator
} = require("../../validators/recruiter/auth_recruiter_validator");

router.post('/register', registerRecruiterValidator, registerRecruiter);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginValidator, loginRecruiter);
router.post('/logout', authenticate_recruiter, logout_recruiter);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password', resetPasswordValidator, resetPassword);

module.exports = router;
