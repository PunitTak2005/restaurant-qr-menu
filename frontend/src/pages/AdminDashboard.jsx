import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------
  // Fetch Orders on Mount
  // -----------------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");
        setOrders(res.data?.data || res.data?.orders || []);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err.message);
        setError("Failed to fetch orders. Please verify backend connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // -----------------------
  // Conditional Renders
  // -----------------------
  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  // -----------------------
  // Main Render
  // -----------------------
  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome Admin! Manage and monitor all restaurant orders here.</p>
      </header>

      <section className="orders-section">
        <h2>Orders Overview</h2>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Table</th>
                <th>Order Items</th>
                <th>Total (₹)</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, orderIndex) => (
                <tr key={order._id || `order-${orderIndex}`}>
                  {/* CUSTOMER */}
                  <td data-label="Customer">
                    {order.userId?.name || "Guest"}
                    <br />
                    <small>{order.userId?.email || "-"}</small>
                  </td>

                  {/* TABLE */}
                 <td data-label="Table">
  {order.tableId?.number ?? "—"}
</td>


                  {/* ITEMS */}
                  <td data-label="Order Items">
                    {order.items.map((it, i) => (
                      <div key={it._id || `${order._id}-item-${i}`}>
                        {it.menuItemId?.name || "(Unknown Item)"} × {it.qty}
                      </div>
                    ))}
                  </td>

                  {/* TOTAL */}
                  <td data-label="Total">
                    ₹{order.totalPrice?.toFixed(2) || "0.00"}
                  </td>

                  {/* STATUS */}
                  <td
                    data-label="Status"
                    className={`status ${order.status}`}
                  >
                    {order.status}
                  </td>

                  {/* TIME */}
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

export default AdminDashboard;
