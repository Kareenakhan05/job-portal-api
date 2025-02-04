
const Recruiter = require("../../models/recruiter");

const sendResponse = (res, status, message, data = null) => {
    return res.status(status).json({ message, data });
};

//  Set Profile
async function set_profile(req, res) {
    try {
        const { id: recruiter_id } = req.user;
        const { company_name, company_website, description, profile_picture } = req.body;

        const recruiter = await Recruiter.findById(recruiter_id);
        if (!recruiter) return sendResponse(res, 404, "Recruiter not found");

        recruiter.company_name = company_name || recruiter.company_name;
        recruiter.company_website = company_website || recruiter.company_website;
        recruiter.description = description || recruiter.description;
        recruiter.profile_picture = profile_picture || recruiter.profile_picture;

        await recruiter.save();
        sendResponse(res, 200, "Profile set successfully", recruiter);
    } catch (err) {
        sendResponse(res, 500, "Server error", err.message);
    }
}

//  Get Profile
async function get_profile(req, res) {
    try {
        const recruiter = await Recruiter.findById(req.user.id);
        if (!recruiter) return sendResponse(res, 404, "Recruiter not found");

        sendResponse(res, 200, "Profile retrieved successfully", recruiter);
    } catch (err) {
        sendResponse(res, 500, "Server error", err.message);
    }
}

//  Update Profile
async function update_profile(req, res) {
    try {
        const { id: recruiter_id } = req.user;
        const updates = req.body;

        const recruiter = await Recruiter.findByIdAndUpdate(recruiter_id, updates, { new: true });
        if (!recruiter) return sendResponse(res, 404, "Recruiter not found");

        sendResponse(res, 200, "Profile updated successfully", recruiter);
    } catch (err) {
        sendResponse(res, 500, "Server error", err.message);
    }
}

//  Change Password
async function change_password(req, res) {
    try {
        const { old_password, new_password } = req.body;
        const recruiter = await Recruiter.findById(req.user.id);

        if (!recruiter) return sendResponse(res, 404, "Recruiter not found");

        const isMatch = await bcrypt.compare(old_password, recruiter.password);
        if (!isMatch) return sendResponse(res, 400, "Old password is incorrect");

        recruiter.password = await bcrypt.hash(new_password, 10);
        await recruiter.save();

        sendResponse(res, 200, "Password changed successfully");
    } catch (err) {
        sendResponse(res, 500, "Server error", err.message);
    }
}

module.exports = {
    set_profile,
    get_profile,
    update_profile,
    change_password
};
