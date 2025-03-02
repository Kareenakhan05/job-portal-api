const Team = require('../../models/team_model');
const { send_response } = require('../../helpers/response_helpers');

// ✅ Get All Team Members (With Filters & Pagination)
const get_all_members = async (req, res) => {
    try {
        let { department, search, status, page = 1, limit = 10 } = req.query;
        let filter = { is_deleted: false };

        if (department) filter.department = department;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) filter.status = status;

        const team = await Team.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean(); // Faster performance

        const total_count = await Team.countDocuments(filter);

        return send_response(res, 200, 'Team members fetched successfully', {
            total_count,
            page: parseInt(page),
            limit: parseInt(limit),
            members: team
        });
    } catch (error) {
        return send_response(res, 500, 'Error fetching team members', error.message);
    }
};

// ✅ Add a New Team Member
const add_member = async (req, res) => {
    try {
        const { name, email, phone, experience, department, salary, position, status, remark, join_date, release_date } = req.body;

        if (!name || !email || !phone || !department || !position) {
            return send_response(res, 400, 'Missing required fields (name, email, phone, department, position)');
        }

        const new_member = new Team({
            name,
            email,
            phone,
            experience,
            department,
            salary,
            position,
            status: status || 'Active',
            remark,
            join_date,
            release_date,
            aadhar_card: req?.files?.aadhar_card ? req.files.aadhar_card[0].path : null,
            pan_card: req?.files?.pan_card ? req.files.pan_card[0].path : null
        });

        await new_member.save();
        return send_response(res, 201, 'Team member added successfully', new_member);
    } catch (error) {
        return send_response(res, 500, 'Error adding team member', error.message);
    }
};

// ✅ Get Team Member by ID
const get_member_by_id = async (req, res) => {
    try {
        const member = await Team.findOne({ _id: req.params.id, is_deleted: false }).lean();

        if (!member) return send_response(res, 404, 'Team member not found');
        return send_response(res, 200, 'Team member details fetched successfully', member);
    } catch (error) {
        return send_response(res, 500, 'Error fetching team member', error.message);
    }
};

// ✅ Update Team Member
const update_member = async (req, res) => {
    try {
        const { name, email, phone, department, position } = req.body;

        if (!name || !email || !phone || !department || !position) {
            return send_response(res, 400, 'Missing required fields (name, email, phone, department, position)');
        }

        const updated_member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();

        if (!updated_member) return send_response(res, 404, 'Team member not found');
        return send_response(res, 200, 'Team member updated successfully', updated_member);
    } catch (error) {
        return send_response(res, 500, 'Error updating team member', error.message);
    }
};

// ✅ Soft Delete Team Member
const delete_member = async (req, res) => {
    try {
        const deleted_member = await Team.findByIdAndUpdate(req.params.id, { is_deleted: true }, { new: true });

        if (!deleted_member) return send_response(res, 404, 'Team member not found');
        return send_response(res, 200, 'Team member deleted successfully');
    } catch (error) {
        return send_response(res, 500, 'Error deleting team member', error.message);
    }
};

// ✅ Change Team Member Status (Active/Inactive)
const change_status = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Active', 'Inactive'].includes(status)) {
            return send_response(res, 400, 'Invalid status (must be Active or Inactive)');
        }

        const updated_member = await Team.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!updated_member) return send_response(res, 404, 'Team member not found');
        return send_response(res, 200, 'Status updated successfully', updated_member);
    } catch (error) {
        return send_response(res, 500, 'Error updating status', error.message);
    }
};

module.exports = { get_all_members, add_member, get_member_by_id, update_member, delete_member, change_status };