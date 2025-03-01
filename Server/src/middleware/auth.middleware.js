const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token =
        req.headers.authorization?.split(' ')[1] ||
        req.cookies?.authToken;

    if (!token) {
        return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token expired. Please log in again.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token. Please log in again.' });
        } else {
            return res.status(500).json({ message: 'Internal server error during token verification.' });
        }
    }
}

module.exports = authenticateToken;