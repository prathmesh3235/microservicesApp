const app = require("./app");
require("dotenv").config();
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5002;

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

const startServer = () => {
  const server = httpsServer
    .listen(PORT, () => {
      console.log(`Notification service running on port ${PORT}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is busy, trying alternative port...`);
        // Try alternative port
        server.listen(0); // This will automatically find an available port
      } else {
        console.error("Server error:", err);
      }
    });

  server.on("listening", () => {
    const address = server.address();
    console.log(`Server is now running on port ${address.port}`);
  });

  // Handle graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  return server;
};

// Start the server
startServer();
