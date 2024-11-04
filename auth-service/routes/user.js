const express = require('express');
const router = express.Router();
const User = require('../models/Users'); // Adjust the path if needed

// Route to fetch a user by email
router.get('/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
});

module.exports = router;
