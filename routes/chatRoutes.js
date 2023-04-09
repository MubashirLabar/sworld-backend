const express = require("express");
const AIChat = require("../controllers/chatController");
const router = express.Router();

router.post("/chat/answer", AIChat.answer);
router.post("/chat/search", AIChat.search);

module.exports = router;
