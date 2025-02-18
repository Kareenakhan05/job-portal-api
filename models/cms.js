const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
    section_name: { type: String, enum: ['privacy_policy', 'terms_conditions', 'about_us'], required: true, unique: true },
    content: { type: String, required: true },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CMS', cmsSchema);
