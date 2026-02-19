import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load the campaign stepper component
const CreateCampaignStepper = dynamic(
  () => import("@/components/UI/createCampaign/Stepper"),
  {
    loading: () => <div>Loading campaign creator...</div>,
    ssr: false, // Campaign creator is user-specific, no need for SSR
  }
);

const CreateCampaign = () => {
  return (
    <Suspense fallback={<div>Loading campaign creator...</div>}>
      <CreateCampaignStepper />
    </Suspense>
  );
};

export default CreateCampaign;
