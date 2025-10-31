// src/context/SocketContext.js
import React, { createContext, useContext } from "react";
import socket from "../socket";


// 1. Create the SocketContext
const SocketContext = createContext(null);

// 2. Provider for your app
export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
);

// 3. Easy hook for usage
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
