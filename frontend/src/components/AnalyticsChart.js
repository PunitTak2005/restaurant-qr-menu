// src/components/AnalyticsChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components needed
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_PREFIX = "http://localhost:5000/api";

export default function AnalyticsChart() {
  const [analytics, setAnalytics] = useState({
    todayOrders: 0,
    weekOrders: 0,
    monthOrders: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${API_PREFIX}/admin/analytics`);
        setAnalytics(res.data);
      } catch (err) {
        // Optionally handle errors here
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const barData = {
    labels: ["Today", "Week", "Month"],
    datasets: [
      {
        label: "Total Orders",
        data: [analytics.todayOrders, analytics.weekOrders, analytics.monthOrders],
        backgroundColor: "#2b87ff",
      },
      {
        label: "Total Revenue",
        data: [analytics.todayRevenue, analytics.weekRevenue, analytics.monthRevenue],
        backgroundColor: "#44c77b",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Orders & Revenue (from Database)" },
    },
  };

  if (loading) return <p>Loading chart...</p>;

  return <Bar data={barData} options={barOptions} />;
}
