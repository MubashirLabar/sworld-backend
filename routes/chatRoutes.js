const express = require("express");
const AIChat = require("../controllers/chatController");
const router = express.Router();

router.post("/createMessage", AIChat.createMessage);

module.exports = router;
