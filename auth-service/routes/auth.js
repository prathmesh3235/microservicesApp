const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios = require('axios')

// Initiating Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handling Google callback
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
    const { token, email } = req.user; // Ensure that email is retrieved correctly

    try {
        // Send login notification
        await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/send-login-notification`, {
            email: email, 
            message: 'You have successfully logged in.'
        });

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    } catch (error) {
        console.error('Error sending login notification:', error);
        // Redirect to frontend regardless, but log the error
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    }
});


// Logout route
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.json({ message: 'Logged out successfully' });
        // res.redirect(`${process.env.FRONTEND_URL}/login`);

    });
});

module.exports = router;
