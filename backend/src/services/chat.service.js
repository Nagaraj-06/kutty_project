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
    select: {
      id: true,
      message: true,
      send_at: true,
      sender: {
        select: {
          id: true,
          email: true,
          user_name: true,
          profile_pic_url: true,
        },
      },
    },
  });
}

async function getChatListService(userId) {
  // 1️⃣ Get accepted skill swaps where user is either request_from or request_to
  const skillSwaps = await prisma.skill_swaps.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ request_from: userId }, { request_to: userId }],
    },
    select: { id: true, request_from: true, request_to: true },
  });

  if (skillSwaps.length === 0) return [];

  // 2️⃣ Extract all skill_swap_ids
  const skillSwapIds = skillSwaps.map((s) => s.id);

  // 3️⃣ Get chat sessions linked to those swaps
  const chatSessions = await prisma.chat_sessions.findMany({
    where: { skill_swap_id: { in: skillSwapIds } },
    select: { id: true, skill_swap_id: true },
  });

  if (chatSessions.length === 0) return [];

  const chatSessionIds = chatSessions.map((c) => c.id);

  // 4️⃣ Get latest message for each chat_session
  const lastMessages = await prisma.chat_messages.groupBy({
    by: ["chat_session_id"],
    _max: { send_at: true },
    where: { chat_session_id: { in: chatSessionIds } },
  });

  const chatListData = [];

  for (const session of chatSessions) {
    const latestMsg = lastMessages.find(
      (msg) => msg.chat_session_id === session.id
    );

    let messageData = null;
    if (latestMsg?._max?.send_at) {
      messageData = await prisma.chat_messages.findFirst({
        where: {
          chat_session_id: session.id,
          send_at: latestMsg._max.send_at,
        },
        select: { message: true, sender_id: true, send_at: true },
      });
    }

    // 5️⃣ Get opposite user info
    const swap = skillSwaps.find((s) => s.id === session.skill_swap_id);
    const oppositeUserId =
      swap.request_from === userId ? swap.request_to : swap.request_from;

    const oppositeUser = await prisma.users.findUnique({
      where: { id: oppositeUserId },
      select: { user_name: true, email: true, profile_pic_url: true },
    });

    chatListData.push({
      chat_session_id: session.id,
      oppositeUser: {
        user_name: oppositeUser?.user_name,
        email: oppositeUser?.email,
        profile_pic_url: oppositeUser?.profile_pic_url,
        last_message: messageData?.message || "No messages yet",
        last_message_sent_by_me: messageData?.sender_id === userId,
        updated_at: messageData?.send_at,
      },
    });
  }

  // 6️⃣ Sort by latest message
  chatListData.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  return chatListData;
}

module.exports = {
  sendMessage,
  getMessagesBySession,
  getChatListService,
};
