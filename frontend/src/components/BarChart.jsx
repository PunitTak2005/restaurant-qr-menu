import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
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
    labels: ["Today", "This Week", "This Month"],
    datasets: [
      {
        label: "Total Orders",
        data: [analytics.todayOrders, analytics.weekOrders, analytics.monthOrders],
        backgroundColor: "#2b87ff",
        datalabels: {
          display: false, // Hide blue labels completely
        }
      },
      {
        label: "Total Revenue",
        data: [analytics.todayRevenue, analytics.weekRevenue, analytics.monthRevenue],
        backgroundColor: "#44c77b",
        datalabels: {
          display: true,
          color: "#111",
          anchor: 'end',    // attach to bottom of bar
          align: 'start',   // draw label below the bar
          font: { weight: "bold", size: 18 },
          offset: 10,
        }
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }, // <--- Hides legend line above chart
      title: { display: true, text: "Order Volume & Revenue per Period" },
      datalabels: {
        clamp: true,
        formatter: function (value) {
          return value;
        }
      }
    },
    categoryPercentage: 0.6,
    barPercentage: 0.6,
    layout: { padding: { top: 32, bottom: 32 } }
  };

  if (loading) return <p>Loading chart...</p>;

  return (
    <div className="chart-box">
      <Bar data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
}

export default BarChart;
