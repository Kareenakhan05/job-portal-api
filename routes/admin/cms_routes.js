const express = require('express');
const router = express.Router();
const { get_cms_content, update_cms_content } = require('../../controllers/admin/cms');
const authMiddleware = require('../../middlewares/auth_middleware');

router.get('/content', get_cms_content); // Fetch CMS Content
router.put('/update', authMiddleware, update_cms_content); // Update CMS Content (Admin Only)

module.exports = router;
