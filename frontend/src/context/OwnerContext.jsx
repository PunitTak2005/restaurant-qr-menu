import React, { createContext, useState, useEffect } from "react";

export const OwnerContext = createContext();

export const OwnerProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);

  // Load owner from localStorage
  useEffect(() => {
    const storedOwner = localStorage.getItem("owner");
    if (storedOwner) {
      try {
        setOwner(JSON.parse(storedOwner));
      } catch {
        localStorage.removeItem("owner");
      }
    }
  }, []);

  // Save owner data when changed
  useEffect(() => {
    if (owner) {
      localStorage.setItem("owner", JSON.stringify(owner));
    }
  }, [owner]);

  // Owner login
  const loginOwner = (ownerData, token) => {
    setOwner(ownerData);
    localStorage.setItem("owner", JSON.stringify(ownerData));
    localStorage.setItem("ownerToken", token);
  };

  // Owner logout
  const logoutOwner = () => {
    localStorage.removeItem("owner");
    localStorage.removeItem("ownerToken");
    setOwner(null);
  };

  return (
    <OwnerContext.Provider value={{ owner, setOwner, loginOwner, logoutOwner }}>
      {children}
    </OwnerContext.Provider>
  );
};
