// src/pages/StaffOrders.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./StaffOrders.css"; // optional styling file

const socket = io("http://localhost:5000");

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [newOrderHighlight, setNewOrderHighlight] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // --- SOCKET.IO REAL-TIME CONNECTION ---
  useEffect(() => {
    // Confirm socket connection state
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Disconnected from Socket.IO server");
      setIsSocketConnected(false);
    });

    // New order received
    socket.on("new-order", (data) => {
      setOrders((prev) => [data.order, ...prev]);
      setNewOrderHighlight(true);

      // Optional: sound alert for new orders
      const audio = new Audio("/new-order.mp3");
      audio.play();

      setTimeout(() => setNewOrderHighlight(false), 2000);
    });

    // Order status updated
    socket.on("order-status", (data) => {
      setOrders((orders) =>
        orders.map((order) =>
          order.id === data.orderId ? { ...order, status: data.status } : order
        )
      );
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new-order");
      socket.off("order-status");
    };
  }, []);

  // --- POLLING FALLBACK (if sockets fail) ---
  useEffect(() => {
    const pollOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Polling error:", err.message);
      }
    };

    // Poll every 5 seconds when socket disconnected
    const interval = setInterval(() => {
      if (!isSocketConnected) pollOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [isSocketConnected]);

  return (
    <div className={`staff-orders ${newOrderHighlight ? "highlight" : ""}`}>
      <header className="staff-header">
        <h1>Live Orders Dashboard</h1>
        <p>
          Connection:{" "}
          <span
            style={{
              color: isSocketConnected ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {isSocketConnected ? "Online" : "Offline"}
          </span>
        </p>
      </header>

      <main className="orders-list">
        {orders.length === 0 ? (
          <p>No active orders yet.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id} className={`order-item status-${order.status}`}>
                <h3>Order #{order.id}</h3>
                <p>Status: {order.status}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
