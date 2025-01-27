import jwt from 'jsonwebtoken'; // Import the whole jsonwebtoken package

export function authenticate(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use jwt.verify instead of verify
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token', error: err.message });
    }
}
