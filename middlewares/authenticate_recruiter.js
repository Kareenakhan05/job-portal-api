const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateRecruiter = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'recruiter') {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.user = user; // Attach recruiter data to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateRecruiter;
