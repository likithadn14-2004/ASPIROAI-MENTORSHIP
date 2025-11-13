// services/socketService.js
const socketIO = require('socket.io');
const Message = require("../models/Message")
let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join user to their personal room
    socket.on('joinUser', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Handle private messages
    socket.on('sendPrivateMessage', async (messageData) => {
      try {
        // Save message to database (you'll need to import your Message model)
        const message = new Message({
          content: messageData.content,
          sender: messageData.senderId,
          senderModel: messageData.senderType,
          receiver: messageData.receiverId,
          receiverModel: messageData.receiverType
        });
        
        await message.save();
        
        // Emit to sender
        io.to(messageData.senderId).emit('receivePrivateMessage', message);
        
        // Emit to receiver
        io.to(messageData.receiverId).emit('receivePrivateMessage', message);
        
      } catch (error) {
        console.error('Error handling private message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};