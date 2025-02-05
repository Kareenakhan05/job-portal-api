const jwt = require('jsonwebtoken');
const user = require('../models/user');

const authenticate_user = async (req, res, next) => {
    const { token } = req.body;  // Extract token from the body

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_data = await user.findById(decoded.id);

        if (!user_data || user_data.role !== 'user') {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.user = user_data;  // Attach user data to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate_user;
