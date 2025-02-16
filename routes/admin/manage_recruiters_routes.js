const express = require('express');
const router = express.Router();

// ✅ Import Controllers
const {
    get_recruiters,
    get_recruiter_details,
    approve_recruiter,
    reject_recruiter,
    edit_recruiter,
    add_admin_notes,
    delete_recruiter
} = require('../../controllers/admin/manage_recruiters_controller');

// ✅ Import Middlewares
const authMiddleware = require('../../middlewares/auth_middleware'); // To protect admin routes
const { validate_id } = require('../../validators/admin/manage_recruiter_validators');

// ✅ Recruiter Management Routes

// 🧑‍💻 Get all recruiters with filters & pagination
router.get('/', authMiddleware, get_recruiters);

// 🔍 Get recruiter details by ID
router.get('/:id', authMiddleware, validate_id, get_recruiter_details);

// ✅ Approve a recruiter (set status to Active)
router.put('/:id/approve', authMiddleware, validate_id, approve_recruiter);

// ❌ Reject a recruiter (set status to Inactive)
router.put('/:id/reject', authMiddleware, validate_id, reject_recruiter);

// 📝 Edit recruiter details
router.put('/:id/edit', authMiddleware, validate_id, edit_recruiter);

// 🗒️ Add admin notes to a recruiter
router.put('/:id/admin-notes', authMiddleware, validate_id, add_admin_notes);

// 🗑️ Soft delete a recruiter (mark as is_deleted: true)
router.delete('/:id', authMiddleware, validate_id, delete_recruiter);

// ✅ Export Router
module.exports = router;
