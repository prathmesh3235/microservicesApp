const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const requestRoutes = require("./routes/request");
const cors = require("cors");
require("dotenv").config();
require("./config/passport"); // Initialize passport config

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json()); // to parse JSON request bodies
app.use(passport.initialize());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api/requests", requestRoutes);

module.exports = app;
