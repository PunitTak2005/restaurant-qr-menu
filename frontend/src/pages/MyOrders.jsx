import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/orders/my', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        // If your API response wraps orders in a .orders key, adjust here:
        setOrders(res.data.orders || res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="my-orders-container">
        <h2 className="my-orders-title">My Orders</h2>
        <ul className="orders-list">
          {orders.map(order => (
            <li key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">Order ID: {order._id}</div>
                <div className={`order-status ${order.status}`}>{order.status}</div>
              </div>
              <div className="order-meta">
                <span>
                  Table: {order.tableNumber ?? order.tableId?.number ?? "—"}
                </span>
                <span className="order-date">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <ul className="order-items-list">
                {order.items.map(item => (
                  <li key={item.menuItemId?._id ?? item._id ?? Math.random()} className="order-item">
                    {item.menuItemId ? (
                      <>
                        <span className="menu-item-name">{item.menuItemId.name}</span>
                        {" — "}<span className="qty">Qty: {item.qty}</span>
                      </>
                    ) : (
                      <span className="missing-item">Missing item data{item.qty ? ` — Qty: ${item.qty}` : ""}</span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyOrders;
