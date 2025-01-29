import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieparser from "cookie-parser";
import messageRoutes from "./routes/message.routes.js";
import cors from "cors";
import path from "path";

import { app, server } from "./lib/socket.js";
app.use(cookieparser());
dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); // Adjust size as needed
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
  console.log("server running on port " + PORT);
  connectDB();
});
