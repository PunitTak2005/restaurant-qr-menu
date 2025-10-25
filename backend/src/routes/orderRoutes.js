import express from "express";
import mongoose from "mongoose";

// ===== Models =====
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import User from "../models/User.js";
import Table from "../models/Table.js";

const router = express.Router();

/* ===========================================================
   GET ALL ORDERS (Admin / Staff)
   Populates: user, table, and ordered items
   =========================================================== */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({ path: "userId", select: "name email role" })
      .populate({ path: "tableId", select: "number capacity" })
      .populate({
        path: "items.menuItemId",
        select: "name price category image availability",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message);
    res.status(500).json({
      success: false,
      error: "Server error fetching orders.",
    });
  }
});

/* ===========================================================
   GET SINGLE ORDER BY ID
   =========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Order ID." });
    }

    const order = await Order.findById(id)
      .populate({ path: "userId", select: "name email" })
      .populate({ path: "tableId", select: "number capacity" })
      .populate({
        path: "items.menuItemId",
        select: "name price category image availability",
      });

    if (!order)
      return res
        .status(404)
        .json({ success: false, error: "Order not found." });

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("💥 Error getting order:", err.message);
    res.status(500).json({
      success: false,
      error: "Server error retrieving order.",
    });
  }
});

/* ===========================================================
   CREATE NEW ORDER
   Validates table, menu items, and optional user
   =========================================================== */
router.post("/", async (req, res) => {
  try {
    const { tableId, items, totalPrice, userId, status } = req.body;

    if (!tableId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing fields: tableId and at least one item required.",
      });
    }

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid userId reference." });
    }

    // Validate all menu items
    for (const item of items) {
      if (
        !item.menuItemId ||
        !mongoose.Types.ObjectId.isValid(item.menuItemId)
      ) {
        return res
          .status(400)
          .json({ success: false, error: "Bad menuItemId detected." });
      }

      const exists = await MenuItem.exists({ _id: item.menuItemId });
      if (!exists) {
        return res.status(404).json({
          success: false,
          error: `Menu item not found: ${item.menuItemId}`,
        });
      }
    }

    const newOrder = new Order({
      tableId,
      items,
      userId,
      totalPrice,
      status: status || "pending",
    });

    const saved = await newOrder.save();
    console.log("✅ Order created:", saved._id);

    // Optional socket broadcast if available
    if (req.io) req.io.emit("order:new", saved);

    res.status(201).json({ success: true, order: saved });
  } catch (err) {
    console.error("💥 Error creating order:", err.message);
    res.status(500).json({
      success: false,
      error: "Server error creating order.",
    });
  }
});

/* ===========================================================
   UPDATE ORDER STATUS (Staff/Admin)
   =========================================================== */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Order ID." });
    }

    const allowed = [
      "pending",
      "preparing",
      "ready",
      "served",
      "paid",
      "cancelled",
    ];
    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid status value." });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, error: "Order not found." });

    if (req.io) req.io.emit("order:update", updated);

    res.status(200).json({ success: true, order: updated });
  } catch (err) {
    console.error("💥 Error updating order status:", err.message);
    res.status(500).json({
      success: false,
      error: "Server error updating status.",
    });
  }
});

/* ===========================================================
   DELETE ORDER (Admin only)
   =========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, error: "Invalid Order ID." });

    const del = await Order.findByIdAndDelete(id);
    if (!del)
      return res
        .status(404)
        .json({ success: false, error: "Order not found for deletion." });

    if (req.io) req.io.emit("order:delete", del._id);

    res.status(200).json({ success: true, message: "Order deleted." });
  } catch (err) {
    console.error("💥 Error deleting order:", err.message);
    res.status(500).json({
      success: false,
      error: "Server error deleting order.",
    });
  }
});

export default router;
