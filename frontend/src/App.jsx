import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./router/ProtectedRoute";

// ========== PAGE IMPORTS ==========
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";   // ✅ Double‑check spelling & case

// =======================================================
// MAIN APP COMPONENT
// =======================================================
const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/m/:slug" element={<MenuPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderStatusPage />
            </ProtectedRoute>
          }
        />

        {/* ---------- ROLE‑BASED ROUTES ---------- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff", "owner"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* ---------- 404 CATCH‑ALL ---------- */}
        <Route
          path="*"
          element={
            <h1 style={{ textAlign: "center", marginTop: "5rem" }}>
              Page Not Found
            </h1>
          }
        />
      </Routes>
    </>
  );
};

export default App;
