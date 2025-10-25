import mongoose from "mongoose";
import MenuItem from "../models/MenuItem.js";  // ✅ menu items reference
import User from "../models/User.js";          // ✅ customer/user reference
import Table from "../models/Table.js";        // ✅ table reference (model name must be "Table")









// ==================================================
// Subdocument Schema: Ordered Item
// ==================================================
const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MenuItem.modelName, // references MenuItem
      required: [true, "Menu item reference is required"],
    },
    qty: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, "Note cannot exceed 200 characters"],
      default: "",
    },
  },
  { _id: false, storeSubdocValidationError: false }
);

// ==================================================
// Main Order Schema
// ==================================================
const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tableId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Table",   // ✅ must match exactly with the model name in Table.js
  required: true,
},

    items: [
      {
        menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
        qty: { type: Number, required: true },
        note: String,
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "served", "completed"], default: "pending" },
  },
  { timestamps: true }
);
// ==================================================
// Validation Middleware
// ==================================================
orderSchema.pre("validate", function (next) {
  if (this.items?.length && this.totalPrice < 0) {
    this.invalidate("totalPrice", "Total price must be positive.");
  }
  next();
});

// ==================================================
// Static Query Helpers (for Admin & Dashboard Views)
// ==================================================
orderSchema.statics.fetchRecentOrders = function () {
  return this.find()
    .populate({ path: "userId", select: "name email role" })
    .populate({ path: "tableId", select: "number seats status" })
    .populate({
      path: "items.menuItemId",
      model: MenuItem.modelName,
      select: "name price category image availability",
    })
    .sort({ createdAt: -1 });
};

orderSchema.statics.getPopulatedOrderById = function (id) {
  return this.findById(id)
    .populate({ path: "userId", select: "name email role" })
    .populate({ path: "tableId", select: "number seats status" })
    .populate({
      path: "items.menuItemId",
      model: MenuItem.modelName,
      select: "name price category image availability",
    });
};

// ==================================================
// Safe Model Export
// ==================================================
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
