// controllers/messageController.js

const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { sender, senderModel, receiver, receiverModel, message } = req.body;

    const newMsg = await Message.create({
      sender,
      senderModel,
      receiver,
      receiverModel,
      message,
    });

    res.status(200).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { user1, model1, user2, model2 } = req.body;

    const messages = await Message.find({
      $or: [
        {
          sender: user1,
          senderModel: model1,
          receiver: user2,
          receiverModel: model2,
        },
        {
          sender: user2,
          senderModel: model2,
          receiver: user1,
          receiverModel: model1,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
};
