const express = require('express');
const router = express.Router();
const { 
    get_all_sub_admins, 
    add_sub_admin, 
    update_sub_admin_permissions, 
    view_sub_admin, 
    delete_sub_admin 
} = require('../../controllers/admin/sub_admin');
const { auth_middleware, verify_admin } = require('../../middlewares/auth_middleware');

// Routes for Sub-Admin 
router.get('/sub-admins', verify_admin, get_all_sub_admins);
router.post('/sub-admins', verify_admin, add_sub_admin);
router.put('/sub-admins/:id/permissions', verify_admin, update_sub_admin_permissions);
router.get('/sub-admins/:id', verify_admin, view_sub_admin);
router.delete('/sub-admins/:id', verify_admin, delete_sub_admin);

module.exports = router;
