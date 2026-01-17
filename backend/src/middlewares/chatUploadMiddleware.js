const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Folder path for storing chat files
const uploadPath = path.join(__dirname, "../public/chat_files");

// Create folder if not exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `chat-${req.user.id}-${uniqueSuffix}${ext}`);
    },
});

// Allow images, videos, and common documents
function fileFilter(req, file, cb) {
    const allowedExtensions = /jpeg|jpg|png|gif|mp4|mov|avi|pdf|doc|docx|txt/;
    const allowedMimeTypes = /image|video|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|text\/plain/;

    const extname = allowedExtensions.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("File type not supported! (Allowed: images, videos, pdf, doc, txt)"));
    }
}

const chatUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

module.exports = chatUpload;
