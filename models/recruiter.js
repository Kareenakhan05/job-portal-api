
const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
    company_name: { type: String },
    recruiter_name: { type: String },
    email: { type: String, required: true, unique: true },
    contact_number: { type: String },
    password: { type: String, required: true },
    company_website: { type: String },
    description: { type: String },
    profile_picture: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Recruiter", recruiterSchema);
