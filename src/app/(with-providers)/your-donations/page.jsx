"use client";

import AppLayout from "@/app/AppLayout";
import DonationsYouHaveMadeUI from "@/components/UI/DonationsYouHaveMade";
import { Suspense } from "react";

const YourDonations = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <DonationsYouHaveMadeUI />
    </AppLayout>
    </Suspense>
  );
};

export default YourDonations;
