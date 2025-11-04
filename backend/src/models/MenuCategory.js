// backend/src/models/MenuCategory.js
import mongoose from "mongoose";

// =========================
// Menu Category Schema
// =========================
const menuCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters long"],
      maxlength: [60, "Category name cannot exceed 60 characters"],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant ID reference is required"],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description too long (max 300 chars)"],
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: [0, "Display order must be non‑negative"],
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// =========================
// Compound + Text Indexes
// =========================

// Enforce unique category name within a given restaurant
menuCategorySchema.index({ name: 1, restaurant: 1 }, { unique: true });

// Text search support for name + description
menuCategorySchema.index({ name: "text", description: "text" });

// =========================
// Static Helper Methods
// =========================

// Get categories for a specific restaurant (default: active only)
menuCategorySchema.statics.getByRestaurant = function (restaurantId, includeInactive = false) {
  const filter = { restaurant: restaurantId };
  if (!includeInactive) filter.active = true;
  return this.find(filter).sort({ displayOrder: 1, name: 1 });
};

// Soft‑deactivate a category without deletion
menuCategorySchema.statics.softDelete = function (categoryId) {
  return this.findByIdAndUpdate(categoryId, { active: false }, { new: true });
};

// =========================
// Model Export
// =========================
const MenuCategory = mongoose.model("MenuCategory", menuCategorySchema);
export default MenuCategory;
