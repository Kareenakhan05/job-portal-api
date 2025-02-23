const express = require('express');
const router = express.Router();

// ✅ Import Controllers
const { get_cms_content, update_cms_content } = require('../../controllers/admin/cms');

// ✅ Import Middleware
const { auth_middleware, verify_admin } = require('../../middlewares/auth_middleware'); // ✅ Correct import

// ✅ CMS Management Routes

// 📄 Fetch CMS Content (Public)
router.get('/content', get_cms_content);

// ✏️ Update CMS Content (Admin Only)
router.put('/update', auth_middleware, verify_admin, update_cms_content);

// ✅ Export Router
module.exports = router;
