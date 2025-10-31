// src/pages/AllOrdersPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AllOrdersPage = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
        const data = await res.json();
        if (data.success) setOrders(data.orders);
        else setError(data.error || "Failed to load orders");
      } catch {
        setError("Could not fetch orders");
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
