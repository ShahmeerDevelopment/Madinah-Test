"use client";

import React, { Suspense } from "react";

import Private from "@/Layouts/Private";
import DashboardUI from "@/components/UI/Dashboard";

const Dashboard = () => {
  return (
    <Suspense>
    <Private withSidebar={true} withFooter={true}>
      <DashboardUI />
    </Private>
    </Suspense>
  );
};

export default Dashboard;
