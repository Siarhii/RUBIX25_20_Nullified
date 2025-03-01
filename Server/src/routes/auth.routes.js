const express = require('express');
const axios = require("axios");
const router = express.Router();

const User = require('../models/User.model.js');
const { generateToken } = require('../utils/jwt.utils.js');

//register
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ email, password, name });
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Google login route
router.post("/google", async (req, res) => {
    const { access_token } = req.body;

    try {
        const { data: userInfo } = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const { sub: googleId, email, name, picture } = userInfo;

        let user = await User.findOne({ googleId });

        if (!user) {
            user = new User({ googleId, email, name, profilePicture: picture });
            await user.save();
        }

        const jwtToken = generateToken(user._id);

        res.status(200).json({ message: "Google login successful", token: jwtToken });
    } catch (err) {
        console.log("Error is : ", err);
        res.status(401).json({ message: "Invalid Google token" });
    }
});

module.exports = router;