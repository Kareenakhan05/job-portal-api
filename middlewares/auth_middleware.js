const jwt = require('jsonwebtoken');
const responseHelper = require('../helpers/response_helpers');
const User = require('../models/user'); // Import the user model

// ✅ Auth Middleware - Verifies Token & Attaches User
const auth_middleware = async (req, res, next) => {
    try {
        let token = req.header('Authorization');

        if (!token) {
            return responseHelper.unauthorized(res, 'Access denied. No token provided.');
        }

        // Handle 'Bearer token' and 'token' formats
        token = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return responseHelper.unauthorized(res, 'Invalid token. User not found.');
        }

        req.user = user; // Attach user details to request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return responseHelper.unauthorized(res, 'Token has expired. Please log in again.');
        }
        return responseHelper.error(res, `Authentication failed: ${error.message}`);
    }
};

// ✅ Admin Middleware - Ensures User is Admin
const verify_admin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return responseHelper.forbidden(res, 'Unauthorized: Admin access required.');
    }
    next();
};

// ✅ Export Both Middlewares
module.exports = { auth_middleware, verify_admin };
