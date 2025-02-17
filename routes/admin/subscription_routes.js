const express = require('express');
const router = express.Router();
const { create_subscription, get_all_subscriptions, get_subscription_by_id, update_subscription, delete_subscription } = require('../../controllers/admin/subscription_controller');
const { validate_subscription } = require('../../validators/admin/subscription_validators');
const auth_middleware = require('../../middlewares/auth_middleware');

// ✅ Subscriptions Management Routes
router.post('/create', auth_middleware, validate_subscription, create_subscription);
router.get('/', auth_middleware, get_all_subscriptions);
router.get('/:id', auth_middleware, get_subscription_by_id);
router.put('/:id', auth_middleware, validate_subscription, update_subscription);
router.delete('/:id', auth_middleware, delete_subscription);

module.exports = router;
