const express = require("express");
const router = express.Router();
const recruiterProfileController = require("../../controllers/recruiter/profile");
const { validate_profile, validate_password_change } = require("../../validators/recruiter/profile");


// Apply recruiter authentication to all profile routes


// **Set Profile**
router.post("/profile", validate_profile, recruiterProfileController.set_profile);

// **Get Profile**
router.get("/profile", recruiterProfileController.get_profile);

// **Update Profile**
router.put("/profile", validate_profile, recruiterProfileController.update_profile);

// **Change Password**
router.put("/profile/change-password", validate_password_change, recruiterProfileController.change_password);

module.exports = router;
