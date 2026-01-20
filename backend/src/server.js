// server.js - Updated to include PeerJS server
const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const { host, port, frontendUrl } = require("./config/env");
const { setupSocket } = require("./socket");
const { Server } = require("socket.io");

async function startServer() {
  await connectDB();

  // Create HTTP server explicitly
  const server = http.createServer(app);

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: frontendUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Attach WebSocket
  setupSocket(io);

  server.listen(port, () => {
    console.log(`Server running on ${host}:${port}`);
  });
}

startServer();
