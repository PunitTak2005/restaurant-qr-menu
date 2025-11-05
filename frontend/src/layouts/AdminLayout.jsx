import React from "react";
import Navbar from "./Navbar";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="admin-main">{children}</main>
    </div>
  );
}

export default AdminLayout;
