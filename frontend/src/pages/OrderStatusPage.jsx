// src/pages/OrderStatusPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./OrderStatusPage.css";

// ----------------------
// Fetch order from backend API with robust error handling
// ----------------------
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
      const text = await res.text();
      console.warn("⚠️ Non-JSON response detected:", text.slice(0, 100));
      throw new Error("Received unexpected response from server.");
    }

    const data = await res.json();
    if (!data || typeof data !== "object") {
      throw new Error("Malformed response from server.");
    }

    return data?.order || null;
  } catch (err) {
    if (err.name === "TypeError") {
      console.error("🌐 Network or CORS error:", err.message);
      throw new Error("Unable to reach the server. Please check your connection.");
    }
    console.error("❌ API fetch error:", err.message);
    throw err;
  }
};

// ----------------------
// Socket connection
// ----------------------
const socket = io("http://localhost:5000");

// Define human-readable order statuses
const statusMessages = {
  pending: "Your order is being processed",
  preparing: "Your order is being prepared",
  ready: "Order is ready for pickup/serving",
  served: "Order has been served",
};

// Define percentage progression
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
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- SOCKET.IO REAL-TIME CONNECTION ---
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Disconnected from Socket.IO server");
      setIsSocketConnected(false);
    });

    socket.on("order-status", (data) => {
      if (String(data.orderId) === String(id)) {
        setStatus(data.status);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("order-status");
    };
  }, [id]);

  // --- POLLING FALLBACK (used when socket is disconnected) ---
  useEffect(() => {
    const pollStatus = async () => {
      try {
        const order = await fetchOrderById(id);
        if (order?.status) {
          setStatus(order.status);
          setErrorMessage("");
        }
      } catch (err) {
        console.error("Polling error:", err.message);
        setErrorMessage(err.message);
      }
    };

    const interval = setInterval(() => {
      if (!isSocketConnected) pollStatus();
    }, 5000); // Poll every 5 seconds

    pollStatus(); // Also run once on mount

    return () => clearInterval(interval);
  }, [isSocketConnected, id]);

  const progressPercent = progressPercentages[status] || 10;

  return (
    <div className="order-status-container">
      {/* Header */}
      <header className="order-header">
        <h1>Order Status</h1>
        <p>Tracking your order #{id}</p>
      </header>

      {/* Status Tracker */}
      <main className="status-tracker">
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
          ) : (
            <>
              <div className="status-message">
                {statusMessages[status] || "Updating..."}
              </div>
              <div className="status-time">
                Estimated delivery: 30–45 minutes
              </div>

              {/* Progress Bar */}
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <p className="connection-status">
                <b>Connection:</b>{" "}
                <span style={{ color: isSocketConnected ? "green" : "red" }}>
                  {isSocketConnected ? "Online" : "Offline (Polling)"}
                </span>
              </p>

              <button className="back-btn" onClick={() => navigate("/")}>
                Back to Home
              </button>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="order-footer">
        <p>&copy; 2025 Digital Dine. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OrderStatusPage;
