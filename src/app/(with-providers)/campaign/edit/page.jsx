"use client";

import MemoizedCampaignDetails from "@/components/UI/CampaignDetail/CampaignDetail";
import Private from "@/Layouts/Private";
import { Suspense } from "react";

const CampaignEdit = () => {
  return (
    <Suspense>
    <Private withFooter={true} withSidebar={true}>
      <MemoizedCampaignDetails />
    </Private>
    </Suspense>
  );
};

export default CampaignEdit;
