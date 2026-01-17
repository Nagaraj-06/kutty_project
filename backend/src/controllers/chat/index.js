const chatService = require("../../services/chat.service");

// Get all messages of a chat session
async function getMessages(req, res, next) {
  try {
    const { chat_session_id } = req.query;

    if (!chat_session_id) {
      const err = new Error("chat_session_id is required");
      err.statusCode = 400;
      throw err;
    }
    const messages = await chatService.getMessagesBySession(chat_session_id);

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
}

async function getChatList(req, res, next) {
  try {
    const userId = req.user.id; // from token middleware
    const chatList = await chatService.getChatListService(userId);
    res.status(200).json({
      success: true,
      message: "Chat list fetched successfully",
      data: chatList,
    });
  } catch (err) {
    next(err);
  }
}

async function uploadChatFile(req, res, next) {
  try {
    if (!req.file) {
      const err = new Error("No file uploaded");
      err.statusCode = 400;
      throw err;
    }

    const fileUrl = `/chat_files/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        file_url: fileUrl,
        original_name: req.file.originalname
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMessages,
  getChatList,
  uploadChatFile,
};
