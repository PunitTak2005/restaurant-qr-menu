// src/socket.js
import { io } from "socket.io-client";

// Use an environment variable if deploying; defaults to your local backend server
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:5000";

// The Socket.IO client instance (shared singleton)
const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket", "polling"], // Fallback to polling if websockets unavailable
  withCredentials: true, // Needed if your backend auth relies on cookies
});

export default socket;
