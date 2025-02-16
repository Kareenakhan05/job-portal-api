const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema(
    {
        plan_name: { type: String, required: true },
        job_post_limit: { type: Number, required: true },
        resume_check_limit: { type: Number, required: true },
        validity_days: { type: Number, required: true },
        price: { type: Number, required: true },
        is_deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Subscription', SubscriptionSchema);
