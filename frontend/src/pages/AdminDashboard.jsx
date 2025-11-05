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

// ----------- ENVIRONMENT-AWARE API PREFIX ------------
// Use Vite's env variable, fallback to Render
const API_PREFIX =
  import.meta.env.VITE_API_BASE_URL || "https://restaurant-qr-menu-stjp.onrender.com/api";
// ------------------------------------------------------

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

  // ... rest of your chart and UI code remains unchanged ...

  // (same JSX as before)
  // ...
};

export default AdminDashboard;
