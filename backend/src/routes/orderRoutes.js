import express from 'express';
import mongoose from 'mongoose';

import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';
import Table from '../models/Table.js';

// Import auth middleware and authorize helper
import authMiddleware, { authorize } from '../middlewares/auth.js';

import {
  getOrderById,
  getOrdersByUser,
} from '../controllers/orderController.js';

const router = express.Router();

// --- GET ALL ORDERS FOR CURRENT AUTHENTICATED USER ---
router.get('/my', authMiddleware, authorize('customer', 'admin', 'owner'), async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(400).json({ error: 'User not authenticated' });
    }
    const orders = await Order.find({ userId })
      .populate({ path: 'userId', select: 'name email role' })
      .populate({ path: 'tableId', select: 'number seats status' })
      .populate({
        path: 'items.menuItemId',
        select: 'name price category image active',
      })
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your orders' });
  }
});

// --- GET ALL ORDERS FOR A USER (admin/staff view) ---
router.get('/user/:userId', getOrdersByUser);

// --- GET ALL ORDERS (admin/global) ---
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({ path: 'userId', select: 'name email role' })
      .populate({ path: 'tableId', select: 'number seats status' })
      .populate({
        path: 'items.menuItemId',
        select: 'name price category image active',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching orders.',
    });
  }
});

// --- GET SINGLE ORDER (by ID) ---
router.get('/:id', getOrderById);

// --- CREATE NEW ORDER WITH tableNumber ---
router.post('/', async (req, res) => {
  try {
    const { userId, tableId, tableNumber, items, totalPrice, status } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(tableId)
    ) {
      return res.status(400).json({ success: false, error: 'Invalid user or table.' });
    }
    if (
      typeof tableNumber !== 'number' ||
      Number.isNaN(tableNumber)
    ) {
      return res.status(400).json({ success: false, error: 'tableNumber missing or invalid.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order.' });
    }
    for (const it of items) {
      if (!mongoose.Types.ObjectId.isValid(it.menuItemId)) {
        return res.status(400).json({ success: false, error: 'Invalid menuItem in items.' });
      }
    }
    // Table existence and match validation
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(400).json({ success: false, error: 'Invalid Table ID.' });
    }
    if (table.number !== tableNumber) {
      return res.status(400).json({ success: false, error: 'Table number does not match Table ID.' });
    }
    const order = await Order.create({
      userId,
      tableId,
      tableNumber, // KEY: store table number in order doc
      items,
      totalPrice,
      status: status || 'pending',
    });
    const populatedOrder = await Order.findById(order._id)
      .populate({ path: 'userId', select: 'name email role' })
      .populate({ path: 'tableId', select: 'number seats status' })
      .populate({
        path: 'items.menuItemId',
        select: 'name price category image active',
      });
    if (req.io) req.io.emit('order:new', populatedOrder);
    res.status(201).json({ success: true, order: populatedOrder });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server error creating order.',
    });
  }
});

// --- UPDATE ORDER STATUS (PATCH) ---
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = [
      'pending', 'preparing', 'ready', 'served', 'paid', 'cancelled'
    ];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid Order ID.' });
    }
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value.' });
    }
    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate({ path: 'userId', select: 'name email role' })
      .populate({ path: 'tableId', select: 'number seats status' })
      .populate({
        path: 'items.menuItemId',
        select: 'name price category image active',
      });
    if (!updated)
      return res.status(404).json({ success: false, error: 'Order not found.' });
    if (req.io) req.io.emit('order:update', updated);
    res.status(200).json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error updating status.' });
  }
});

// --- UPDATE ORDER STATUS (PUT, same logic as PATCH) ---
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = [
      'pending', 'preparing', 'ready', 'served', 'paid', 'cancelled'
    ];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid Order ID.' });
    }
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value.' });
    }
    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate({ path: 'userId', select: 'name email role' })
      .populate({ path: 'tableId', select: 'number seats status' })
      .populate({
        path: 'items.menuItemId',
        select: 'name price category image active',
      });
    if (!updated)
      return res.status(404).json({ success: false, error: 'Order not found.' });
    if (req.io) req.io.emit('order:update', updated);
    res.status(200).json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error updating status.' });
  }
});

// --- DELETE ORDER ---
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid Order ID.' });
    }
    const order = await Order.findByIdAndDelete(id);
    if (!order)
      return res.status(404).json({ success: false, error: 'Order not found.' });
    if (req.io) req.io.emit('order:delete', order);
    res.status(200).json({ success: true, message: 'Order deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error deleting order.' });
  }
});

export default router;
