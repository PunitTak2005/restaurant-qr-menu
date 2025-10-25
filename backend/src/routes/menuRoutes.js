import express from "express";
import Restaurant from "../models/Restaurant.js";
import Category from "../models/MenuCategory.js";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

// GET /api/menu/:slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // 1️⃣ Find restaurant by slug
    const restaurant = await Restaurant.findOne({ slug });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    // 2️⃣ Get categories for this restaurant
    const categories = await Category.find({ restaurant: restaurant._id }).lean();
    if (!categories.length) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    // 3️⃣ For each category, get items
    for (const category of categories) {
      const items = await MenuItem.find({ category: category._id }).lean();
      category.items = items; // add items to category
    }

    // 4️⃣ Return full menu
    return res.json({ success: true, restaurant: restaurant.name, menu: categories });
  } catch (err) {
    console.error("💥 Menu API error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
