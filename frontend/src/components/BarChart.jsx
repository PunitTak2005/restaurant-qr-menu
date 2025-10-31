// src/components/BarChart.jsx
import React, { useEffect, useState } from "react";
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

function BarChart() {
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
        const res = await fetch(`${API_PREFIX}/admin/analytics`);
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        // Optional: handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const data = {
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

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Orders & Revenue (from Database)" },
    },
  };

  if (loading) return <p>Loading chart...</p>;

  return <Bar data={data} options={options} />;
}

export default BarChart;
