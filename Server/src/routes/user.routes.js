const express = require('express');
const router = express.Router();
const User = require('../models/User.model.js');
const authMiddleware = require('../middleware/auth.middleware.js');

router.get('/user', authMiddleware, async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User information retrieved successfully', user });
    } catch (err) {
        console.error('Error retrieving user information:', err);
        res.status(500).json({ message: 'Error retrieving user information' });
    }
});

module.exports = router;