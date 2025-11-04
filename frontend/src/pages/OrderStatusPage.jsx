import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./OrderStatusPage.css";

// --- Fetch order from backend API ---
const fetchOrderById = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) {
      let message;
      switch (res.status) {
        case 400:
          message = "Invalid Order ID format. Please verify your link.";
          break;
        case 404:
          message = "Order not found. Please check your tracking link.";
          break;
        default:
          message = "Unexpected server error. Please try again later.";
      }
      throw new Error(message);
    }
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      await res.text();
      throw new Error("Received unexpected response from server.");
    }
    const data = await res.json();
    if (!data || typeof data !== "object") {
      throw new Error("Malformed response from server.");
    }
    return data?.order || null;
  } catch (err) {
    if (err.name === "TypeError") {
      throw new Error("Unable to reach the server. Please check your connection.");
    }
    throw err;
  }
};

// -- Socket connection --
const socket = io("http://localhost:5000");

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

  // --- SOCKET.IO REAL-TIME CONNECTION ---
  useEffect(() => {
    socket.on("connect", () => setIsSocketConnected(true));
    socket.on("disconnect", () => setIsSocketConnected(false));
    socket.on("order-status", (data) => {
      if (String(data.orderId) === String(id)) {
        setStatus(data.status);
        if (data.order) setOrder(data.order);
      }
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("order-status");
    };
  }, [id]);

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
                    <tr key={item.menuItemId._id || idx}>
                      <td>{item.menuItemId.name}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.menuItemId.price * item.qty}</td>
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
