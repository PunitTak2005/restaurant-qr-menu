import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, logout, isAuthenticated } = useAuth();
  
  // Mobile dropdown toggle state
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when a link is clicked
  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      {/* LEFT — Logo & Navigation */}
      <div className="navbar-left">
        {logo && (
          <img
            src={logo}
            alt="Restaurant Logo"
            className="navbar-logo"
          />
        )}

        {/* Hamburger Menu Button for Mobile */}
        <button
          className="navbar-hamburger"
          onClick={toggleDropdown}
          aria-label="Toggle navigation menu"
          aria-expanded={dropdownOpen}
          aria-controls="mobile-dropdown"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Desktop Links (hidden on mobile) */}
        <div className="navbar-links">
          <Link className="navbar-link" to="/" aria-label="Go to home page">
            Home
          </Link>
          <Link className="navbar-link" to="/m/digital-dine" aria-label="View menu">
            Menu
          </Link>
          <Link className="navbar-link" to="/cart" aria-label="View shopping cart">
            Cart
          </Link>
          {user?.role === "admin" && (
            <Link className="navbar-link" to="/admin/dashboard" aria-label="Go to admin dashboard">
              Admin Dashboard
            </Link>
          )}
          {user?.role === "owner" && (
            <Link className="navbar-link" to="/owner/dashboard" aria-label="Go to staff dashboard">
              Staff Dashboard
            </Link>
          )}
          {user && (
            <Link className="navbar-link" to="/my-orders" aria-label="View my orders">
              My Orders
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {dropdownOpen && (
        <div className="navbar-dropdown" id="mobile-dropdown" role="menu">
          <Link
            className="navbar-dropdown-link"
            to="/"
            onClick={closeDropdown}
            role="menuitem"
            aria-label="Go to home page"
          >
            Home
          </Link>
          <Link
            className="navbar-dropdown-link"
            to="/m/digital-dine"
            onClick={closeDropdown}
            role="menuitem"
            aria-label="View menu"
          >
            Menu
          </Link>
          <Link
            className="navbar-dropdown-link"
            to="/cart"
            onClick={closeDropdown}
            role="menuitem"
            aria-label="View shopping cart"
          >
            Cart
          </Link>
          {user?.role === "admin" && (
            <Link
              className="navbar-dropdown-link"
              to="/admin/dashboard"
              onClick={closeDropdown}
              role="menuitem"
              aria-label="Go to admin dashboard"
            >
              Admin Dashboard
            </Link>
          )}
          {user?.role === "owner" && (
            <Link
              className="navbar-dropdown-link"
              to="/owner/dashboard"
              onClick={closeDropdown}
              role="menuitem"
              aria-label="Go to staff dashboard"
            >
              Staff Dashboard
            </Link>
          )}
          {user && (
            <Link
              className="navbar-dropdown-link"
              to="/my-orders"
              onClick={closeDropdown}
              role="menuitem"
              aria-label="View my orders"
            >
              My Orders
            </Link>
          )}
        </div>
      )}

      {/* RIGHT — Auth Controls */}
      <div className="navbar-right">
        {isAuthenticated && user ? (
          <>
            <span className="navbar-welcome" aria-label="Welcome message">
              Welcome, {user?.name || user?.email || "User"}
            </span>
            <button
              className="navbar-logout-btn"
              onClick={handleLogout}
              aria-label="Logout from your account"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="navbar-link" to="/signin" aria-label="Login to your account">
              Login
            </Link>
            <Link className="navbar-signup-btn" to="/signup" aria-label="Create new account">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
