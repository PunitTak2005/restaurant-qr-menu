import React, { useEffect, useState } from "react";
import "./StaffOrders.css"; // optional styling file

export default function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [newOrderHighlight, setNewOrderHighlight] = useState(false);

  // Poll orders from API every 5 seconds
  useEffect(() => {
    let prevOrderIds = [];

    const pollOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);

          // New order highlight logic (compare order IDs)
          const currOrderIds = (data.orders || []).map((order) => order.id);
          if (
            currOrderIds.length > prevOrderIds.length &&
            currOrderIds.some((id) => !prevOrderIds.includes(id))
          ) {
            setNewOrderHighlight(true);

            // Optional: sound alert for new orders
            const audio = new Audio("/new-order.mp3");
            audio.play();

            setTimeout(() => setNewOrderHighlight(false), 2000);
          }
          prevOrderIds = currOrderIds;
        }
      } catch (err) {
        console.error("Polling error:", err.message);
      }
    };

    pollOrders(); // initial fetch
    const interval = setInterval(pollOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`staff-orders ${newOrderHighlight ? "highlight" : ""}`}>
      <header className="staff-header">
        <h1>Orders Dashboard</h1>
        <p>
          <span style={{ fontWeight: "bold" }}>Polling for new orders every 5s</span>
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
