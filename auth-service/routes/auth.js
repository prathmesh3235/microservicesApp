const express = require("express");
const passport = require("passport");
const router = express.Router();
const axios = require("axios");
const User = require("../models/Users");

// Initiating Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handling Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const { token, email } = req.user; // Ensuring that email is retrieved correctly

    try {
      let user = await User.findOne({ token });

      if (!user) {
        // If user does not exist, create a new user
        user = new User({
          token,
          email,
          isManager: email === process.env.REACT_APP_ADMIN_MAIL, // Set isManager to true if email matches the admin email
        });
        await user.save();
        console.log(`New user created with email: ${email}`);
      } else {
        console.log(`Existing user found with email: ${email}`);
      }
      // Sending login notification
      await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/send-login-notification`,
        {
          email: email,
          message: "You have successfully logged in.",
        }
      );

      // Redirecting to frontend with token and email
      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?email=${email}&token=${token}`
      );
    } catch (error) {
      console.error("Error sending login notification:", error);
      // Redirecting to frontend regardless, but log the error
      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?email=${email}&token=${token}`
      );
    }
  }
);

// Logout route
router.all("/logout", async (req, res) => {
  try {
    const email = req.method === "POST" ? req.body.email : req.query.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required for logout" });
    }

    try {
      // Fixed the notification URL path
      await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/send-logout-notification`,
        {
          email,
          message: "You have successfully logged out from the application.",
        }
      );
    } catch (notificationError) {
      console.error("Error sending logout notification:", notificationError);
      // Continue with logout even if notification fails
    }

    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({ message: "Error during logout process" });
      }
      return res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Error during logout process:", error);
    res.status(500).json({
      message: "Error during logout process",
      error: error.message,
    });
  }
});

module.exports = router;
