// src/pages/StaffOrders.jsx
import React, { useEffect, useState } from "react";

import "./StaffOrders.css"; // optional styling file

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [newOrderHighlight, setNewOrderHighlight] = useState(false);
  // Removed: const [isSocketConnected, setIsSocketConnected] = useState(false);

  // --- POLLING FOR ORDERS ---
  useEffect(() => {
    // Initial fetch
    const pollOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else {
          // Handle non-200 responses if necessary
          console.error(`Polling failed with status: ${res.status}`);
        }
      } catch (err) {
        console.error("Polling error:", err.message);
      }
    };

    pollOrders(); // Fetch immediately on mount

    // Poll every 5 seconds indefinitely
    const interval = setInterval(pollOrders, 5000);

    return () => clearInterval(interval);
    // Removed: dependency on isSocketConnected
  }, []); // Empty dependency array means it runs once on mount and cleans up on unmount

  // We can assume "Online" since polling is active, or remove the connection status completely.
  // I'll keep it simple and just remove the status display since it's now always "on."

  return (
    <div className={`staff-orders ${newOrderHighlight ? "highlight" : ""}`}>
      <header className="staff-header">
        <h1>Live Orders Dashboard</h1>
        {/* Removed Connection status display as there is no socket state */}
        <p>
          Data Refresh: <span style={{ fontWeight: "bold" }}>Every 5s</span>
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
