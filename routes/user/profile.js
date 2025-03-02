const express = require('express');
const router = express.Router();
const userProfileController = require('../../controllers/user/profile');

const { upload_profile_photo, upload_resume } = require('../../services/file_upload'); // ✅ Import specific functions
const {
    validate_create_profile,
    validate_update_profile,
    validate_change_password
} = require('../../validators/user/profile');

//  Create Profile
router.post('/create',  validate_create_profile, userProfileController.create_profile);

//  Get Profile
router.get('/me',  userProfileController.get_profile);

//  Update Profile
router.put('/update',  validate_update_profile, userProfileController.update_profile);

//  Change Password
router.put('/change-password',  validate_change_password, userProfileController.change_password);

//  Upload Profile Picture
router.post('/upload-photo',  upload_profile_photo, userProfileController.upload_profile_photo_controller);

//  Upload Resume
router.post('/upload-resume',  upload_resume, userProfileController.upload_resume_controller);

module.exports = router;
