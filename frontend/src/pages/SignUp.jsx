import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthForm.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // ---------------- HANDLE SIGNUP (POST to Backend) ----------------
  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = { name, email, password, role };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        // ✅ Use /register route that exists in your backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Account created successfully!");
        console.log("User created:", data.user);
        // Optional: redirect to login page or dashboard
        window.location.href = "/signin";
      } else {
        alert("⚠️ " + (data.message || "Signup failed"));
      }
    } catch (err) {
      console.error("❌ Signup failed:", err.message);
      alert("Something went wrong! Check the console for details.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignUp}>
        <h2 className="auth-title">Sign Up</h2>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
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

        <div className="form-group">
          <label>Role</label>
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select your role</option>
            <option value="customer">Customer</option>
            {/* <option value="owner">Staff</option> */}
            {/* <option value="admin">Admin</option> */}
          </select>
        </div>

        <button className="auth-btn" type="submit">
          Create Account
        </button>

        <p className="auth-link-text">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
