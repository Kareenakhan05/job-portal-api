import multer from 'multer';
import path from 'path';

// Set up storage configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = file.fieldname === 'resume' ? 'uploads/resumes/' : 'uploads/profile_pictures/';
        cb(null, uploadPath); // Define separate directories for profile photos and resumes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
    }
});

// File type filters to allow only specific types
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resume') {
        // Allow PDF, DOC, DOCX for resume uploads
        const allowedTypes = /pdf|doc|docx/;
        if (!allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
            return cb(new Error('Only PDF, DOC, DOCX files are allowed for resumes.'));
        }
    } else if (file.fieldname === 'profilePicture') {
        // Allow image files for profile photo uploads
        const allowedTypes = /jpeg|jpg|png/;
        if (!allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
            return cb(new Error('Only JPG, JPEG, PNG files are allowed for profile photos.'));
        }
    }
    cb(null, true); // Accept the file
};

// Create multer upload instances for profile photo and resume
const uploadProfilePhoto = multer({ storage, fileFilter }).single('profilePicture');
const uploadResume = multer({ storage, fileFilter }).single('resume');

export { uploadProfilePhoto, uploadResume };
