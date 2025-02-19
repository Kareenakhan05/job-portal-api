const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema(
    {
        section_name: { 
            type: String, 
            enum: ['privacy_policy', 'terms_conditions', 'about_us'], 
            required: true, 
            unique: true 
        },
        content: { 
            type: String, 
            required: true, 
            trim: true 
        }
    },
    { timestamps: true } // ✅ Auto-manages `createdAt` & `updatedAt`
);

// ✅ Indexing for faster queries
cmsSchema.index({ section_name: 1 });

module.exports = mongoose.model('CMS', cmsSchema);
