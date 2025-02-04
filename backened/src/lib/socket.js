import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chatapp-27oe.onrender.com/"],
    methods: ["GET", "POST"],
    credentials: true
  },
});
export function getReceiverSocketId(userId) {
  return userSockets[userId];
}
const userSockets = {};


io.on("connection", (socket) => {
  console.log("new connection", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSockets[userId] = socket.id;
  }

  io.emit("user-sockets",Object.keys(userSockets));
  socket.on("disconnect", () => {
    console.log("user disconnected",socket.id);
    delete userSockets[userId];
    io.emit("user-sockets", Object.keys(userSockets));
  });
});
export { io, app, server };
