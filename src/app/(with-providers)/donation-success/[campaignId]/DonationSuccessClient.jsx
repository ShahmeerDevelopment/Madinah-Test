"use client";

import React, { Suspense } from "react";
import nextDynamic from "next/dynamic";
import AppLayout from "@/app/AppLayout";

// Lazy load the SuccessDonation component - only in client component
const SuccessDonation = nextDynamic(
  () =>
    import("@/components/UI/DonationOnCampaign/successDonation/SuccessDonation"),
  {
    loading: () => <div>Loading donation success page...</div>,
    ssr: false, // Success page is post-transaction, no need for SSR
  },
);

const DonationSuccessClient = () => {
  return (
    <Suspense fallback={<div>Loading donation success page...</div>}>
      <AppLayout withFooter={true} withHeroSection={false}>
        <div>
          <SuccessDonation />
        </div>
      </AppLayout>
    </Suspense>
  );
};

export default DonationSuccessClient;
