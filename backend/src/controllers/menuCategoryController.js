import mongoose from "mongoose";
import MenuCategory from "../models/MenuCategory.js";

// ========================
// Create a new category
// ========================
export const createCategory = async (req, res) => {
  try {
    const { name, description, displayOrder, active } = req.body;
    const category = new MenuCategory({ name, description, displayOrder, active });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========================
// Get all categories (sorted by displayOrder)
// ========================
export const getCategories = async (req, res) => {
  try {
    const categories = await MenuCategory.find().sort({ displayOrder: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========================
// Get single category by ID
// ========================
export const getCategoryById = async (req, res) => {
  let { id } = req.params;
  id = id.trim(); // Remove whitespace/newlines

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: "Invalid category ID" });
  }

  try {
    const category = await MenuCategory.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========================
// Update category
// ========================
export const updateCategory = async (req, res) => {
  let { id } = req.params;
  id = id.trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: "Invalid category ID" });
  }

  try {
    const category = await MenuCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, error: "Category not found" });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ========================
// Delete category
// ========================
export const deleteCategory = async (req, res) => {
  let { id } = req.params;
  id = id.trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: "Invalid category ID" });
  }

  try {
    const category = await MenuCategory.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, error: "Category not found" });
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
