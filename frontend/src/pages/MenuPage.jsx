import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/AuthContext";
import coffeeImg from "../assets/coffee.jpg";
import teaImg from "../assets/tea.jpg";
import sandwichImg from "../assets/sandwich.jpg";
import "./MenuPage.css";
import vegBurgerImg from "../assets/veg-burger.jpg";
import pastaImg from "../assets/pasta.jpg";
import coldCoffeeImg from "../assets/cold-coffee.jpg";
import pizzaImg from "../assets/pizza.jpg";
import friesImg from "../assets/fries.jpg";
import chocolateShakeImg from "../assets/chocolate-shake.jpg";
import paneerWrapImg from "../assets/paneer-wrap.jpg";
import samosaImg from "../assets/samosa.jpg";
import mojitoImg from "../assets/mojito.jpg";
import signInImage from "../assets/image.png";

const sampleMenu = [
  {
    _id: "674f9a12345abc0011223341",
    name: "Coffee",
    price: 100,
    image: coffeeImg,
    description: "A rich, aromatic beverage brewed from roasted coffee beans. Perfect for an energizing start to your day.",
  },
  {
    _id: "674f9a12345abc0011223342",
    name: "Tea",
    price: 50,
    image: teaImg,
    description: "A soothing infusion of premium tea leaves, served hot or cold. Refreshing and relaxing any time of day.",
  },
  {
    _id: "674f9a12345abc0011223343",
    name: "Sandwich",
    price: 150,
    image: sandwichImg,
    description: "A fresh, delicious sandwich made with soft bread, crisp vegetables, cheese, and your favorite fillings.",
  },
  {
    _id: "674f9a12345abc0011223344",
    name: "Veg Burger",
    price: 180,
    image: vegBurgerImg,
    description: "A juicy veggie patty topped with lettuce, tomato, and house sauce in a toasted bun. A delightful classic.",
  },
  {
    _id: "674f9a12345abc0011223345",
    name: "Pasta Alfredo",
    price: 220,
    image: pastaImg,
    description: "Creamy Alfredo pasta tossed with garlic, herbs, and parmesan cheese for the perfect comfort meal.",
  },
  {
    _id: "674f9a12345abc0011223346",
    name: "Cold Coffee",
    price: 120,
    image: coldCoffeeImg,
    description: "Chilled coffee blended smoothly with milk and ice cream for a refreshing caffeine indulgence.",
  },
  {
    _id: "674f9a12345abc0011223347",
    name: "Veg Pizza",
    price: 250,
    image: pizzaImg,
    description: "Stone-baked pizza layered with tomato sauce, mozzarella, and fresh seasonal vegetables.",
  },
  {
    _id: "674f9a12345abc0011223348",
    name: "French Fries",
    price: 90,
    image: friesImg,
    description: "Crispy golden fries salted to perfection. The ideal snack to pair with any meal.",
  },
  {
    _id: "674f9a12345abc0011223349",
    name: "Chocolate Shake",
    price: 160,
    image: chocolateShakeImg,
    description: "Thick and creamy chocolate milkshake topped with whipped cream for the perfect treat.",
  },
  {
    _id: "674f9a12345abc0011223350",
    name: "Paneer Wrap",
    price: 180,
    image: paneerWrapImg,
    description: "Soft tortilla wrapped around spicy paneer, veggies, and tangy sauces. A flavorful on-the-go snack.",
  },
  {
    _id: "674f9a12345abc0011223351",
    name: "Samosa Plate",
    price: 70,
    image: samosaImg,
    description: "Crisp fried samosas stuffed with spicy potatoes and peas. Served with chutneys.",
  },
  {
    _id: "674f9a12345abc0011223352",
    name: "Mojito",
    price: 110,
    image: mojitoImg,
    description: "Refreshing drink of lime, mint, and soda served chilled with ice. A summer favorite.",
  },
];

const searchInputStyle = {
  marginTop: "1rem",
  padding: "0.6rem 1.2rem",
  fontSize: "1.08rem",
  width: "80%",
  maxWidth: "400px",
  borderRadius: "25px",
  border: "2px solid #e67e22",
  outline: "none",
  background: "#fafdff",
  color: "#6c7886",
  fontFamily: "'Roboto', 'Segoe UI', Arial, sans-serif",
  fontWeight: 400,
  letterSpacing: "0.05em",
  boxShadow: "0 2px 10px rgba(241,240,238,0.09)",
  transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s, color 0.3s",
};

const searchInputFocusStyle = {
  borderColor: "#f39c12",
  background: "#fff",
  color: "#526176",
  boxShadow: "0 0 10px 2.5px rgba(243,156,18,0.16)",
};

const MenuPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [addedMsg, setAddedMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const timerRef = useRef();

  // Show DIGITAL DINE instead of the slug restaurant name
  const restaurantName = slug ? (slug === "cafe-delight" ? "DIGITAL DINE" : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())) : "Our Restaurant";

  const showToast = (msg, duration = 1800) => {
    setAddedMsg(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAddedMsg(""), duration);
  };

  const handleAddToCart = (menuItem) => {
    if (!user) {
      showToast("You must sign in to order.", 2200);
      return;
    }
    addToCart({
      _id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
    });
    showToast(`${menuItem.name} added to cart!`, 1300);
  };

  const filteredMenu = sampleMenu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const finalSearchStyle = isFocus
    ? { ...searchInputStyle, ...searchInputFocusStyle }
    : searchInputStyle;

  return (
    <div className="menu-container">
      {addedMsg && (
        <div className="cart-toast square-toast">
          {addedMsg === "You must sign in to order." ? (
            <>
              <img
                src={signInImage}
                alt="Please sign in to order"
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "18px",
                  objectFit: "cover",
                  margin: "0 auto 1.1rem auto",
                  boxShadow: "0 4px 20px rgba(44,62,80,0.16)",
                  display: "block",
                }}
              />
              <div
                style={{
                  fontWeight: 600,
                  color: "#f8f9fa",
                  fontSize: "1rem",
                  textAlign: "center",
                  padding: "0 10px",
                }}
              >
                You must sign in to order.
              </div>
            </>
          ) : (
            <>{addedMsg}</>
          )}
        </div>
      )}

      <div style={{ textAlign: "center", margin: "2rem 0 1rem 0" }}>
        <h1>
          Menu <span style={{ color: "#e67e22" }}>{restaurantName}</span>
        </h1>
        <p>Choose your favorite dishes and enjoy quick, contactless dining!</p>

        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={finalSearchStyle}
          aria-label="Search menu items"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
      </div>

      <main className="menu-grid">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => (
            <div key={item._id} className="menu-card">
              <img src={item.image} alt={item.name} className="menu-img" />
              <h3>{item.name}</h3>
              <p className="menu-description">{item.description}</p>
              <span>₹{item.price}</span>
              <button
                className="add-btn"
                onClick={() => handleAddToCart(item)}
                title={!user ? "Please sign in to order" : "Add to Cart"}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              marginTop: "2rem",
              color: "#777",
            }}
          >
            No menu items found.
          </p>
        )}
      </main>
    </div>
  );
};

export default MenuPage;
