// server.js - Updated to include PeerJS server
const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const { host, port } = require("./config/env");
const { setupSocket } = require("./socket");
const { Server } = require("socket.io");
const { ExpressPeerServer } = require("peer");

async function startServer() {
  await connectDB();

  // Create HTTP server explicitly
  const server = http.createServer(app);

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Attach WebSocket
  setupSocket(io);

  // ✅ Initialize PeerJS server with correct path configuration
  const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: "/", // Changed from "/peerjs" to "/"
    cors: {
      origin: "http://localhost:3000", // your frontend origin
      methods: ["GET", "POST"],
    },
  });

  // Mount at /peerjs
  // app.use("/peerjs", peerServer);

  console.log("PeerJS server initialized at /peerjs");

  server.listen(port, () => {
    console.log(`Server running on ${host}:${port}`);
    console.log(`PeerJS available on port ${host}:${port} at path /peerjs`);
  });
}

startServer();
