import multer from 'multer';
import path from 'path';

// Set up storage configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set directory for file uploads based on the fieldname
        const uploadPath = file.fieldname === 'resume' ? 'uploads/resumes/' : 'uploads/profile_pictures/';
        cb(null, uploadPath); // Define separate directories for profile photos and resumes
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using the current time and a random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Create a unique filename with extension
    }
});

// File type filters to allow only specific types for resume and profile photo uploads
const file_filter = (req, file, cb) => {
    // Handle file type validation based on the fieldname
    if (file.fieldname === 'resume') {
        // Allow PDF, DOC, DOCX for resumes
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

    cb(null, true); // Accept the file if it passes the filter
};

// Create multer upload instances for profile photo and resume
const upload_profile_photo = multer({ storage, fileFilter: file_filter }).single('profilePicture');
const upload_resume = multer({ storage, fileFilter: file_filter }).single('resume');

export { upload_profile_photo, upload_resume };
