const Subscription = require('../../models/subscription'); // Subscription Model
const responseMiddleware = require('../../middlewares/responseMiddleware'); // Response Helper
const { validationResult } = require('express-validator');

// ✅ Create a new subscription plan (Admin Only)
const create_subscription = async (req, res) => {
    try {
        // Validate request data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseMiddleware(res, 400, "Validation error", errors.array());
        }

        const { plan_name, job_post_limit, resume_check_limit, validity_days, price } = req.body;

        // Check if the plan already exists
        const existingPlan = await Subscription.findOne({ plan_name });
        if (existingPlan) {
            return responseMiddleware(res, 400, "A subscription plan with this name already exists");
        }

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

// ✅ Get all subscription plans (Admin & Recruiters) with pagination & soft delete handling
const get_all_subscriptions = async (req, res) => {
    try {
        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        // Only fetch active plans
        const plans = await Subscription.find({ is_deleted: false })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalPlans = await Subscription.countDocuments({ is_deleted: false });

        return responseMiddleware(res, 200, "Subscription plans fetched successfully", {
            plans,
            currentPage: page,
            totalPages: Math.ceil(totalPlans / limit),
            totalPlans
        });
    } catch (err) {
        return responseMiddleware(res, 500, "Error fetching subscription plans", err.message);
    }
};

// ✅ Get a subscription plan by ID
const get_subscription_by_id = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await Subscription.findOne({ _id: id, is_deleted: false });

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
        const updates = req.body;

        // Prevent updating a deleted plan
        const existingPlan = await Subscription.findOne({ _id: id, is_deleted: false });
        if (!existingPlan) {
            return responseMiddleware(res, 404, "Subscription plan not found or has been deleted");
        }

        const updatedPlan = await Subscription.findByIdAndUpdate(id, updates, { new: true });

        return responseMiddleware(res, 200, "Subscription plan updated successfully", updatedPlan);
    } catch (err) {
        return responseMiddleware(res, 500, "Error updating subscription plan", err.message);
    }
};

// ✅ Delete subscription plan (Soft Delete - Admin Only)
const delete_subscription = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting an already deleted plan
        const existingPlan = await Subscription.findById(id);
        if (!existingPlan) {
            return responseMiddleware(res, 404, "Subscription plan not found");
        }
        if (existingPlan.is_deleted) {
            return responseMiddleware(res, 400, "Subscription plan already deleted");
        }

        const deletedPlan = await Subscription.findByIdAndUpdate(id, { is_deleted: true }, { new: true });

        return responseMiddleware(res, 200, "Subscription plan deleted successfully", deletedPlan);
    } catch (err) {
        return responseMiddleware(res, 500, "Error deleting subscription plan", err.message);
    }
};


module.exports = {
    create_subscription,
    get_all_subscriptions,
    get_subscription_by_id,
    update_subscription,
    delete_subscription
};