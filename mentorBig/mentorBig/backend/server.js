const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const industryMentorRoutes = require("./routes/industryMentorRoutes");
const collegeMentorRoutes = require("./routes/collegeMentorRoutes");
const messageRoutes = require("./routes/messageRoutes"); // Add this line
const path = require("path");

const socketIo = require("socket.io");
const Message = require("./models/Message"); // Add this line

// Initialize database connection
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/student", studentRoutes);
app.use("/industryMentor", industryMentorRoutes);
app.use("/collegeMentor", collegeMentorRoutes);
app.use("/messages", messageRoutes); // Add this line for message routes

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", (data) => {
    const { receiver } = data;
    io.to(receiver).emit("receiveMessage", data);
  });
});

module.exports = { server, io };

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💻 Socket.io server listening`);
});
