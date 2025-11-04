import React from "react";
import Navbar from "./Navbar";

function AdminLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
}

export default AdminLayout;
