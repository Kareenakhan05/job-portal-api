const express = require('express');
const router = express.Router();
const userProfileController = require('../../controllers/user/user_profile_controller');
const authenticateUser = require('../../middlewares/authenticate_user');
const { upload_profile_photo, upload_resume } = require('../../services/fileUploadService'); // ✅ Import specific functions
const {
    validate_create_profile,
    validate_update_profile,
    validate_change_password
} = require('../../validators/user/user_profile_validator');

//  Create Profile
router.post('/create', authenticateUser, validate_create_profile, userProfileController.create_profile);

//  Get Profile
router.get('/me', authenticateUser, userProfileController.get_profile);

//  Update Profile
router.put('/update', authenticateUser, validate_update_profile, userProfileController.update_profile);

//  Change Password
router.put('/change-password', authenticateUser, validate_change_password, userProfileController.change_password);

//  Upload Profile Picture
router.post('/upload-photo', authenticateUser, upload_profile_photo, userProfileController.upload_profile_photo_controller);

//  Upload Resume
router.post('/upload-resume', authenticateUser, upload_resume, userProfileController.upload_resume_controller);

module.exports = router;
