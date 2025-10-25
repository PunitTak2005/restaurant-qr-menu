import Order from "../models/Order.js";
import Table from "../models/Table.js";          // Ensure Table is imported
import MenuItem from "../models/MenuItem.js";    // Ensure MenuItem is imported

// GET /orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find order by ID and populate table info and menu items
    const order = await Order.findById(id)
      .populate('tableId', 'number qrSlug seats active')  // populate tableId with selected fields
      .populate('items.menuItemId', 'name price');       // populate each menuItem in items

    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
