"use client";

import React, { Suspense, useEffect } from "react";
// import Payment from "@/components/UI/DonationOnCampaign/Payment";
import NewPayment from "@/components/UI/DonationOnCampaign/NewPayment";
import { useInjectDonationSlices } from "@/hooks/useInjectReducers";
import AppLayout from "@/app/AppLayout";
import { loadPaymentScripts } from "@/utils/loadPaymentScripts";

const DonateNow = () => {
  // Inject donation flow slices on mount
  const isDonationReady = useInjectDonationSlices();

  // Load payment scripts when donate-now page mounts
  useEffect(() => {
    loadPaymentScripts().catch((error) => {
      console.error("Failed to load payment scripts:", error);
    });
  }, []);

  return (
    <Suspense>
      <AppLayout withFooter={true} withHeroSection={false}>
        <NewPayment />
      </AppLayout>
    </Suspense>
  );
};

export default DonateNow;
