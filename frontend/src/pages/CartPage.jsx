import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/AuthContext";
import "./CartPage.css";

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

  // ===== Table Selection =====
  const [selectedTable, setSelectedTable] = useState("");

  // ===== Dummy Tables - Replace with DB data =====
  const tableOptions = [
    { _id: "68fb686699593b4004cebea7", number: 1 },
    { _id: "68fb686699593b4004cebea8", number: 2 },
    { _id: "68fb686699593b4004cebea9", number: 3 },
    { _id: "68fb686699593b4004cebeaa", number: 4 },
  ];

  // ==== CREATE & SUBMIT ORDER ====
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
        tableId: selectedTable,
        items: cartItems.map((it) => ({
          menuItemId: it._id,
          qty: it.quantity,
          note: it.note || "",
        })),
        totalPrice,
        status: "pending",
      };

      const res = await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.success) {
        clearCart();
        alert(`Order placed successfully! Table ${res.data.order.tableId?.number}`);
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

  // ==== GO BACK TO MENU ====
  const goToMenu = () => {
    navigate(`/m/${restaurantSlug || "default-restaurant"}`);
  };

  // ==== EMPTY CART VIEW ====
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

  // ==== MAIN CART VIEW ====
  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>

      <div className="cart-content">
        {/* ==== ORDER-STYLE TABLE ==== */}
        <section className="order-details">
          <h2>Your Cart Items</h2>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>₹{item.price * item.quantity}</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="order-meta">
            <span>
              <b>Total:</b> ₹{totalPrice ?? "-"}
            </span>
          </div>
        </section>

        {/* ==== SUMMARY & TABLE SELECTION ==== */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <p>Total Items: {cartItems.length}</p>
          <h3>Total Price: ₹{totalPrice}</h3>

          <div className="table-select-wrapper">
            <label htmlFor="tableSelect" className="table-select-label">
              Select Table:
            </label>
            <select
              id="tableSelect"
              className="table-select"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              required
            >
              <option value="">-- Choose Table --</option>
              {tableOptions.map((table) => (
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
