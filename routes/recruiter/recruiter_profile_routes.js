const express = require('express');
const router = express.Router();
const recruiterProfileController = require('../../controllers/recruiter/recruiter_profile_controller');
const { validate_profile, validate_password_change } = require('../../validators/recruiter/recruiter_profile_validator');
const responseMiddleware = require('../../middlewares/responseMiddleware');
const authenticateRecruiter = require('../../middlewares/authenticate_recruiter');

// Apply recruiter authentication to all profile routes
router.use(authenticateRecruiter);

//  Set Profile
router.post(
    '/profile',
    validate_profile,
    recruiterProfileController.set_profile,
    responseMiddleware
);

//  Get Profile
router.get(
    '/profile',
    recruiterProfileController.get_profile,
    responseMiddleware
);

//  Update Profile
router.put(
    '/profile',
    validate_profile,
    recruiterProfileController.update_profile,
    responseMiddleware
);

//  Change Password
router.put(
    '/profile/change-password',
    validate_password_change,
    recruiterProfileController.change_password,
    responseMiddleware
);

module.exports = router;
