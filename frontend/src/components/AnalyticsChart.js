import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const AnalyticsChart = ({ tableUsage }) => {
  const barData = {
    labels: tableUsage?.map(t => "Table " + t.number) || [],
    datasets: [
      {
        label: "Orders per Table",
        data: tableUsage?.map(t => t.usage) || [],
        backgroundColor: "#36A2EB",
      }
    ]
  };
  const barOptions = {
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
      <h4>Table Usage Analytics</h4>
      {barData.labels.length > 0 ? (
        <Bar data={barData} options={barOptions} />
      ) : (
        <div className="chart-empty">No table usage data</div>
      )}
    </div>
  );
};

export default AnalyticsChart;
