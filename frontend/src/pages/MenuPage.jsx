import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/useCart";
import coffeeImg from "/src/assets/coffee.jpg";
import teaImg from "/src/assets/tea.jpg";
import sandwichImg from "/src/assets/sandwich.jpg";
import "./MenuPage.css";
import vegBurgerImg from "/src/assets/veg-burger.jpg";
import pastaImg from "/src/assets/pasta.jpg";
import coldCoffeeImg from "/src/assets/cold-coffee.jpg";
import pizzaImg from "/src/assets/pizza.jpg";
import friesImg from "/src/assets/fries.jpg";
import chocolateShakeImg from "/src/assets/chocolate-shake.jpg";
import paneerWrapImg from "/src/assets/paneer-wrap.jpg";
import samosaImg from "/src/assets/samosa.jpg";
import mojitoImg from "/src/assets/mojito.jpg";

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
  {
    _id: "674f9a12345abc0011223344",
    name: "Veg Burger",
    price: 180,
    image: vegBurgerImg,
    description:
      "A juicy veggie patty topped with lettuce, tomato, and house sauce in a toasted bun. A delightful classic.",
  },
  {
    _id: "674f9a12345abc0011223345",
    name: "Pasta Alfredo",
    price: 220,
    image: pastaImg,
    description:
      "Creamy Alfredo pasta tossed with garlic, herbs, and parmesan cheese for the perfect comfort meal.",
  },
  {
    _id: "674f9a12345abc0011223346",
    name: "Cold Coffee",
    price: 120,
    image: coldCoffeeImg,
    description:
      "Chilled coffee blended smoothly with milk and ice cream for a refreshing caffeine indulgence.",
  },
  {
    _id: "674f9a12345abc0011223347",
    name: "Veg Pizza",
    price: 250,
    image: pizza,
    description:
      "Stone-baked pizza layered with tomato sauce, mozzarella, and fresh seasonal vegetables.",
  },
  {
    _id: "674f9a12345abc0011223348",
    name: "French Fries",
    price: 90,
    image: friesImg,
    description:
      "Crispy golden fries salted to perfection. The ideal snack to pair with any meal.",
  },
  {
    _id: "674f9a12345abc0011223349",
    name: "Chocolate Shake",
    price: 160,
    image: chocolateShakeImg,
    description:
      "Thick and creamy chocolate milkshake topped with whipped cream for the perfect treat.",
  },
  {
    _id: "674f9a12345abc0011223350",
    name: "Paneer Wrap",
    price: 180,
    image: paneerWrapImg,
    description:
      "Soft tortilla wrapped around spicy paneer, veggies, and tangy sauces. A flavorful on-the-go snack.",
  },
  {
    _id: "674f9a12345abc0011223351",
    name: "Samosa Plate",
    price: 70,
    image: samosaImg,
    description:
      "Crisp fried samosas stuffed with spicy potatoes and peas. Served with chutneys.",
  },
  {
    _id: "674f9a12345abc0011223352",
    name: "Mojito",
    price: 110,
    image: mojitoImg,
    description:
      "Refreshing drink of lime, mint, and soda served chilled with ice. A summer favorite.",
  },
];

const MenuPage = () => {
  const { slug } = useParams(); // Extract restaurant slug from /m/:slug
  const { addToCart } = useCart();
  const [addedMsg, setAddedMsg] = useState("");

  // Format restaurant name gracefully
  const restaurantName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Our Restaurant";

  // Add item to cart handler (no redirect)
  const handleAddToCart = (menuItem) => {
    addToCart({
      _id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
    });
    setAddedMsg(`${menuItem.name} added to cart!`);
    setTimeout(() => setAddedMsg(""), 1300);
  };

  return (
    <div className="menu-container">
      {/* Toast/feedback */}
      {addedMsg && <div className="cart-toast">{addedMsg}</div>}

      <div style={{ textAlign: "center", margin: "2rem 0 1rem 0" }}>
        <h1>
          Menu
          <span style={{ color: "#e67e22" }}></span>
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
    </div>
  );
};

export default MenuPage;
