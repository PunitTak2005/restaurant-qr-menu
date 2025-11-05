import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, title = "Pie Chart", colors }) => {
  // Example 'data' prop shape: [{ label: 'Pizza', value: 50 }, ...]
  const pieColors = colors || [
    "#4cc472", "#36A2EB", "#FF6384", "#FFCE56", "#a065ec",
    "#10a18a", "#2b87ff", "#ff9c23", "#512da8", "#c51162"
  ];

  // Validate data is a non-empty array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{width: '100%', maxWidth: 400}}>
        <h4>{title}</h4>
        <div className="chart-empty">No data available.</div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      data: data.map(d => d.value),
      backgroundColor: pieColors,
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    plugins: {
      legend: { display: true },
    },
  };

  return (
    <div style={{width: '100%', maxWidth: 400}}>
      <h4>{title}</h4>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default PieChart;
