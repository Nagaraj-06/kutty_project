// socket.js
const chatService = require("./services/chat.service");

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a chat session room (existing functionality)
    socket.on("join", ({ chatSessionId }) => {
      socket.join(chatSessionId);
      console.log(`User ${socket.id} joined room ${chatSessionId}`);
    });

    // Join video room with peer ID (new functionality)
    socket.on("join-room", (roomId, userId) => {
      socket.join(roomId);
      console.log(`✅ User ${userId} joined room ${roomId}`);

      // Notify others in the room that a new user connected
      socket.to(roomId).emit("user-connected", userId);

      // Store the user's room and peer ID for disconnect handling
      socket.data = { roomId, userId };
    });

    // Send message in real-time (existing functionality)
    socket.on("send_message", async (data) => {
      try {
        // Save message in DB
        const newMsg = await chatService.sendMessage(data);

        // Emit to all sockets in the room except sender
        socket.broadcast.to(data.chat_session_id).emit("new_message", newMsg);
      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // General disconnect handler
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // If user was in a video room, notify others
      if (socket.data?.roomId && socket.data?.userId) {
        socket
          .to(socket.data.roomId)
          .emit("user-disconnected", socket.data.userId);
        console.log(
          `✅ Notified room ${socket.data.roomId} about disconnect of ${socket.data.userId}`
        );
      }
    });
  });
}

module.exports = { setupSocket };
