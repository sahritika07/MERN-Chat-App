import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app); // Socket.io supports HTTP server

// ✅ Middleware setup
app.use(cors({
  origin: "*", // ✅ Allow all origins
  credentials: true
}));

app.use(express.json({ limit: "4mb" }));

// ✅ Initialize socket.io with proper CORS configuration
export const io = new Server(server, {
  cors: {
    origin: "*",        // ✅ Allow all origins
    methods: ["GET", "POST"],
    credentials: true   // ✅ Still allow credentials
  }
});


// ✅ Store Online Users
export const userSocketMap = {}; // { userId: socketId }

// ✅ Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ✅ Route Setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ✅ Connect to DB
await connectDB();

// ✅ Start server
// if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
// }

// ✅ For Vercel
export default server;