const app = require("./app");
const https = require("https");
const fs = require("fs");
const path = require("path");

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

// Start server
// httpsServer.listen(3000, () => {
//   console.log('HTTPS Server running on port 3000');
// });

const PORT = process.env.PORT || 5001;
httpsServer.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
