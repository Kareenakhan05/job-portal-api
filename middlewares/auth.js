import jwt from 'jsonwebtoken'; // Import the jsonwebtoken package

export function authenticate(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token after 'Bearer'

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token using the JWT_SECRET from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object for downstream access
        req.user = decoded; // This includes user ID and any other data from the token

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token', error: err.message });
    }
}
