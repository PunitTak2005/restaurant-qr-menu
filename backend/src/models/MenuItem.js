// backend/src/models/MenuItem.js
import mongoose from "mongoose";

// =========================
// Menu Item Schema
// =========================
const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: [true, "Menu category reference is required"],
      index: true, // speeds up category-based lookups
    },
    price: {
      type: Number,
      required: [true, "Menu item price is required"],
      min: [0, "Price must be a non-negative number"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description too long (max 300 chars)"],
    },
    image: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: (url) =>
          !url ||
          /^(http|https):\/\/[^\s$.?#].[^\s]*$/gm.test(url) ||
          url.startsWith("uploads/"),
        message: "Invalid image URL format",
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// =========================
// Indexes
// =========================
menuItemSchema.index({ name: "text", description: "text" }); // Enables text search
menuItemSchema.index({ category: 1, active: 1 }); // Optimizes menu/category queries

// =========================
// Static Helpers
// =========================

// Retrieve all visible (active) items per category
menuItemSchema.statics.getActiveByCategory = function (categoryId) {
  return this.find({ category: categoryId, active: true })
    .select("name price description image")
    .sort({ name: 1 });
};

// Deactivate item without deleting it
menuItemSchema.statics.softDelete = function (itemId) {
  return this.findByIdAndUpdate(itemId, { active: false }, { new: true });
};

// =========================
// Model Export
// =========================
const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
