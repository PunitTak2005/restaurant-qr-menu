import mongoose from "mongoose";
import MenuItem from "../models/MenuItem.js"; // ✅ Menu item reference
import User from "../models/User.js";         // ✅ User/customer reference
import Table from "../models/Table.js";       // ✅ Table/restaurant table reference

// ==================================================
// Subdocument Schema: Ordered Item
// ==================================================
const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MenuItem.modelName,
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
  { _id: false }
);

// ==================================================
// Main Order Schema
// ==================================================
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Table.modelName,
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v >= 0,
        message: "Total price must be positive.",
      },
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "paid", "cancelled"],
      default: "pending",
    },
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
// Static Query Helpers
// ==================================================
orderSchema.statics.fetchRecentOrders = function () {
  return this.find()
    .populate({ path: "userId", select: "name email role" })
    .populate({ path: "tableId", select: "number capacity status" })
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
    .populate({ path: "tableId", select: "number capacity status" })
    .populate({
      path: "items.menuItemId",
      model: MenuItem.modelName,
      select: "name price category image availability",
    });
};

// ==================================================
// Safe Export
// ==================================================
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
