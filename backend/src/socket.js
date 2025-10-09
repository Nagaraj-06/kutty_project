const chatService = require("./services/chat.service");

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a chat session room
    socket.on("join", ({ chatSessionId }) => {
      socket.join(chatSessionId);
      console.log(`User ${socket.id} joined room ${chatSessionId}`);
    });

    // Send message in real-time
    socket.on("send_message", async (data) => {
      try {
        // Save message in DB
        const newMsg = await chatService.sendMessage(data);

        // Emit to all sockets in the room
        // io.to(data.chat_session_id).emit("new_message", newMsg);
        socket.broadcast.to(data.chat_session_id).emit("new_message", newMsg);
      } catch (err) {
        console.error(err);
      }
    });

    // WebRTC signaling events
    socket.on("webrtc_offer", ({ roomId, offer, userId }) => {
      socket.to(roomId).emit("webrtc_offer", { offer, userId });
    });

    socket.on("webrtc_answer", ({ roomId, answer, userId }) => {
      socket.to(roomId).emit("webrtc_answer", { answer, userId });
    });

    socket.on("webrtc_ice_candidate", ({ roomId, candidate, userId }) => {
      socket.to(roomId).emit("webrtc_ice_candidate", { candidate, userId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  
  });
}

module.exports = { setupSocket };
