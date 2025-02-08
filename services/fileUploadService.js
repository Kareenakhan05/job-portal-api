const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const ensureUploadPath = (uploadPath) => {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
};

// Set up storage configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath =
            file.fieldname === "resume"
                ? "uploads/resumes/"
                : "uploads/profile_pictures/";

        ensureUploadPath(uploadPath); // Create directory if it doesn't exist
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// File type filters to allow only specific types for resume and profile photo uploads
const fileFilter = (req, file, cb) => {
    const allowedTypes = {
        resume: /pdf|doc|docx/,
        profile_picture: /jpeg|jpg|png/, // ✅ Changed `profilePicture` to `profile_picture`
    };

    if (allowedTypes[file.fieldname] && !allowedTypes[file.fieldname].test(path.extname(file.originalname).toLowerCase())) {
        return cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${allowedTypes[file.fieldname]}`));
    }

    cb(null, true);
};

// Create multer upload instances
const upload_profile_photo = multer({ storage, fileFilter }).single("profile_picture"); // ✅ Fixed field name
const upload_resume = multer({ storage, fileFilter }).single("resume");

module.exports = { upload_profile_photo, upload_resume };
