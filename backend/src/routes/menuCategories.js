import express from "express";
import MenuItem from "../models/MenuItem.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../controllers/menuCategoryController.js";

const router = express.Router();

/* ==========================
   MENU CATEGORIES ROUTES
========================== */

// Create category
router.post("/categories", createCategory);

// Get all categories (sorted by displayOrder)
router.get("/categories", getCategories);

// Get single category by ID
router.get("/categories/:id", getCategoryById);

// Update category
router.put("/categories/:id", updateCategory);

// Delete category
router.delete("/categories/:id", deleteCategory);

/* ==========================
   MENU ITEMS ROUTES
========================== */

// GET all menu items
router.get("/items", async (req, res) => {
  try {
    const items = await MenuItem.find().populate("category");
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single menu item by ID
router.get("/items/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("category");
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new menu item
router.post("/items", async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update menu item
router.put("/items/:id", async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE menu item
router.delete("/items/:id", async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
