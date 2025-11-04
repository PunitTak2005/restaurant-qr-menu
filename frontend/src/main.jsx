import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// =======================================================
// Context Providers
// =======================================================
import { AuthProvider } from "./context/AuthContext";
import { CustomerProvider } from "./context/CustomerContext";
import { OwnerProvider } from "./context/OwnerContext";
import { CartProvider } from "./context/useCart";

import "./index.css";

// =======================================================
// Combined Providers Wrapper (order is important!)
// =======================================================
const Providers = ({ children }) => (
  <AuthProvider>
    <CustomerProvider>
      <OwnerProvider>
        <CartProvider>
       
            {children}
       
        </CartProvider>
      </OwnerProvider>
    </CustomerProvider>
  </AuthProvider>
);

// =======================================================
// Render Root
// =======================================================
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <App />
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);
