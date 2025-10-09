const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const { port } = require("./config/env");
const { setupSocket } = require("./socket");
const { Server } = require("socket.io");

async function startServer() {
  await connectDB();

  // create HTTP server explicitly
  const server = http.createServer(app);

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: { origin: "*" }, // adjust in prod
  });

  // attach WebSocket
  setupSocket(io);

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
