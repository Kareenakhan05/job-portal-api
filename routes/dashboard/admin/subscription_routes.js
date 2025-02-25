const express = require('express');
const router = express.Router();

// ✅ Import Controllers
const { 
    create_subscription, 
    get_all_subscriptions, 
    get_subscription_by_id, 
    update_subscription, 
    delete_subscription 
} = require('../../../controllers/dashboard/admin/subscription_controller');

// ✅ Import Middleware & Validator
const { validate_subscription } = require('../../../validators/dashboard/admin/subscription_validators');
const { auth_middleware, verify_admin } = require('../../../middlewares/auth_middleware'); // ✅ Correct import

// ✅ Subscriptions Management Routes

// ➕ Create a new subscription
router.post('/create', auth_middleware, verify_admin, validate_subscription, create_subscription);

// 📋 Get all subscriptions
router.get('/', auth_middleware, verify_admin, get_all_subscriptions);

// 🔍 Get subscription details by ID
router.get('/:id', auth_middleware, verify_admin, get_subscription_by_id);

// ✏️ Update subscription details
router.put('/:id', auth_middleware, verify_admin, validate_subscription, update_subscription);

// ❌ Delete a subscription
router.delete('/:id', auth_middleware, verify_admin, delete_subscription);

// ✅ Export Router
module.exports = router;
