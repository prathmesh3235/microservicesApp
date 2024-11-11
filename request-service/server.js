const app = require("./app");
const https = require("https");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5003;

const privateKey = fs.readFileSync(
  path.join(__dirname, "../localhost-key.pem"),
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "../localhost.pem"),
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server only after successful DB connection
    httpsServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

console.log("Environment check:", {
  mongoUri: process.env.MONGODB_URI ? "Set" : "Not set",
  notificationUrl: process.env.NOTIFICATION_SERVICE_URL ? "Set" : "Not set",
});
// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  mongoose.connection.close().then(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});
