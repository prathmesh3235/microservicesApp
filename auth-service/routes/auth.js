const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiating Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handling Google callback
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    // Redirecting with JWT token as query parameter to the frontend
    const { token } = req.user;
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
