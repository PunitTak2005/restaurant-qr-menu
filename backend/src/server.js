import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Route Imports
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// -----------------------
// ENV + APP INITIALIZATION
// -----------------------
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurantDB";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// -----------------------
// EXPRESS + CORS CONFIG
// -----------------------
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------
// CREATE HTTP + SOCKET SERVER
// -----------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
export { io };

// Attach io to every request (live event broadcasting)
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

// -----------------------
// SOCKET.IO EVENTS
// -----------------------
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Example: broadcast new order creation
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
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    server.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
