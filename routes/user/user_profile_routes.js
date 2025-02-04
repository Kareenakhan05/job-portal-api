const express = require('express');
const router = express.Router();
const userProfileController = require('../../controllers/user/user_profile_controller');
const authenticateUser = require('../middlewares/authenticateUser');
const upload = require('../../services/fileUploadService'); // For file uploads
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
router.post('/upload-photo', authenticateUser, upload.single('profile_picture'), userProfileController.upload_profile_photo_controller);

//  Upload Resume
router.post('/upload-resume', authenticateUser, upload.single('resume'), userProfileController.upload_resume_controller);

module.exports = router;
