const mongoose = require('mongoose');

const subAdminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    joined_date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    permissions: {
        recruiter: { view: Boolean, edit: Boolean, list: Boolean },
        subscription: { view: Boolean, edit: Boolean, list: Boolean },
        payment: { view: Boolean, edit: Boolean, list: Boolean }
    }
}, { timestamps: true });

module.exports = mongoose.model('SubAdmin', subAdminSchema);
