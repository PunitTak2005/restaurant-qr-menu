import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch"; // <- Import

import "./OrderStatusPage.css";

// --- Fetch order from backend API ---
const fetchOrderById = async (id) => {
  try {
    // Uses environment variable or Render as fallback
    const data = await apiFetch(`/orders/${id}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });

    if (!data || typeof data !== "object" || !data.order) {
      throw new Error("Order not found or malformed response.");
    }
    return data.order;
  } catch (err) {
    if (err.name === "TypeError") {
      throw new Error("Unable to reach the server. Please check your connection.");
    }
    throw err;
  }
};

// Human-readable order statuses
const statusMessages = {
  pending: "Your order is being processed",
  preparing: "Your order is being prepared",
  ready: "Order is ready for pickup/serving",
  served: "Order has been served",
};

// Progress percentages
const progressPercentages = {
  pending: 20,
  preparing: 50,
  ready: 90,
  served: 100,
};

const OrderStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("pending");
  const [order, setOrder] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- INITIAL FETCH and POLLING ---
  useEffect(() => {
    const pollOrder = async () => {
      try {
        const result = await fetchOrderById(id);
        if (result) {
          setOrder(result);
          if (result.status) setStatus(result.status);
          setErrorMessage("");
        } else {
          setOrder(null);
          setErrorMessage("");
        }
      } catch (err) {
        setErrorMessage(err.message);
        setOrder(null);
      }
    };
    pollOrder();
    const interval = setInterval(() => {
      if (!isSocketConnected) pollOrder();
    }, 5000);
    return () => clearInterval(interval);
  }, [isSocketConnected, id]);

  const progressPercent = progressPercentages[status] || 10;

  return (
    <div className="order-status-container">
      <main className="status-tracker">
        <header className="order-header">
          <h1>Order Status</h1>
          <p>Tracking your order #{id}</p>
        </header>
        <div className="status-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2910/2910761.png"
            alt="Order Processing"
            className="status-icon"
          />

          {errorMessage ? (
            <div className="status-error">
              <p style={{ color: "red" }}>{errorMessage}</p>
              <button className="back-btn" onClick={() => navigate("/")}>
                Go Back
              </button>
            </div>
          ) : !order ? (
            <div className="status-error">
              <p style={{ color: "orange", fontWeight: 600 }}>Order not placed.</p>
              <button className="back-btn" onClick={() => navigate("/")}>
                Go Back
              </button>
            </div>
          ) : (
            <>
              <div className="status-message">
                {statusMessages[status] || "Updating..."}
              </div>
              <div className="status-time">
                Estimated delivery: 10-15 minutes
              </div>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <button className="back-btn" onClick={() => navigate("/")}>
                Back to Home
              </button>
            </>
          )}
        </div>

        {/* --- ORDER DETAILS SECTION --- */}
        {order && (
          <section className="order-details">
            <h2>Your Order</h2>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <tr key={item.menuItemId?._id || idx}>
                      <td>{item.menuItemId?.name || "Unknown Item"}</td>
                      <td>{item.qty}</td>
                      <td>₹{(item.menuItemId?.price || 0) * item.qty}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", color: "#888" }}>
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="order-meta">
              {order.tableId?.number && (
                <span>
                  <b>Table:</b> {order.tableId.number}
                </span>
              )}
              <span>
                <b>Total:</b> ₹{order.totalPrice ?? "-"}
              </span>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default OrderStatusPage;
