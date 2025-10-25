import React, { useState } from "react";
import { AdminContext } from "./AdminContext";

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}
