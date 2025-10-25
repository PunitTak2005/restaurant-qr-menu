// src/pages/StaffDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StaffDashboard.css";

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");
        setOrders(res.data?.data || res.data?.orders || []);
      } catch (err) {
        console.error("❌ Error loading orders:", err.message);
        setError("Failed to fetch orders. Please verify backend connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="staff-container">
      <header className="staff-header">
        <h1>Staff Dashboard</h1>
        <p>
          Welcome Staff! Review and manage table orders assigned to your team.
        </p>
      </header>

      <section className="orders-section">
        <h2>Orders Overview</h2>

        {orders.length === 0 ? (
          <p>No active orders found.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Table</th>
                <th>Order Items</th>
                <th>Total (₹)</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td data-label="Customer">
                    {order.userId?.name || "Guest"}
                    <br />
                    <small>{order.userId?.email || "—"}</small>
                  </td>
                  <td data-label="Table">
                    {order.tableId?.number ?? "—"}
                  </td>
                  <td data-label="Items">
                    {order.items.map((it) => (
                      <div key={it._id}>
                        {it.menuItemId?.name || "(Unknown Item)"} × {it.qty}
                      </div>
                    ))}
                  </td>
                  <td data-label="Total">₹{order.totalPrice}</td>
                  <td
                    data-label="Status"
                    className={`status ${order.status}`}
                  >
                    {order.status}
                  </td>
                  <td data-label="Time">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default StaffDashboard;
