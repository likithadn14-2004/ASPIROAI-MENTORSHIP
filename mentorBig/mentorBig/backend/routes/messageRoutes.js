// routes/messageRoutes.js

const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

router.post("/send", sendMessage);
router.post("/get", getMessages);

module.exports = router;
