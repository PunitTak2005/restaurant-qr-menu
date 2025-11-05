import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io"; // Add this if using Socket.io

// Route Imports
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin.js";

// -----------------------
// ENV + APP INITIALIZATION
// -----------------------
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurantDB";

// Specify ALL allowed frontend URLs here (local + deployed)
const allowedOrigins = [
  "http://localhost:5173",
  "https://restaurant-qr-menu-1.onrender.com" // ← your deployed frontend
];

// -----------------------
// MIDDLEWARES & CORS
// -----------------------
app.use(
  cors({
    origin: function(origin, callback) {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
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
    origin: allowedOrigins,
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
app.use("/api/admin", adminRoutes);

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
