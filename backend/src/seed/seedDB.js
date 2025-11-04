import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";
import Category from "../models/MenuCategory.js";
import MenuItem from "../models/MenuItem.js";
import seedData from "./seedData.js";

// -------------------------
// Helper: Seed Categories
// -------------------------
const seedCategories = async (restaurant) => {
  for (const cat of seedData.categories) {
    const existing = await Category.findOne({ name: cat.name, restaurant: restaurant._id });
    if (!existing) {
      await Category.create({ name: cat.name, restaurant: restaurant._id });
      console.log(`✅ Category created: ${cat.name}`);
    } else {
      console.log(`ℹ️ Category already exists: ${cat.name}`);
    }
  }
};

// -------------------------
// Helper: Seed Menu Items
// -------------------------
const seedMenuItems = async (restaurant) => {
  const categories = await Category.find({ restaurant: restaurant._id });

  for (const item of seedData.menuItems) {
    const category = categories.find(c => c.name === item.categoryName);
    if (!category) {
      console.warn(`⚠️ No category found for menu item: ${item.name}, skipping.`);
      continue;
    }

    const existingItem = await MenuItem.findOne({ name: item.name, category: category._id });
    if (!existingItem) {
      await MenuItem.create({
        name: item.name,
        price: item.price,
        category: category._id
      });
      console.log(`✅ Menu item created: ${item.name}`);
    } else {
      console.log(`ℹ️ Menu item already exists: ${item.name}`);
    }
  }
};

// -------------------------
// Main Seed Function
// -------------------------
export default async function seedDB() {
  try {
    // Restaurant
    let restaurant = await Restaurant.findOne({ slug: "cafe-delight" });
    if (!restaurant) {
      restaurant = await Restaurant.create({
        name: "Cafe Delight",
        slug: "cafe-delight"
      });
      console.log("✅ Restaurant created");
    } else {
      console.log("ℹ️ Restaurant already exists");
    }

    // Seed categories and items
    await seedCategories(restaurant);
    await seedMenuItems(restaurant);

    console.log("✅ Seeding completed");
  } catch (err) {
    console.error("💥 SeedDB error:", err);
  }
}

// -------------------------
// Run directly if called
// -------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  mongoose.connect("mongodb://127.0.0.1:27017/restaurantDB")
    .then(() => seedDB())
    .then(() => mongoose.disconnect())
    .then(() => console.log("✅ MongoDB disconnected"))
    .catch(err => console.error("💥 MongoDB connection/seeding error:", err));
}
