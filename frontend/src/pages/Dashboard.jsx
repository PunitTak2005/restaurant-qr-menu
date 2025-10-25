import React from "react";
import DailyOrdersChart from "./DailyOrdersChart";
import TopItemsChart from "./TopItemsChart";
import StatsCard from "../components/StatsCard";

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
    <StatsCard />
    <DailyOrdersChart />
    <TopItemsChart />
  </div>
);
export default Dashboard;
