import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const pieColors = [
  "#4cc472", "#36A2EB", "#FF6384", "#FFCE56", "#a065ec",
  "#10a18a", "#2b87ff", "#ff9c23", "#512da8", "#c51162"
];

const TopItemsChart = ({ topItems }) => {
  const pieData = {
    labels: topItems?.map(i => i.name) || [],
    datasets: [{
      data: topItems?.map(i => i.qty) || [],
      backgroundColor: pieColors,
      borderWidth: 1,
    }]
  };
  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <h4>Top 5 Menu Items</h4>
      {pieData.labels.length > 0 ? (
        <Pie data={pieData} options={{ plugins: { legend: { display: true }}}} />
      ) : (
        <div className="chart-empty">No top item data</div>
      )}
    </div>
  );
};

export default TopItemsChart;
