/* eslint-disable react-hooks/rules-of-hooks */

import React from "react";

import Private from "@/Layouts/Private";
import DashboardUI from "@/components/UI/Dashboard";

const Dashboard = () => {
  return <DashboardUI />;
};

Dashboard.Layout = Private;

export default Dashboard;
