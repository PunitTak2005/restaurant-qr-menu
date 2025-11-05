import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate("/signin");
    window.scrollTo(0, 0);
    setDropdownOpen(false); // close menu on logout
  };

  // Mobile screen dropdown nav links
  const navLinks = (
    <>
      <Link to="/" className="navbar-link" onClick={() => setDropdownOpen(false)}>Home</Link>
      <Link to="/m/digital-dine" className="navbar-link" onClick={() => setDropdownOpen(false)}>Menu</Link>
      <Link to="/cart" className="navbar-link" onClick={() => setDropdownOpen(false)}>Cart</Link>
      {user?.role === "admin" &&
        <Link to="/admin/dashboard" className="navbar-link" onClick={() => setDropdownOpen(false)}>Admin Dashboard</Link>
      }
      {user?.role === "owner" &&
        <Link to="/owner/dashboard" className="navbar-link" onClick={() => setDropdownOpen(false)}>Staff Dashboard</Link>
      }
      {user &&
        <Link to="/my-orders" className="navbar-link" onClick={() => setDropdownOpen(false)}>My Orders</Link>
      }
    </>
  );

  // Auth controls for dropdown
  const authControls = isAuthenticated && user ? (
    <>
      <span className="navbar-welcome">Welcome, {user?.name || user?.email || "User"}</span>
      <button onClick={handleLogout} className="navbar-logout-btn">Logout</button>
    </>
  ) : (
    <>
      <Link to="/signin" className="navbar-link" onClick={() => setDropdownOpen(false)}>Login</Link>
      <Link to="/signup" className="navbar-signup-btn" onClick={() => setDropdownOpen(false)}>Sign Up</Link>
    </>
  );

  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="navbar-logo" />
      <button
        className="navbar-hamburger"
        aria-label="Toggle navigation menu"
        onClick={() => setDropdownOpen((open) => !open)}
      >☰</button>

      {/* Normal links for desktop/tablet */}
      <div className="navbar-left">
        {navLinks}
      </div>

      {/* Right side for desktop/tablet */}
      <div className="navbar-right">
        {authControls}
      </div>

      {/* Dropdown for mobile: All links + auth controls */}
      <div className={`navbar-links-dropdown ${dropdownOpen ? "open" : ""}`}>
        {navLinks}
        {authControls}
      </div>
    </nav>
  );
};

export default Navbar;
