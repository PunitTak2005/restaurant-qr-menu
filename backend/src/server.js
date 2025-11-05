import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

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

// -----------------------
// ALLOWED ORIGINS FOR CORS
// -----------------------
// Specify ALL allowed frontend URLs here (local, Render, Vercel)
// IMPORTANT: Vercel frontend (https://restaurant-qr-menu.vercel.app) is REQUIRED for production
// Render frontend is optional but included for flexibility
const allowedOrigins = [
  "http://localhost:5173",                      // Local development
  "https://restaurant-qr-menu-1.onrender.com",  // Render frontend (optional)
  "https://restaurant-qr-menu.vercel.app"       // Vercel frontend (REQUIRED for production!)
];

// -----------------------
// MIDDLEWARES & CORS
// -----------------------
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl, SSR)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        // Log CORS errors for debugging
        console.error(`❌ CORS Error: Origin "${origin}" is not allowed`);
        console.error(`✅ Allowed origins: ${allowedOrigins.join(", ")}`);
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
// Order routes handle /api/orders endpoints including PATCH /api/orders/:id/status
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// -----------------------
// 404 FALLBACK - UNKNOWN ROUTES
// -----------------------
// This catches all unmatched routes and returns 404
// Helps diagnose 404/502 errors by logging the attempted route
app.all("*", (req, res) => {
  console.error(`❌ 404 Error: Route not found - ${req.method} ${req.originalUrl}`);
  console.error(`📍 Available routes: /api/orders, /api/auth, /api/admin`);
  res.status(404).json({ 
    success: false, 
    message: "Route not found",
    requestedRoute: req.originalUrl,
    availableRoutes: ["/api/orders", "/api/auth", "/api/admin"]
  });
});

// -----------------------
// MONGODB CONNECTION + SERVER START
// -----------------------
const start = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`✅ CORS enabled for: ${allowedOrigins.join(", ")}`);
      console.log(`📍 API routes available: /api/orders, /api/auth, /api/admin`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

start();

export default app;
