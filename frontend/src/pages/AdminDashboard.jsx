import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Pie } from "react-chartjs-2";

// Register plugin and chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const API_PREFIX = "http://localhost:5000/api";
const pieColors = [
  "#4cc472", "#36A2EB", "#FF6384", "#FFCE56", "#a065ec",
  "#10a18a", "#2b87ff", "#ff9c23", "#512da8", "#c51162"
];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({
    todayOrders: 0,
    weekOrders: 0,
    monthOrders: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    topItems: [],
    tableUsage: [],
  });
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState("");
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_PREFIX}/orders`);
        setOrders(res.data?.orders || []);
      } catch (err) {
        setError("Failed to fetch orders. Please verify backend connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_PREFIX}/admin/analytics`);
        setAnalytics(res.data);
        setAnalyticsError("");
      } catch (err) {
        setAnalyticsError(
          err?.response
            ? `Analytics error: ${err.response.status} ${err.response.statusText}`
            : "Failed to fetch analytics. Backend may be down."
        );
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const barOrdersData = {
    labels: ["Today", "This Week", "This Month"],
    datasets: [
      {
        label: "Total Orders",
        data: [analytics.todayOrders, analytics.weekOrders, analytics.monthOrders],
        backgroundColor: "#2b87ff",
        borderRadius: 8,
        maxBarThickness: 42,
      },
      {
        label: "Total Revenue",
        data: [analytics.todayRevenue, analytics.weekRevenue, analytics.monthRevenue],
        backgroundColor: "#44c77b",
        borderRadius: 8,
        maxBarThickness: 42,
      },
    ],
  };

  const pieTopItemsData = {
    labels: analytics.topItems.map((item) => item.name),
    datasets: [
      {
        label: "Top Ordered Items",
        data: analytics.topItems.map((item) => item.orderCount),
        backgroundColor: analytics.topItems.map((_, idx) => pieColors[idx % pieColors.length]),
        borderWidth: 1,
        borderColor: "#fafbfc",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Order Volume & Revenue per Period" },
      datalabels: {
        color: "#212529",
        anchor: "end",
        align: "top",
        font: { weight: "bold", size: 16 },
        formatter: (value) => value,
      },
    },
    scales: { y: { beginAtZero: true, grid: { color: "#e0e7ef" } }, x: { grid: { color: "#e0e7ef" } } },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right", labels: { boxWidth: 20 } },
      title: { display: true, text: "Top Ordered Items" },
      datalabels: {
        color: "#212529",
        font: { weight: "bold", size: 15 },
        formatter: (value) => value,
      },
    },
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p style={{ fontSize: "1.1rem" }}>
          {"Monitor live sales, revenue, and order trends for your restaurant."}
        </p>
      </header>

      {/* Analytics Metrics */}
      <section className="analytics-section" aria-label="Analytics Overview">
        <h2 className="section-header">Analytics Overview</h2>
        {analyticsLoading ? (
          <p className="loading">Loading analytics...</p>
        ) : analyticsError ? (
          <p className="error">{analyticsError}</p>
        ) : (
          <div className="metrics-group" style={{ marginBottom: 28 }}>
            <div className="metric-card accent-border">
              <span className="metric-icon" role="img" aria-label="orders">📦</span>
              <h4>Orders</h4>
              <ul>
                <li>Today: <b>{analytics.todayOrders}</b></li>
                <li>This week: <b>{analytics.weekOrders}</b></li>
                <li>This month: <b>{analytics.monthOrders}</b></li>
              </ul>
            </div>
            <div className="metric-card accent-border">
              <span className="metric-icon" role="img" aria-label="revenue">💰</span>
              <h4>Revenue</h4>
              <ul>
                <li>Today: ₹<b>{analytics.todayRevenue?.toFixed(2)}</b></li>
                <li>This week: ₹<b>{analytics.weekRevenue?.toFixed(2)}</b></li>
                <li>This month: ₹<b>{analytics.monthRevenue?.toFixed(2)}</b></li>
              </ul>
            </div>
            <div className="metric-card accent-border">
              <span className="metric-icon" role="img" aria-label="top items">🍽️</span>
              <h4>Top Items</h4>
              <ul>
                {analytics.topItems.map((item, i) => (
                  <li key={item._id || i}>
                    {item.name} <span style={{ color: "#2b87ff", fontWeight: 500 }}>({item.orderCount})</span>
                  </li>
                ))}
                {(!analytics.topItems || analytics.topItems.length === 0) && <li>No data</li>}
              </ul>
            </div>
            <div className="metric-card accent-border">
              <span className="metric-icon" role="img" aria-label="tables">🪑</span>
              <h4>Top Tables</h4>
              <ul>
                {analytics.tableUsage.map((tbl, i) => (
                  <li key={tbl.tableId || i}>
                    Table <b>{tbl.tableNumber}</b>: <span style={{ color: "#44c77b", fontWeight: 500 }}>{tbl.usageCount} orders</span>
                  </li>
                ))}
                {(!analytics.tableUsage || analytics.tableUsage.length === 0) && <li>No data</li>}
              </ul>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="charts-group">
          <div className="chart-box" style={{ minHeight: 310 }}>
            <Bar
              data={barOrdersData}
              options={barChartOptions}
            />
          </div>
          <div className="chart-box" style={{ minHeight: 310 }}>
            <Pie
              data={pieTopItemsData}
              options={pieChartOptions}
            />
          </div>
        </div>
      </section>

      {/* Orders Table Overview */}
      <section className="orders-section" aria-label="Orders Overview">
        <h2 className="section-header">Recent Orders</h2>
        {loading ? (
          <p className="loading">Loading orders...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                    <td data-label="Customer">
                      {order.userId?.name || "Guest"}<br />
                      <small style={{ color: "#517599" }}>{order.userId?.email || "-"}</small>
                    </td>
                    <td data-label="Table">
                      {order.tableId?.number ?? "—"}
                    </td>
                    <td data-label="Order Items">
                      {order.items.map((it, i) => (
                        <div key={it._id || `${order._id}-item-${i}`}>
                          {it.menuItemId?.name || "(Unknown Item)"} × {it.qty}
                        </div>
                      ))}
                    </td>
                    <td data-label="Total">
                      ₹{order.totalPrice?.toFixed(2) || "0.00"}
                    </td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
