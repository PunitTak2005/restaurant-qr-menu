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
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 32px",
        background: "#111",
        color: "#fff",
        width: "100%",
        boxShadow: "0 3px 12px rgba(44,62,80,0.07)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2000,
        minHeight: "62px",
      }}
      className="navbar"
    >
      {/* LEFT — Logo & Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        {logo && (
          <img
            src={logo}
            alt="Logo"
            style={{ width: "50px", marginRight: "16px" }}
          />
        )}

        <Link
          to="/"
          style={{
            marginRight: "15px",
            color: "#f8f9fa",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "1.07rem",
            padding: "6px 10px",
            borderRadius: "6px",
            transition: "background 0.18s, color 0.18s",
          }}
        >
          Home
        </Link>
        <Link
          to="/m/digital-dine"
          style={{
            marginRight: "15px",
            color: "#f8f9fa",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "1.07rem",
            padding: "6px 10px",
            borderRadius: "6px",
            transition: "background 0.18s, color 0.18s",
          }}
        >
          Menu
        </Link>
        <Link
          to="/cart"
          style={{
            marginRight: "15px",
            color: "#f8f9fa",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "1.07rem",
            padding: "6px 10px",
            borderRadius: "6px",
            transition: "background 0.18s, color 0.18s",
          }}
        >
          Cart
        </Link>

   
       

        {user?.role === "admin" && <Link to="/admin/dashboard">Admin Dashboard</Link>}
        {user?.role === "owner" && <Link to="/owner/dashboard">Staff Dashboard</Link>}
        {user && (<Link to="/my-orders">My Orders</Link>)}

      </div>

      {/* RIGHT — Auth Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isAuthenticated && user ? (
          <>
            <span style={{ fontSize: "1rem", fontWeight: 500 }}>
              Welcome, {user?.name || user?.email || "User"}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "#e67e22",
                color: "#fff",
                border: "none",
                borderRadius: "24px",
                padding: "7px 16px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "1.05rem",
                transition: "background 0.22s",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              style={{
                color: "#f8f9fa",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "1.07rem",
                padding: "6px 10px",
                borderRadius: "6px",
                transition: "background 0.18s, color 0.18s",
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                background: "#e67e22",
                color: "#fff",
                borderRadius: "24px",
                padding: "7px 18px",
                marginLeft: "3px",
                fontWeight: 600,
                fontSize: "1.07rem",
                textDecoration: "none",
                transition: "background 0.22s",
              }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
