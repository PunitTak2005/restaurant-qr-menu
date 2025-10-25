import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// =======================================================
// PROTECTED ROUTE COMPONENT
// Supports authentication check, optional role restriction,
// and path memory for redirection after login.
// =======================================================
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 1️⃣ Redirect unauthenticated users to /signin
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 2️⃣ Role-based access control (optional)
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "5rem",
          color: "crimson",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <h2>🚫 Access Denied</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  // 3️⃣ Otherwise render the protected page
  return children;
};

export default ProtectedRoute;
