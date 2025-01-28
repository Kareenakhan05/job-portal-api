import { Router } from 'express';
import {
    createProfile,
    getProfile,
    updateProfile,
    changePassword,
    upsertProfile,
    getProfileById,
    uploadProfilePhotoController,
    uploadResumeController,
    getProfilePhoto,
    getResume
} from '../controllers/profileController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Create Profile
router.post('/profile', authenticate, createProfile);

// Get Profile by Email
router.get('/profile/:email', authenticate, getProfile);

// Update Profile by Email
router.put('/profile/:email', authenticate, updateProfile);

// Change Password
router.post('/change-password', authenticate, changePassword);

// Create or Update Profile (Upsert)
router.put('/upsert-profile', authenticate, upsertProfile);

// Get Profile by ID (User-specific)
router.get('/profile/id/:userId', authenticate, getProfileById);

// Upload Profile Picture
router.post('/upload-profile-photo', authenticate, uploadProfilePhotoController);

// Upload Resume
router.post('/upload-resume', authenticate, uploadResumeController);

// Get Profile Photo
router.get('/profile-photo/:userId', authenticate, getProfilePhoto);

// Get Resume
router.get('/resume/:userId', authenticate, getResume);

export default router;
