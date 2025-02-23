const SubAdmin = require('../../models/sub_admin');
const bcrypt = require('bcryptjs');
const { responseHandler } = require('../../helpers/response_helpers');

// ✅ 1️⃣ Get All Sub-Admins (Search & Pagination)
const get_all_sub_admins = async (req, res) => {
    try {
        let { search, page = 1, limit = 10 } = req.query;
        let filter = {};

        if (search) {
            filter.$or = [
                { name: new RegExp(search, "i") },
                { email: new RegExp(search, "i") }
            ];
        }

        const subAdmins = await SubAdmin.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select("-password");

        const total_count = await SubAdmin.countDocuments(filter);

        return responseHandler(res, 200, "Sub-Admins fetched successfully", {
            subAdmins,
            total_count,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        return responseHandler(res, 500, "Server Error", err.message);
    }
};

// ✅ 2️⃣ Add New Sub-Admin
const add_sub_admin = async (req, res) => {
    try {
        const { name, email, password, permissions } = req.body;

        if (!name || !email || !password) {
            return responseHandler(res, 400, "All fields are required.");
        }

        const existingAdmin = await SubAdmin.findOne({ email });
        if (existingAdmin) {
            return responseHandler(res, 400, "Sub-Admin with this email already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSubAdmin = await SubAdmin.create({
            name,
            email,
            password: hashedPassword,
            permissions
        });

        return responseHandler(res, 201, "Sub-Admin added successfully.", newSubAdmin);
    } catch (err) {
        return responseHandler(res, 500, "Server Error", err.message);
    }
};

// ✅ 3️⃣ Update Sub-Admin Permissions
const update_sub_admin_permissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;

        const updatedAdmin = await SubAdmin.findByIdAndUpdate(
            id,
            { permissions },
            { new: true }
        );

        if (!updatedAdmin) {
            return responseHandler(res, 404, "Sub-Admin not found.");
        }

        return responseHandler(res, 200, "Permissions updated successfully.", updatedAdmin);
    } catch (err) {
        return responseHandler(res, 500, "Server Error", err.message);
    }
};

// ✅ 4️⃣ View Single Sub-Admin Details
const view_sub_admin = async (req, res) => {
    try {
        const { id } = req.params;
        const subAdmin = await SubAdmin.findById(id).select("-password");

        if (!subAdmin) {
            return responseHandler(res, 404, "Sub-Admin not found.");
        }

        return responseHandler(res, 200, "Sub-Admin details fetched.", subAdmin);
    } catch (err) {
        return responseHandler(res, 500, "Server Error", err.message);
    }
};

// ✅ 5️⃣ Delete Sub-Admin
const delete_sub_admin = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAdmin = await SubAdmin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return responseHandler(res, 404, "Sub-Admin not found.");
        }

        return responseHandler(res, 200, "Sub-Admin deleted successfully.");
    } catch (err) {
        return responseHandler(res, 500, "Server Error", err.message);
    }
};

module.exports = {
    get_all_sub_admins,
    add_sub_admin,
    update_sub_admin_permissions,
    view_sub_admin,
    delete_sub_admin
};
