// Seed data for restaurants, categories, and menu items
const seedData = {
  // Restaurant info
  restaurant: {
    name: "Cafe Delight",
    slug: "cafe-delight"
  },

  // Categories
  categories: [
    { name: "Coffee" },
    { name: "Tea" },
    { name: "Cold Drinks" }
  ],

  // Menu items
  menuItems: [
    { name: "Espresso", price: 100, categoryName: "Coffee" },
    { name: "Cappuccino", price: 120, categoryName: "Coffee" },
    { name: "Green Tea", price: 80, categoryName: "Tea" },
    { name: "Black Tea", price: 70, categoryName: "Tea" },
    { name: "Cold Coffee", price: 150, categoryName: "Cold Drinks" }
  ]
};

// Default export
export default seedData;
