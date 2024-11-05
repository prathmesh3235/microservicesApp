const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5003;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server only after successful DB connection
    app.listen(PORT, () => {
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
