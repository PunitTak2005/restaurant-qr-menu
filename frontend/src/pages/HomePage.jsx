import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HomePage.css";

import coffeeImg from "../assets/coffee.jpg";
import teaImg from "../assets/tea.jpg";
import sandwichImg from "../assets/sandwich.jpg";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  let greeting = "Welcome!";
  if (!user) greeting = "Welcome, Guest!";
  else if (user.role === "admin") greeting = "Welcome, Admin!";
  else if (user.role === "owner") greeting = "Welcome, Restaurant Owner!";
  else if (user.role === "customer") greeting = "Welcome, Valued Customer!";

  return (
    <div className="home-container">
    

      {/* Brand banner and greeting */}
      <header className="homepage-header">
        <h2>
          <span className="brand-highlight">Welcome to Digital Dine</span>
        </h2>
        
        
        
        <h2 className="homepage-greeting">{greeting}</h2>
       
        <p className="brand-mission">
          Your restaurant, reimagined. <b>Digital Dine simplifies ordering, enhances service, and delights guests with seamless, mobile-first dining.</b>
        </p>
      </header>

      {/* Hero + Gallery Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h2 className="hero-intro">
            Discover <span className="brand-highlight">contactless comfort</span> & signature flavors.
          </h2>
          <p className="hero-description">
            Browse, order, and enjoy—right from your device.<br />
            <span style={{ fontStyle: "italic", color: "#556" }}>
              Powering modern cafés, food halls, and fine dining.
            </span>
          </p>
          <section className="dish-gallery" aria-label="Featured dishes">
            <div className="dish-card">
              <img src={coffeeImg} alt="Fresh coffee" />
              <h3>Coffee</h3>
            </div>
            <div className="dish-card">
              <img src={teaImg} alt="Artisan tea" />
              <h3>Tea</h3>
            </div>
            <div className="dish-card">
              <img src={sandwichImg} alt="Gourmet sandwich" />
              <h3>Sandwich</h3>
            </div>
          </section>
          <button
            className="menu-btn"
            onClick={() => navigate("/m/cafe-delight")}
            aria-label="View our digital menu"
          >
            Explore Menu
          </button>
        </div>
      </main>

    
    </div>
  );
};

export default HomePage;
