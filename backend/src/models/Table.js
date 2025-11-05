import mongoose from "mongoose";
import Order from "../models/Order.js";

// ================================
// Table Schema
// ================================
const tableSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true },
    qrSlug: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },
    seats: { type: Number, default: 4 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ================================
// Static Utility: Debug Orders-Table Links
// ================================
tableSchema.statics.logPopulatedOrders = async function () {
  try {
    const orders = await Order.find()
      .populate({
        path: "tableId",
        model: "Table",
        select: "number status",
      })
      .populate("userId", "name email role")
      .populate("items.menuItemId", "name price")
      .sort({ createdAt: -1 });

    console.log("✅ Populated Orders:", JSON.stringify(orders, null, 2));
    return orders;
  } catch (err) {
    console.error("💥 Error populating orders:", err.message);
    throw err;
  }
};

// ================================
// Export Model
// ================================
const Table = mongoose.models.Table || mongoose.model("Table", tableSchema);
export default Table;
