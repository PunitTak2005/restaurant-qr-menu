import express from "express";
import { getTableBySlug } from "../controllers/tableController.js";
import Table from "../models/Table.js";

const router = express.Router();

// GET /api/tables — List all tables (admin/staff/table select)
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find({}, "number status seats active"); // fetch id, number, and any info you want in dropdown
    res.json({ success: true, tables });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch tables" });
  }
});

// GET /api/tables/:slug - Public route for QR code landing
router.get("/:slug", getTableBySlug);

export default router;
