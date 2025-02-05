const jwt = require('jsonwebtoken');
const user = require('../models/user'); // Assuming recruiter data is stored in the User model

const authenticate_recruiter = async (req, res, next) => {
    const { token } = req.body;  // Extract token from the body

    // Check if the token is provided
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        // Decode and verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the recruiter from the database using the decoded ID
        const recruiter_data = await user.findById(decoded.id);

        // Check if the recruiter is valid and has the correct role
        if (!recruiter_data || recruiter_data.role !== 'recruiter') {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Unauthorized recruiter'
            });
        }

        // Attach recruiter data to the request object for use in the next middleware or route handler
        req.user = recruiter_data;

        // Continue to the next middleware or route handler
        next();
    } catch (err) {
        // Handle invalid token error
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = authenticate_recruiter;
