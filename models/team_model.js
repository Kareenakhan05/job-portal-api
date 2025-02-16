const mongoose = require("mongoose");

const team_schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        experience: { type: Number, required: true }, // Experience in years
        department: { type: String, enum: ["HR", "Tech", "Design", "Operations"], required: true },
        salary: { type: Number, required: true },
        position: { type: String, required: true },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
        remark: { type: String }, // Admin remarks
        join_date: { type: Date, required: true }, // Employee joining date
        release_date: { type: Date }, // Employee release date (nullable)
        aadhar_card: { type: String }, // Aadhar image URL
        pan_card: { type: String }, // PAN image URL
        is_deleted: { type: Boolean, default: false }, // Soft delete field
    },
    { timestamps: true }
);

module.exports = mongoose.model("Team", team_schema);
