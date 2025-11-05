import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const BarChart = ({ data, title = "Bar Chart", color = "#36A2EB" }) => {
  // Validate data is a non-empty array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ width: '100%', maxWidth: 450 }}>
        <h4>{title}</h4>
        <p>No data available.</p>
      </div>
    );
  }

  // Example 'data' prop shape: [{ label: 'Jan', value: 12 }, ...]
  const chartData = {
    labels: data.map(d => d.label) || [],
    datasets: [
      {
        label: title,
        data: data.map(d => d.value) || [],
        backgroundColor: color,
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#1a237e',
        font: { weight: 'bold' },
      }
    },
    scales: {
      y: { beginAtZero: true },
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 450 }}>
      <h4>{title}</h4>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default BarChart;
