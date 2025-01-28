import jwt from 'jsonwebtoken'; // Import the jsonwebtoken package

// Helper function for standardized responses
const sendResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        message,
        data
    });
};

// Authentication Middleware
export function authenticate(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token after 'Bearer'

    if (!token) {
        return sendResponse(res, 401, 'No token, authorization denied');
    }

    try {
        // Verify token using the JWT_SECRET from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object for downstream access
        req.user = decoded; // This includes user ID and any other data from the token

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        sendResponse(res, 401, 'Invalid token', err.message);
    }
}
