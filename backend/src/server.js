import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

// Route Imports
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin.js";            // <<✅ ADD THIS LINE

// -----------------------
// ENV + APP INITIALIZATION
// -----------------------
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurantDB";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// -----------------------
// MIDDLEWARES & CORS
// -----------------------
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// -----------------------
// CREATE HTTP + SOCKET SERVER
// -----------------------
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});
export { io };

app.use((req, res, next) => {
  req.io = io;
  next();
});

// -----------------------
// BASIC ENDPOINTS
// -----------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Digital Dine API running successfully",
  });
});

// -----------------------
// ROUTE REGISTRATION
// -----------------------
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);              // <<✅ ADD THIS LINE

// -----------------------
// SOCKET.IO EVENTS HANDLING
// -----------------------
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("order:new", (order) => {
    console.log("📦 New order event received:", order);
    io.emit("order:update", order);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// -----------------------
// 404 FALLBACK
// -----------------------
app.all("*", (req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// -----------------------
// MONGODB CONNECTION + SERVER START
// -----------------------
const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    server.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

start();

export default app;
