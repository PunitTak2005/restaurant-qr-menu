// src/pages/AllOrdersPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch"; // ← import your fetch utility

const AllOrdersPage = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiFetch(`/orders/user/${userId}`, {
          method: "GET",
        });
        if (data.success) setOrders(data.orders);
        else setError(data.error || "Failed to load orders");
      } catch (err) {
        setError(err.message || "Could not fetch orders");
      }
    };
    fetchOrders();
  }, [userId]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!orders.length) return <div>No orders found for this user.</div>;

  return (
    <div>
      <h1>All Orders for User {userId}</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            Order #{order._id} — Status: <b>{order.status}</b> — Total: ₹{order.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllOrdersPage;
