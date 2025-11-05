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

// IMPORTANT: Set API base URL to fetch data from MongoDB Atlas via deployed backend
// In production (Render), set VITE_API_BASE_URL env variable to your backend URL
// This ensures the frontend fetches analytics and orders from the Atlas-connected backend
// Default fallback points to the deployed Render backend with MongoDB Atlas connection
const API_PREFIX =
  import.meta.env.VITE_API_BASE_URL || "https://restaurant-qr-menu-stjp.onrender.com/api";

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
    // Fetch orders from Atlas-connected backend
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_PREFIX}/orders`);
        console.log('Orders API Response:', res.data);
        setOrders(res.data?.orders || []);
        setError("");
      } catch (err) {
        console.log('Orders API Error:', err);
        setError("Failed to fetch orders. Please verify backend connection & CORS settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    // Fetch analytics from Atlas-connected backend
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_PREFIX}/admin/analytics`);
        console.log('Analytics API Response:', res.data);
        setAnalytics(res.data || {});
        setAnalyticsError("");
      } catch (err) {
        console.log('Analytics API Error:', err);
        setAnalyticsError(
          err?.response
            ? `Analytics error: ${err.response.status} ${err.response.statusText} - check backend logs.`
            : "Failed to fetch analytics. Backend or API may be down, or CORS misconfigured."
        );
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Chart Data: Top Items Pie
  const pieData = {
    labels: analytics.topItems?.map(i => i.name) || [],
    datasets: [{
      data: analytics.topItems?.map(i => i.qty) || [],
      backgroundColor: pieColors,
      borderWidth: 1,
    }]
  };

  // Chart Data: Table Usage Bar
  const barData = {
    labels: analytics.tableUsage?.map(t => "Table " + t.number) || [],
    datasets: [{
      label: "Orders per Table",
      data: analytics.tableUsage?.map(t => t.usage) || [],
      backgroundColor: "#36A2EB"
    }]
  };

  // Chart options
  const pieOptions = {
    plugins: {
      legend: { display: true },
      datalabels: {
        color: '#333',
        formatter: (value, context) => value,
      }
    }
  };

  const barOptions = {
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#1a237e',
        font: { weight: 'bold' }
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>
          Monitor orders, revenue & table usage.
        </p>
      </header>
      {(loading || analyticsLoading) && (
        <div className="loading-indicator">
          Loading data...
        </div>
      )}
      {error && <div className="error-msg">{error}</div>}
      {analyticsError && <div className="error-msg analytics">{analyticsError}</div>}
      {!loading && !analyticsLoading && (
        <section className="dashboard-grid">
          <div className="stats-cards">
            <div className="stats-card">
              <span>Today Orders</span>
              <b>{analytics.todayOrders}</b>
            </div>
            <div className="stats-card">
              <span>Week Orders</span>
              <b>{analytics.weekOrders}</b>
            </div>
            <div className="stats-card">
              <span>Month Orders</span>
              <b>{analytics.monthOrders}</b>
            </div>
            <div className="stats-card">
              <span>Today Revenue</span>
              <b>₹{analytics.todayRevenue}</b>
            </div>
            <div className="stats-card">
              <span>Week Revenue</span>
              <b>₹{analytics.weekRevenue}</b>
            </div>
            <div className="stats-card">
              <span>Month Revenue</span>
              <b>₹{analytics.monthRevenue}</b>
            </div>
          </div>
          <div className="charts-section">
            <div className="chart-card">
              <h3>Top Items</h3>
              {pieData.labels.length > 0 ? (
                <Pie data={pieData} options={pieOptions} />
              ) : (
                <div className="chart-empty">No top item data</div>
              )}
            </div>
            <div className="chart-card">
              <h3>Table Usage</h3>
              {barData.labels.length > 0 ? (
                <Bar data={barData} options={barOptions} />
              ) : (
                <div className="chart-empty">No table usage data</div>
              )}
            </div>
          </div>
        </section>
      )}
      {/* Optional: add a recent orders table below for admin */}
    </div>
  );
};

export default AdminDashboard;
