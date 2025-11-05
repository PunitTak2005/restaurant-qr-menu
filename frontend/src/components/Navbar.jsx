import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, logout, isAuthenticated } = useAuth();

  // Hamburger menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Restore user from localStorage on hard refresh
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored && !user) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, [user, setUser]);

  // Get placed order ID if it exists
  const [orderId, setOrderId] = useState(null);
  useEffect(() => {
    const storedOrderId = localStorage.getItem("lastOrderId");
    if (storedOrderId) setOrderId(storedOrderId);
  }, []);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/signin");
    window.scrollTo(0, 0);
  };

  // Toggle the mobile menu
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="navbar">
      {/* LEFT — Logo & Hamburger */}
      <div className="navbar-left">
        {logo && (
          <img
            src={logo}
            alt="Logo"
            style={{ width: 45, marginRight: 12 }}
          />
        )}
        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* LINKS — Responsive */}
      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/m/digital-dine" onClick={() => setMenuOpen(false)}>Menu</Link>
        <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
        {user?.role === "admin" && (
          <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
        )}
        {user?.role === "owner" && (
          <Link to="/owner/dashboard" onClick={() => setMenuOpen(false)}>Staff Dashboard</Link>
        )}
        {user && (
          <Link to="/my-orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
        )}
        <div className="navbar-auth">
          {isAuthenticated && user ? (
            <>
              <span>
                Welcome, {user?.name || user?.email || "User"}
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="signup-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
