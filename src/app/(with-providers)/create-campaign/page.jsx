"use client";

import React, { Suspense } from "react";
import AppLayout from "@/app/AppLayout";
import CreateCampaignStepper from "@/components/UI/createCampaign/Stepper";

const CreateCampaign = () => {
  return (
    <Suspense fallback={<div>Loading campaign creator...</div>}>
      <AppLayout withFooter={true} withHeroSection={false}>
        <CreateCampaignStepper />
      </AppLayout>
    </Suspense>
  );
};

export default CreateCampaign;
