"use client";

import AppLayout from "@/app/AppLayout";
import SuccessCampaign from "@/components/UI/createCampaign/SuccessCampaign";
import React, { Suspense } from "react";

const index = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <div>
        <SuccessCampaign />
      </div>
    </AppLayout>
    </Suspense>
  );
};

export default index;
