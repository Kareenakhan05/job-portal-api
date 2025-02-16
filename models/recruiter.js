const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    recruiter_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true }, // Indexed for faster search
    contact_number: { type: String, required: true },
    password: { type: String, required: true },
    company_website: { type: String },
    description: { type: String },
    profile_picture: { type: String },

    // ✅ New Fields Based on Client Requirements
    subscription_type: { type: String, enum: ["Free", "Premium", "Enterprise"], default: "Free" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Inactive" },
    admin_notes: { type: String }, // Admin can add remarks
    is_deleted: { type: Boolean, default: false }, // Soft delete flag
    last_login: { type: Date }, // Track last login
    last_updated: { type: Date, default: Date.now } // Track last update
}, { timestamps: true });

module.exports = mongoose.model("Recruiter", recruiterSchema);
