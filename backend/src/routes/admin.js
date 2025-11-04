// backend/routes/admin.js

import express from "express";
import { getAnalytics } from "../controllers/adminController.js";

const router = express.Router();

// THIS LINE creates the /api/admin/analytics route:
router.get("/analytics", getAnalytics);

export default router;
