const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

    const token =
        req.headers.authorization?.split(' ')[1] ||
        req.body.token ||
        req.cookies?.authToken;
    if (!token) {
        return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
}

module.exports = authenticateToken;
