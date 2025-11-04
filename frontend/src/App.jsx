import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./router/ProtectedRoute";

// ---- PAGE IMPORTS ----
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AllOrdersPage from "./pages/AllOrdersPage";
import MyOrders from "./pages/MyOrders";

// Removed: import { SocketProvider } from "./context/SocketContext"; or similar

const App = () => (
  // REMOVED: <SocketProvider> wrapper
  <Layout>
    <Routes>
      {/* ------ PUBLIC ROUTES ------ */}
      <Route path="/" element={<HomePage />} />
      <Route path="/m/:slug" element={<MenuPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* ------ PROTECTED ROUTES ------ */}
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

      {/* ------ ROLE-BASED DASHBOARDS ------ */}
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

      {/* ---- ORDERS DASHBOARD: ALL ALLOWED ROLES ---- */}
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute allowedRoles={["customer", "staff", "admin", "owner"]}>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      {/* ---- STAFF/ADMIN/OWNER ALL ORDERS PAGE ---- */}
      <Route
        path="/all-orders"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff", "owner"]}>
            <AllOrdersPage />
          </ProtectedRoute>
        }
      />

      {/* ------ 404 CATCH‑ALL ------ */}
      <Route
        path="*"
        element={
          <h1 style={{ textAlign: "center", marginTop: "5rem" }}>
            Page Not Found
          </h1>
        }
      />
    </Routes>
  </Layout>
  // REMOVED: </SocketProvider> wrapper
);

export default App;
