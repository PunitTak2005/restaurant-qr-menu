import React from "react";
import './StatsCard.css'; // Optional, for custom card styling

const StatsCard = ({ label, value, currency }) => (
  <div className="stats-card">
    <span>{label}</span>
    <b>
      {currency ? `${currency}${value}` : value}
    </b>
  </div>
);

export default StatsCard;
