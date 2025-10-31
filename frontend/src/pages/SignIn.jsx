import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AuthForm.css";
import { useAuth } from "../context/AuthContext"; // Unified AuthContext
import { useContext } from "react";
import { CustomerContext } from "../context/CustomerContext";
import { OwnerContext } from "../context/OwnerContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const { loginCustomer } = useContext(CustomerContext);
  const { loginOwner } = useContext(OwnerContext);

  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------------------------------------------
  // Handle Login → POST request with Axios
  // ------------------------------------------------------------
  const handleSignIn = async (e) => {
    e.preventDefault();
    logout?.();
    localStorage.clear();

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      const data = res.data;
      if (!data || !data.success) {
        alert(data.error || "Invalid credentials. Please try again.");
        return;
      }

      const { user, token } = data;
      if (!user || !user.role) {
        alert("Invalid server response — missing user role.");
        return;
      }

      // Persist user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ---- Update Context (Triggers Navbar + Global UI Update)
      login(user, token);

      // ---- Role Redirection
      switch (user.role) {
        case "customer":
          loginCustomer?.(user, token);
          alert(`Welcome, ${user.name || user.email}`);
          navigate("/");
          break;
        case "owner":
          loginOwner?.(user, token);
          alert(`Welcome, ${user.name || user.email} (Staff)`);
          navigate("/owner/dashboard");
          break;
        case "admin":
          alert(`Welcome, ${user.name || user.email} (Admin)`);
          navigate("/admin/dashboard");
          break;
        default:
          alert("⚠️ Unrecognized role — cannot route user.");
          navigate("/");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      alert(
        err.response?.data?.error ||
          "Network or server error — please check backend connectivity."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <div className="auth-container">
      {/* Sign in to order warning */}
      <div
        style={{
          background: "#ffe6e6",
          color: "#b71c1c",
          border: "1px solid #f8bdbd",
          borderRadius: "6px",
          padding: "14px 18px",
          fontWeight: 600,
          fontSize: "1.05em",
          marginBottom: "18px",
          textAlign: "center"
        }}
      >
        ⚠️ You must <span style={{ textDecoration: "underline" }}>sign in</span> to place an order.
      </div>
      
      <form className="auth-form" onSubmit={handleSignIn}>
        <h2 className="auth-title">Sign In</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="auth-link-text">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
