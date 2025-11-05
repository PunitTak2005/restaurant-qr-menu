import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/AuthContext";
import "./CartPage.css";

// ----------- ENVIRONMENT-AWARE API PREFIX -----------
// For Vite, use VITE_API_BASE_URL; fallback to Render
const API_PREFIX =
  import.meta.env.VITE_API_BASE_URL || "https://restaurant-qr-menu-stjp.onrender.com/api";
// -----------------------------------------------------

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    totalPrice,
    updateQuantity,
    restaurantSlug,
  } = useCart();

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // ===== Tables from DB =====
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);

  // Load tables from API
  useEffect(() => {
    async function fetchTables() {
      try {
        const res = await axios.get(`${API_PREFIX}/tables`);
        if (res.data.success && Array.isArray(res.data.tables)) {
          setTables(res.data.tables);
        } else {
          setTables([]); // fallback to empty list
        }
      } catch (e) {
        setTables([]); // fallback to empty list on error
      }
    }
    fetchTables();
  }, []);

  // Table select handler
  const handleTableSelect = (tableId) => {
    setSelectedTableId(tableId);
    const t = tables.find((tbl) => tbl._id === tableId);
    setSelectedTable(t || null);
  };

  const handlePlaceOrder = async () => {
    try {
      if (!isAuthenticated || !user?._id) {
        alert("You must log in to place an order.");
        navigate("/signin");
        return;
      }
      if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      if (!selectedTable) {
        alert("Please select a table number before ordering.");
        return;
      }
      const orderData = {
        userId: user._id,
        tableId: selectedTable._id,
        tableNumber: selectedTable.number,
        items: cartItems.map((it) => ({
          menuItemId: it._id,
          qty: it.quantity,
          note: it.note || "",
        })),
        totalPrice,
        status: "pending",
      };

      const res = await axios.post(`${API_PREFIX}/orders`, orderData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.success) {
        clearCart();
        alert(`Order placed successfully! Table ${selectedTable.number}`);
        navigate(`/order/${res.data.order._id}`, { replace: true });
      } else {
        alert(res.data?.error || "Order creation failed.");
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Server error placing order.";
      alert(message);
    }
  };

  const goToMenu = () => {
    navigate(`/m/${restaurantSlug || "default-restaurant"}`);
  };

  const handleIncreaseQty = (itemId, currentQty) => {
    updateQuantity(itemId, currentQty + 1);
  };

  const handleDecreaseQty = (itemId, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(itemId, currentQty - 1);
    } else {
      alert("Quantity cannot be less than 1. Use Clear Cart to remove items.");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>🛒 Your Cart is Empty</h2>
          <p>
            Looks like you haven’t added anything yet. Browse our menu to add your favorites!
          </p>
          <button className="browse-btn" onClick={goToMenu}>
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      <div className="cart-content">
        <section className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ==== SUMMARY & TABLE SELECTION ==== */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <p>Total Items: {cartItems.length}</p>
          <h3>Total Price: ₹{totalPrice}</h3>

          {/* Item details in summary with quantity controls */}
          <div className="summary-items-details">
            {cartItems.map((item) => (
              <div key={`summary-${item._id}`} className="summary-item">
                <span>{item.name}</span>{" "}
                <button onClick={() => handleDecreaseQty(item._id, item.quantity)}>-</button>{" "}
                <span>Qty: {item.quantity}</span>{" "}
                <button onClick={() => handleIncreaseQty(item._id, item.quantity)}>+</button>{" "}
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="table-select-wrapper">
            <label htmlFor="tableSelect" className="table-select-label">
              Select Table:
            </label>
            <select
              id="tableSelect"
              className="table-select"
              value={selectedTableId}
              onChange={(e) => handleTableSelect(e.target.value)}
              required
            >
              <option value="">-- Choose Table --</option>
              {tables.map((table) => (
                <option key={table._id} value={table._id}>
                  Table {table.number}
                </option>
              ))}
            </select>
          </div>
          <div className="cart-actions">
            <button className="browse-btn" onClick={goToMenu}>
              Add More Items
            </button>
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
            <button className="order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
