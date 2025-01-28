import { Router } from 'express';
import {
    create_profile,
    get_profile,
    update_profile,
    change_password,
    upsert_profile,
    get_profile_by_id,
    upload_profile_photo_controller,
    upload_resume_controller,
    get_profile_photo,
    get_resume
} from '../controllers/profileController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Create Profile
router.post('/profile', authenticate, create_profile);

// Get Profile by Email
router.get('/profile/:email', authenticate, get_profile);

// Update Profile by Email
router.put('/profile/:email', authenticate, update_profile);

// Change Password
router.post('/change-password', authenticate, change_password);

// Create or Update Profile (Upsert)
router.put('/upsert-profile', authenticate, upsert_profile);

// Get Profile by ID (User-specific)
router.get('/profile/id/:user_id', authenticate, get_profile_by_id);

// Upload Profile Picture
router.post('/upload-profile-photo', authenticate, upload_profile_photo_controller);

// Upload Resume
router.post('/upload-resume', authenticate, upload_resume_controller);

// Get Profile Photo
router.get('/profile-photo/:user_id', authenticate, get_profile_photo);

// Get Resume
router.get('/resume/:user_id', authenticate, get_resume);

export default router;
