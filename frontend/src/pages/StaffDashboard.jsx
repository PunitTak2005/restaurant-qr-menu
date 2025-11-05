import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StaffDashboard.css";

// ENVIRONMENT-AWARE API PREFIX
const API_PREFIX =
  import.meta.env.VITE_API_BASE_URL || "https://restaurant-qr-menu-stjp.onrender.com/api";

const STATUS_OPTIONS = [
  "pending",
  "preparing",
  "ready",
  "served",
  "paid",
  "cancelled",
];

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_PREFIX}/orders`);
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

  // Handle status change in dropdown
  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates({ ...statusUpdates, [orderId]: newStatus });
  };

  // Send status update to backend
  const updateOrderStatus = async (orderId) => {
    try {
      const newStatus = statusUpdates[orderId];
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_PREFIX}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update order status!");
      console.error(err);
    }
  };

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="staff-container">
      <header className="staff-header">
        <h1></h1>
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
                <th>Update Status</th>
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
                  <td data-label="Update Status">
                    <select
                      value={statusUpdates[order._id] || order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => updateOrderStatus(order._id)}
                      style={{
                        marginLeft: "8px",
                        padding: "5px 12px",
                        background: "#39a9db",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0.5em",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Update
                    </button>
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
