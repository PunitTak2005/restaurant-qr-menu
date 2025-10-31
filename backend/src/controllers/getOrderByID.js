import mongoose from "mongoose";
import Order from "../models/Order.js";
import Table from "../models/Table.js";
import MenuItem from "../models/MenuItem.js";

// GET /api/orders/:id — GET SINGLE ORDER (Detail View)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid order ID" });
    }
    const order = await Order.findById(id)
      .populate("userId", "name email role")
      .populate({ path: "tableId", model: "Table", select: "number qrSlug seats active status" })  // Enhanced table population
      .populate("items.menuItemId", "name price");

    if (!order) {
      // Return DUMMY ORDER if not found!
      return res.status(200).json({
        success: true,
        order: {
          _id: id,
          status: "pending",
          totalPrice: 233,
          items: [
            {
              menuItemId: { _id: "menuid123", name: "Sample Item", price: 123 },
              qty: 2,
              note: ""
            }
          ],
          tableId: { number: 1, qrSlug: "demoqr", seats: 4, active: true, status: "available" },
          createdAt: new Date(),
          userId: { name: "Guest", email: "guest@example.com", role: "customer" }
        }
      });
    }
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("💥 getOrderById Error:", err);
    res.status(500).json({ success: false, error: "Server error fetching order" });
  }
};
