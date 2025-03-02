const Recruiter = require('../../models/recruiter');
const responseHelper = require('../../helpers/response_helpers');

// ✅ GET: Fetch list of recruiters with pagination, filtering, sorting
const get_recruiters = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status, subscription_type } = req.query;
        const filters = { role: 'recruiter', is_deleted: false }; // Fetch only active recruiters

        if (subscription_type) filters.subscription_type = subscription_type;
        if (status) filters.status = status; // Filter by Active/Inactive

        if (search) {
            filters.$or = [
                { owner_name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { organization_name: { $regex: search, $options: 'i' } }
            ];
        }

        const total_count = await Recruiter.countDocuments(filters);
        const recruiters = await Recruiter.find(filters, 'owner_name email phone organization_name subscription_type status registered_date last_login')
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        return responseHelper.success(res, {
            total_count,
            page: Number(page),
            limit: Number(limit),
            recruiters
        });
    } catch (error) {
        return responseHelper.error(res, error.message);
    }
};

// ✅ GET: Fetch single recruiter details (Full details view)
const get_recruiter_details = async (req, res) => {
    try {
        const { id } = req.params;
        const recruiter = await Recruiter.findById(id).select('-password');

        if (!recruiter || recruiter.is_deleted) {
            return responseHelper.not_found(res, 'Recruiter not found');
        }

        return responseHelper.success(res, recruiter);
    } catch (error) {
        return responseHelper.error(res, error.message);
    }
};

// ✅ PUT: Approve Recruiter (Activate account)
const approve_recruiter = async (req, res) => {
    try {
        const { id } = req.params;
        const recruiter = await Recruiter.findByIdAndUpdate(
            id,
            { status: 'Active', last_updated: new Date() },
            { new: true }
        );

        if (!recruiter || recruiter.is_deleted) {
            return responseHelper.not_found(res, 'Recruiter not found');
        }

        return responseHelper.success(res, recruiter, 'Recruiter approved successfully');
    } catch (error) {
        return responseHelper.error(res, error.message);
    }
};

// ✅ PUT: Reject Recruiter (Deactivate account)
const reject_recruiter = async (req, res) => {
    try {
        const { id } = req.params;
        const recruiter = await Recruiter.findByIdAndUpdate(
            id,
            { status: 'Inactive', last_updated: new Date() },
            { new: true }
        );

        if (!recruiter || recruiter.is_deleted) {
            return responseHelper.not_found(res, 'Recruiter not found');
        }

        return responseHelper.success(res, recruiter, 'Recruiter rejected successfully');
    } catch (error) {
        return responseHelper.error(res, error.message);
    }
};

// ✅ PUT: Edit Recruiter Details
const edit_recruiter = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body, last_updated: new Date() };

        const recruiter = await Recruiter.findByIdAndUpdate(id, updateData, { new: true });

        if (!recruiter || recruiter.is_deleted) {
            return responseHelper.not_found(res, 'Recruiter not found');
        }

        return responseHelper.success(res, recruiter, 'Recruiter details updated successfully');
    } catch (error) {
        return responseHelper.error(res, error.message);
    }
};

// ✅ PUT: Add Admin Notes
const add_admin_notes = async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_notes } = req.body;

        const recruiter = await Recruiter.findByIdAndUpdate(
            id,
            { admin_notes, last_updated: new Date() },
            { new: true }
        );

        if (!recruiter || recruiter.is_deleted) {
            return responseHelper.not_found(res, 'Recruiter not found');
        }

        return responseHelper.success(res, recruiter, 'Admin notes added successfully');
    } catch (error) {
        return responseHelper.error(res, error.message);
    }
};

// ✅ DELETE: Soft Delete Recruiter (Mark as deleted instead of permanent delete)
const delete_recruiter = async (req, res) => {
    try {
        const { id } = req.params;

        const recruiter = await Recruiter.findByIdAndUpdate(id, { is_deleted: true }, { new: true });

        if (!recruiter) {
            return responseHelper.not_found(res, 'Recruiter not found');
        }

        return responseHelper.success(res, {}, 'Recruiter deleted successfully');
    } catch (error) {
        return responseHelper.error(res, error.message);
    }
};

// ✅ Export all functions
module.exports = {
    get_recruiters,
    get_recruiter_details,
    approve_recruiter,
    reject_recruiter,
    edit_recruiter,
    add_admin_notes,
    delete_recruiter
};