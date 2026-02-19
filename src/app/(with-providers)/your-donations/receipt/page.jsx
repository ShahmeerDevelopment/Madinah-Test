"use client";

import AppLayout from "@/app/AppLayout";
import ReceiptsUI from "@/components/UI/DonationsYouHaveMade/Receipts";
import { Suspense } from "react";

const Receipts = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <ReceiptsUI />
    </AppLayout>
    </Suspense>
  );
};

export default Receipts;
