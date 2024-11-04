const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios = require('axios');
const User = require('../models/Users');

// Initiating Google login
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handling Google callback
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
    const { token, email } = req.user; // Ensure that email is retrieved correctly

    try {
        let user = await User.findOne({ token });

        if (!user) {
            // If user does not exist, create a new user
            user = new User({
                token,
                email,
                isManager: email === "prathmesh32352@gmail.com" ? true : false // Set isManager to true if email matches
            });
            await user.save();
            console.log(`New user created with email: ${email}`);
        } else {
            console.log(`Existing user found with email: ${email}`);
        }
        // Send login notification
        await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/send-login-notification`, {
            email: email, 
            message: 'You have successfully logged in.'
        });

        // Redirect to frontend with token and email
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?email=${email}&token=${token}`);
    } catch (error) {
        console.error('Error sending login notification:', error);
        // Redirect to frontend regardless, but log the error
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?email=${email}&token=${token}`);
    }
});


// Logout route
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
