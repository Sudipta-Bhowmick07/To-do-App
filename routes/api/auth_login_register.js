const express = require('express');
const router = express.Router();
const User = require('../../models/User'); // We need to create a User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, phone_no, password } = req.body;
    // Simple validation for all fields
    if (!username || !email || !phone_no || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }
    try {
        // Check if a user with the same email or phone number already exists
        let user = await User.findOne({ $or: [{ email }, { phone_no }] });
        if (user) {
            return res.status(400).json({ message: 'User with that email or phone number already exists.' });
        }
        // Create a new user instance
        user = new User({ username, email, phone_no, password });
        // Save the user to the database
        await user.save();
        // Create a JWT payload
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        // Create a JWT payload
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;