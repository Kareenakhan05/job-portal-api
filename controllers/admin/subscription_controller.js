const Subscription = require('../../models/subscription'); // Subscription Model
const responseMiddleware = require('../../middlewares/responseMiddleware'); // Response Helper

// ✅ Create a new subscription plan (Admin Only)
const create_subscription = async (req, res) => {
    try {
        const { plan_name, job_post_limit, resume_check_limit, validity_days, price } = req.body;

        const newPlan = new Subscription({
            plan_name,
            job_post_limit,
            resume_check_limit,
            validity_days,
            price
        });

        await newPlan.save();

        return responseMiddleware(res, 201, "Subscription plan created successfully", newPlan);
    } catch (err) {
        return responseMiddleware(res, 500, "Error creating subscription plan", err.message);
    }
};

// ✅ Get all subscription plans (Admin & Recruiters)
const get_all_subscriptions = async (req, res) => {
    try {
        const plans = await Subscription.find();
        return responseMiddleware(res, 200, "Subscription plans fetched successfully", plans);
    } catch (err) {
        return responseMiddleware(res, 500, "Error fetching subscription plans", err.message);
    }
};

// ✅ Get a subscription plan by ID
const get_subscription_by_id = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await Subscription.findById(id);
        if (!plan) {
            return responseMiddleware(res, 404, "Subscription plan not found");
        }
        return responseMiddleware(res, 200, "Subscription plan fetched successfully", plan);
    } catch (err) {
        return responseMiddleware(res, 500, "Error fetching subscription plan", err.message);
    }
};

// ✅ Update subscription plan (Admin Only)
const update_subscription = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPlan = await Subscription.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPlan) {
            return responseMiddleware(res, 404, "Subscription plan not found");
        }
        return responseMiddleware(res, 200, "Subscription plan updated successfully", updatedPlan);
    } catch (err) {
        return responseMiddleware(res, 500, "Error updating subscription plan", err.message);
    }
};

// ✅ Delete subscription plan (Soft Delete - Admin Only)
const delete_subscription = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPlan = await Subscription.findByIdAndUpdate(id, { is_deleted: true }, { new: true });

        if (!deletedPlan) {
            return responseMiddleware(res, 404, "Subscription plan not found");
        }
        return responseMiddleware(res, 200, "Subscription plan deleted successfully");
    } catch (err) {
        return responseMiddleware(res, 500, "Error deleting subscription plan", err.message);
    }
};

// ✅ Export all functions
module.exports = {
    create_subscription,
    get_all_subscriptions,
    get_subscription_by_id,
    update_subscription,
    delete_subscription
};
