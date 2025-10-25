import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import tablesRoutes from "./routes/tables.js";

// Optional seeding/controllers
import seedDB from "./seed/seedDB.js";
import { loginUser } from "./controllers/authController.js";

dotenv.config();

// Server + middleware setup
const app = express();
const server = http.createServer(app);

// Frontend origin
const FRONTEND_ORIGIN = process.env.CLIENT_URL || "http://localhost:5173";

// CORS + parsers
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach socket.io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Live order updates
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("order:new", (data) => {
    console.log("📦 New order broadcast:", data);
    io.emit("order:update", data);
  });

  socket.on("disconnect", () => {
    console.warn("🔴 Client disconnected:", socket.id);
  });
});

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Digital Dine API is running smoothly",
  });
});

// API routes
app.post("/api/auth/login", loginUser);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tablesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Global Error:", err.stack || err.message);
  res.status(500).json({ success: false, error: err.message });
});

// DB connection
const startServer = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurantDB";
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    // Optional: seed database in development
    if (process.env.NODE_ENV === "development" && seedDB) {
      await seedDB();
      console.log("🌱 Database seeded successfully");
    }

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("💀 MongoDB connection error:", err.message);
    process.exit(1);
  }
};

startServer();

export { io };
export default app;
