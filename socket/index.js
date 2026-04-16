
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://concerned-picture-9849-frontend.vercel.app",
    methods: ["GET", "POST"],
  },
});



io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

 
  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);

    // sabko bhej do (receiver + sender)
    socket.broadcast.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



server.listen(3001, () => {
  console.log("Server is listening at port 3001");
});