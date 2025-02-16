const Team = require('../../models/team_model');
const { send_response } = require('../../helpers/response_helpers');

// ✅ Get All Team Members (With Filters)
const get_all_members = async (req, res) => {
    try {
        const { department, search, status } = req.query;
        let filter = { is_deleted: false };

        if (department) filter.department = department;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) filter.status = status; // Active/Inactive filter

        const team = await Team.find(filter).sort({ createdAt: -1 });
        return send_response(res, 200, 'Team members fetched successfully', team);
    } catch (error) {
        return send_response(res, 500, 'Error fetching team members', error.message);
    }
};

// ✅ Add a New Team Member
const add_member = async (req, res) => {
    try {
        const { name, email, phone, experience, department, salary, position, status, remark, join_date, release_date } = req.body;

        const new_member = new Team({
            name,
            email,
            phone,
            experience,
            department,
            salary,
            position,
            status,
            remark,
            join_date,
            release_date,
            aadhar_card: req.files?.aadhar_card?.[0]?.path || null, // Upload Aadhar Image
            pan_card: req.files?.pan_card?.[0]?.path || null // Upload PAN Image
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
        const member = await Team.findOne({ _id: req.params.id, is_deleted: false });

        if (!member) return send_response(res, 404, 'Team member not found');
        return send_response(res, 200, 'Team member details', member);
    } catch (error) {
        return send_response(res, 500, 'Error fetching team member', error.message);
    }
};

// ✅ Update Team Member
const update_member = async (req, res) => {
    try {
        const updated_member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });

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
            return send_response(res, 400, 'Invalid status');
        }

        const updated_member = await Team.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!updated_member) return send_response(res, 404, 'Team member not found');
        return send_response(res, 200, 'Status updated successfully', updated_member);
    } catch (error) {
        return send_response(res, 500, 'Error updating status', error.message);
    }
};

module.exports = { get_all_members, add_member, get_member_by_id, update_member, delete_member, change_status };
