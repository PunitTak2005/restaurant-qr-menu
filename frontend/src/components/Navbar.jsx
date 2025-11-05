import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, logout, isAuthenticated } = useAuth();

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

  return (
    <nav className="navbar">
      {/* LEFT — Logo & Links */}
      <div className="navbar-left">
        {logo && (
          <img
            src={logo}
            alt="Logo"
            className="navbar-logo"
          />
        )}

        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/m/digital-dine" className="navbar-link">
          Menu
        </Link>
        <Link to="/cart" className="navbar-link">
          Cart
        </Link>

        {user?.role === "admin" && (
          <Link to="/admin/dashboard" className="navbar-link">
            Admin Dashboard
          </Link>
        )}
        {user?.role === "owner" && (
          <Link to="/owner/dashboard" className="navbar-link">
            Staff Dashboard
          </Link>
        )}
        {user && (
          <Link to="/my-orders" className="navbar-link">
            My Orders
          </Link>
        )}
      </div>

      {/* RIGHT — Auth Controls */}
      <div className="navbar-right">
        {isAuthenticated && user ? (
          <>
            <span className="navbar-welcome">
              Welcome, {user?.name || user?.email || "User"}
            </span>
            <button onClick={handleLogout} className="navbar-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="navbar-link">
              Login
            </Link>
            <Link to="/signup" className="navbar-signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
