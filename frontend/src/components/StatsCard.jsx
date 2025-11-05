import React from "react";
import './StatsCard.css'; // Optional, for custom card styling

const StatsCard = ({ label, value, currency }) => {
  // Check if value is null, undefined, or empty string
  const displayValue = (value === null || value === undefined || value === '') 
    ? 'Not available' 
    : (currency ? `${currency}${value}` : value);

  return (
    <div className="stats-card">
      <span>{label}</span>
      <b>{displayValue}</b>
    </div>
  );
};

export default StatsCard;
