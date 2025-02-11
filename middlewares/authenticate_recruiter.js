const jwt = require('jsonwebtoken');
const { send_response } = require('../middlewares/responseMiddleware'); 

const authenticateRecruiter = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return send_response(res, 401, 'Unauthorized: No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.recruiter = decoded;
        next();
    } catch (error) {
        return send_response(res, 401, 'Unauthorized: Invalid token');
    }
};

module.exports = authenticateRecruiter; // ✅ Ensure correct export
