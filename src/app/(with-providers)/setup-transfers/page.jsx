"use client";

import AppLayout from "@/app/AppLayout";
import SetupTransfersUI from "@/components/UI/SetupTransfers/BankDetailsStepper";
import { Suspense } from "react";

const SetupTransfers = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <SetupTransfersUI />
    </AppLayout>
    </Suspense>
  );
};

export default SetupTransfers;
