import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import coffeeImg from "../assets/coffee.jpg";
import teaImg from "../assets/tea.jpg";
import sandwichImg from "../assets/sandwich.jpg";
import "./MenuPage.css";

// Sample Menu Data (can later be fetched via API)
const sampleMenu = [
  {
    _id: "674f9a12345abc0011223341",
    name: "Coffee",
    price: 100,
    image: coffeeImg,
    description:
      "A rich, aromatic beverage brewed from roasted coffee beans. Perfect for an energizing start to your day.",
  },
  {
    _id: "674f9a12345abc0011223342",
    name: "Tea",
    price: 50,
    image: teaImg,
    description:
      "A soothing infusion of premium tea leaves, served hot or cold. Refreshing and relaxing any time of day.",
  },
  {
    _id: "674f9a12345abc0011223343",
    name: "Sandwich",
    price: 150,
    image: sandwichImg,
    description:
      "A fresh, delicious sandwich made with soft bread, crisp vegetables, cheese, and your favorite fillings.",
  },
];

const MenuPage = () => {
  const { slug } = useParams(); // Extract restaurant slug from /m/:slug
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Format restaurant name gracefully
  const restaurantName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Our Restaurant";

  // Add item to cart handler (ensures backend schema parity)
  const handleAddToCart = (menuItem) => {
    addToCart({
      _id: menuItem._id, // ✅ MongoDB-style ObjectId guarantee
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
    });
    navigate("/cart"); // Redirect to cart after adding
  };

  return (
    <div className="menu-container">
      <div style={{ textAlign: "center", margin: "2rem 0 1rem 0" }}>
        <h1>
          Menu for <span style={{ color: "#e67e22" }}>{restaurantName}</span>
        </h1>
        <p>Choose your favorite dishes and enjoy quick, contactless dining!</p>
      </div>

      <main className="menu-grid">
        {sampleMenu.map((item) => (
          <div key={item._id} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-img" />
            <h3>{item.name}</h3>
            <p className="menu-description">{item.description}</p>
            <span>₹{item.price}</span>
            <button className="add-btn" onClick={() => handleAddToCart(item)}>
              Add to Cart
            </button>
          </div>
        ))}
      </main>

      <footer className="menu-footer">
        <p>© 2025 Digital Dine. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default MenuPage;
