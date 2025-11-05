import mongoose from "mongoose";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Table from "../models/Table.js";

// GET /api/orders/user/:userId — ALL ORDERS FOR A USER
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }
    const orders = await Order.find({ userId })
      .populate("userId", "name email role")
      .populate({ path: "tableId", model: "Table", select: "number status" })
      .populate("items.menuItemId", "name price")
      .sort({ createdAt: -1 });
    // Make sure tableNumber is included for each order
    const formatted = orders.map(order => {
      let finalTableNumber = order.tableNumber;
      if (!finalTableNumber && order.tableId && order.tableId.number) finalTableNumber = order.tableId.number;
      return { ...order.toObject(), tableNumber: finalTableNumber };
    });
    res.status(200).json({ success: true, orders: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error fetching user orders" });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid order ID" });
    }
    const order = await Order.findById(id)
      .populate("userId", "name email role")
      .populate({ path: "tableId", model: "Table", select: "number status" })
      .populate("items.menuItemId", "name price");
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    let finalTableNumber = order.tableNumber;
    if (!finalTableNumber && order.tableId && order.tableId.number) finalTableNumber = order.tableId.number;
    res.status(200).json({ success: true, order: { ...order.toObject(), tableNumber: finalTableNumber } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error fetching order" });
  }
};

// POST /api/orders — CREATE NEW ORDER
export const createOrder = async (req, res) => {
  try {
    const { userId, tableId, items, totalPrice } = req.body;
    if (!userId || !tableId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Missing required order fields" });
    }
    // Optionally, validate item existence/price...
    const order = new Order({
      userId,
      tableId,
      items,
      totalPrice,
      createdAt: new Date(),
    });
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
};
