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

    // Make sure tableNumber is included for each order (in case it's not saved)
    const formatted = orders.map(order => {
      let finalTableNumber = order.tableNumber;
      // fallback to populated table if direct field is missing
      if (!finalTableNumber && order.tableId && order.tableId.number)
        finalTableNumber = order.tableId.number;
      return { ...order.toObject(), tableNumber: finalTableNumber };
    });

    res.status(200).json({ success: true, orders: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error fetching user orders" });
  }
};

// POST /api/orders — CREATE NEW ORDER
export const createOrder = async (req, res) => {
  try {
    const { userId, tableId, tableNumber, items } = req.body;

    if (!userId || !tableId || !items?.length || typeof tableNumber !== "number") {
      return res.status(400).json({
        success: false,
        error: "Missing required fields (userId, tableId, tableNumber, items)",
      });
    }

    // Validate tableId exists, and number matches tableNumber
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(400).json({ success: false, error: "Invalid table ID" });
    }
    if (table.number !== tableNumber) {
      return res.status(400).json({ success: false, error: "Table number mismatch" });
    }

    // Calculate total price, validate items
    let totalPrice = 0;
    const mappedItems = [];
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ success: false, error: "Menu item not found" });
      }
      mappedItems.push({ menuItemId: item.menuItemId, qty: item.qty, note: item.note || "" });
      totalPrice += menuItem.price * item.qty;
    }

    // Create order
    const newOrder = await Order.create({
      userId,
      tableId,
      tableNumber, // always persists the table number
      items: mappedItems,
      totalPrice,
      status: "pending",
    });

    // Populate before sending response
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("userId", "name email role")
      .populate("tableId", "number status")
      .populate("items.menuItemId", "name price");

    res.status(201).json({ success: true, order: populatedOrder });
  } catch (err) {
    console.error("💥 createOrder Error:", err);
    res.status(500).json({ success: false, error: "Server error creating order" });
  }
};

// PATCH /api/orders/:id/status — UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid order ID" });
    }
    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate("userId", "name email role")
      .populate("tableId", "number status")
      .populate("items.menuItemId", "name price");

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("💥 updateOrderStatus Error:", err);
    res.status(500).json({ success: false, error: "Server error updating status" });
  }
};

// GET /api/orders — LIST ALL ORDERS (Admin View)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email role")
      .populate({ path: "tableId", model: "Table", select: "number status" })
      .populate("items.menuItemId", "name price")
      .sort({ createdAt: -1 });

    const formatted = orders.map(order => {
      let finalTableNumber = order.tableNumber;
      if (!finalTableNumber && order.tableId && order.tableId.number)
        finalTableNumber = order.tableId.number;
      return { ...order.toObject(), tableNumber: finalTableNumber };
    });

    res.status(200).json({ success: true, orders: formatted });
  } catch (err) {
    console.error("💥 getOrders Error:", err);
    res.status(500).json({ success: false, error: "Server error fetching orders" });
  }
};

// GET /api/orders/:id — GET SINGLE ORDER (Detail View)
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
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    // always surface tableNumber in the API response
    let finalTableNumber = order.tableNumber;
    if (!finalTableNumber && order.tableId && order.tableId.number)
      finalTableNumber = order.tableId.number;
    res.status(200).json({ success: true, order: { ...order.toObject(), tableNumber: finalTableNumber } });
  } catch (err) {
    console.error("💥 getOrderById Error:", err);
    res.status(500).json({ success: false, error: "Server error fetching order" });
  }
};
