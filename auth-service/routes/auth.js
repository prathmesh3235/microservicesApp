const express = require("express");
const passport = require("passport");
const router = express.Router();
const axios = require("axios");
const User = require("../models/Users");

// Helper function for sending notifications
async function sendNotification(type, email, message) {
  try {
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/send-${type}-notification`, {
      email,
      message
    });
  } catch (error) {
    console.error(`Error sending ${type} notification:`, error);
    // Don't throw error - notification failure shouldn't block auth flow
  }
}

// Initiating Google login
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handling Google callback
router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const { token, email } = req.user;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not provided by authentication"
      });
    }

    try {
      let user = await User.findOne({ email }); // Search by email instead of token for consistency

      if (!user) {
        user = new User({
          token,
          email,
          isManager: email === process.env.REACT_APP_ADMIN_MAIL,
        });
        await user.save();
        console.log(`New user created with email: ${email}`);
      } else {
        // Update existing user's token
        user.token = token;
        await user.save();
        console.log(`Existing user updated with email: ${email}`);
      }

      // Send login notification asynchronously
      await sendNotification('login', email, 'You have successfully logged in.');

      // Redirect with encoded parameters
      const redirectUrl = new URL('/dashboard', process.env.FRONTEND_URL);
      redirectUrl.searchParams.append('email', encodeURIComponent(email));
      redirectUrl.searchParams.append('token', encodeURIComponent(token));
      
      res.redirect(redirectUrl.toString());

    } catch (error) {
      console.error("Error in authentication callback:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during authentication"
      });
    }
  }
);

// Logout route - handles both GET and POST
router.all("/logout", async (req, res) => {
  try {
    const email = req.method === "POST" ? req.body.email : req.query.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for logout"
      });
    }

    // Send logout notification asynchronously
    await sendNotification('logout', email, 'You have successfully logged out from the application.');

    // Handle passport logout
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({
          success: false,
          message: "Error during logout process",
          error: err.message
        });
      }

      return res.json({
        success: true,
        message: "Logged out successfully"
      });
    });

  } catch (error) {
    console.error("Error during logout process:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout process",
      error: error.message
    });
  }
});

module.exports = router;