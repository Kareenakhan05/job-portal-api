const express = require('express');
const router = express.Router();
const { create_profile, get_profile, update_profile, change_password, upsert_profile, get_profile_by_id, upload_profile_photo_controller, upload_resume_controller, get_profile_photo, get_resume } = require('../controllers/profileController');
const { validateCreateProfile, validateChangePassword } = require('../validators/profile_validator');
const { validateRequest } = require('../middlewares/responseMiddleware'); // Assuming you created a middleware to handle validation errors

// Create Profile Route
router.post('/profile', validateCreateProfile, validateRequest, create_profile);

// Get Profile Route
router.get('/profile/:email', get_profile);

// Update Profile Route
router.put('/profile/:email', validateCreateProfile, validateRequest, update_profile);

// Change Password Route
router.put('/profile/change-password', validateChangePassword, validateRequest, change_password);

// Upsert Profile Route
router.put('/profile/upsert', upsert_profile);

// Get Profile by ID Route
router.get('/profile/id/:user_id', get_profile_by_id);

// Upload Profile Picture Route
router.post('/profile/upload-photo', upload_profile_photo_controller);

// Upload Resume Route
router.post('/profile/upload-resume', upload_resume_controller);

// Get Profile Photo Route
router.get('/profile/photo/:user_id', get_profile_photo);

// Get Resume Route
router.get('/profile/resume/:user_id', get_resume);

module.exports = router;
