const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Send message and save to DB
async function sendMessage({ chat_session_id, sender_id, message }) {
  return prisma.chat_messages.create({
    data: {
      chat_session_id,
      sender_id,
      message,
      send_at: new Date(),
    },
    include: {
      sender: { select: { id: true, email: true } },
      chat_session: { select: { id: true, skill_swap_id: true } },
    },
  });
}

// Get all messages for a chat session
async function getMessagesBySession(chat_session_id) {
  return prisma.chat_messages.findMany({
    where: { chat_session_id },
    orderBy: { send_at: "asc" },
    include: {
      sender: { select: { id: true, email: true } },
    },
  });
}

module.exports = {
  sendMessage,
  getMessagesBySession,
};
