"use client";

import React, { Suspense } from "react";
import CampaignsAgainstCategory from "@/components/UI/CampaignsAgainstCategory";
import AppLayout from "@/app/AppLayout";

const index = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <>
        <CampaignsAgainstCategory />
      </>
    </AppLayout>
    </Suspense>
  );
};

export default index;
