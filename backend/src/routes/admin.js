// backend/routes/admin.js
import express from "express";
import { getAnalytics } from "../controllers/adminController.js";

const router = express.Router();

// Exposes: GET /api/admin/analytics
router.get("/analytics", getAnalytics);

export default router;
