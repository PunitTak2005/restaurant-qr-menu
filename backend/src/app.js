import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";

// Route imports
import adminRoutes from "./routes/admin.js"; // ✅
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

const FRONTEND_ORIGIN = process.env.CLIENT_URL || "http://localhost:5173";
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restaurantDB";

// Middleware
app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Digital Dine API is running smoothly",
  });
});

// Polling endpoint example (poll for new orders)
app.get("/api/poll/orders", async (req, res) => {
  try {
    const { since } = req.query;
    const newOrders = await Order.find(since ? { updatedAt: { $gt: since } } : {});
    res.status(200).json({ success: true, orders: newOrders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mount routes
app.post("/api/auth/login", loginUser);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tablesRoutes);
app.use("/api/admin", adminRoutes); // ✅

// 404 Handler (must be after all "use" above)
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("💥 Global Error:", err.stack || err.message);
  res.status(500).json({ success: false, error: err.message });
});


// Startup logic
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    // Optionally seed DB in development
    if (process.env.NODE_ENV === "development" && seedDB) {
      await seedDB();
      console.log("🌱 Database seeded successfully");
    }

    server.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("💀 MongoDB connection error:", err.message);
    process.exit(1);
  }
};

startServer();

export default app;
