// backend/src/routes/tables.js
import express from "express";
import { getTableBySlug } from "../controllers/tableController.js";

const router = express.Router();

// GET /tables/:slug - Public route for QR code landing
router.get("/:slug", getTableBySlug);

export default router;
