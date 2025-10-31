// src/socket.js
import { io } from "socket.io-client";

// Use environment variable if available, else default to localhost
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || "http://localhost:5000";

// Create the Socket.IO client (singleton)
const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default socket;
