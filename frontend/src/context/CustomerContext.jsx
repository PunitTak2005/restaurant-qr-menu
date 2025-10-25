import React, { createContext, useState, useEffect } from "react";

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    if (storedCustomer) {
      try {
        setCustomer(JSON.parse(storedCustomer));
      } catch {
        localStorage.removeItem("customer");
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (customer) {
      localStorage.setItem("customer", JSON.stringify(customer));
    }
  }, [customer]);

  // Customer login
  const loginCustomer = (customerData, token) => {
    setCustomer(customerData);
    localStorage.setItem("customer", JSON.stringify(customerData));
    localStorage.setItem("customerToken", token);
  };

  // Customer logout
  const logoutCustomer = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");
    setCustomer(null);
  };

  return (
    <CustomerContext.Provider
      value={{ customer, setCustomer, loginCustomer, logoutCustomer }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
