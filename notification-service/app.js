const express = require("express");
const cors = require("cors");
require("dotenv").config();

const notificationRoutes = require("./routes/notification");

const app = express();

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/notification", notificationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    message: "Route not found",
    path: req.url,
    method: req.method,
  });
});

module.exports = app;
