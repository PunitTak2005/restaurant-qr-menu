import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

import coffeeImg from "../assets/coffee.jpg";
import teaImg from "../assets/tea.jpg";
import sandwichImg from "../assets/sandwich.jpg";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Custom greeting based on role
  let greeting = "Welcome!";
  if (!user) greeting = "Welcome Guest!";
  else if (user.role === "admin") greeting = "Welcome Admin!";
  else if (user.role === "owner") greeting = "Welcome Owner!";
  else if (user.role === "customer") greeting = "Welcome Customer!";

  return (
    <div className="home-container">
      {/* 🔸 Dynamic Greeting */}
      <h2 style={{ textAlign: "center", margin: "20px 0 0 0" }}>{greeting}</h2>

      {/* 🔸 Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h2>
            Welcome to <span>Digital Dine</span>
          </h2>

          <div className="dish-gallery">
            <div className="dish-card">
              <img src={coffeeImg} alt="Coffee" />
              <h3>Coffee</h3>
            </div>
            <div className="dish-card">
              <img src={teaImg} alt="Tea" />
              <h3>Tea</h3>
            </div>
            <div className="dish-card">
              <img src={sandwichImg} alt="Sandwich" />
              <h3>Sandwich</h3>
            </div>
          </div>

          <button
            className="menu-btn"
            onClick={() => navigate("/m/cafe-delight")}
          >
            Explore Menu
          </button>
        </div>
      </main>

      {/* 🔸 Footer */}
      <footer className="footer">
        <p>© 2025 Digital Dine.</p>
      </footer>
    </div>
  );
};

export default HomePage;
