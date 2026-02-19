"use client";

import Private from "@/Layouts/Private";
import SummaryUI from "@/components/UI/Summary";
import { Suspense } from "react";

const Summary = () => {
  return (
    <Suspense>
    <Private withFooter={true} withSidebar={true}>
      <SummaryUI />
    </Private>
    </Suspense>
  );
};

export default Summary;
