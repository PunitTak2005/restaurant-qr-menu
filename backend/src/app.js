import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
// Route imports
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import tablesRoutes from "./routes/tables.js";
import seedDB from "./seed/seedDB.js";
import { loginUser } from "./controllers/authController.js";
import Order from "./models/Order.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurantDB";

// ----------- CORS CONFIGURATION: ADD ALL FRONTENDS HERE -------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://restaurant-qr-menu-1.onrender.com",
  "https://restaurant-qr-menu.vercel.app",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`[CORS] Origin denied: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ROUTE REGISTRATION
app.use("/api/orders", orderRoutes); // Ensure PATCH /api/orders/:id/status handled inside orderRoutes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tablesRoutes);

// Fallback for undefined routes
app.use((req, res, next) => {
  console.warn(`[404] Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Route debug/endpoints (optional)
app.get("/api", (req, res) => {
  res.json({
    availableRoutes: [
      "/api/orders",
      "/api/orders/:id/status [PATCH]",
      "/api/admin",
      "/api/auth",
      "/api/menu",
      "/api/tables"
    ]
  });
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`[MongoDB ERROR] ${err.message}`);
  });
