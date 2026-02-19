"use client";

import AppLayout from "@/app/AppLayout";
import DonationDetailsUI from "@/components/UI/DonationsYouHaveMade/donationDetails/DonationDetails";
import { Suspense } from "react";

const Details = () => {
  return (
    <Suspense>
    <AppLayout withFooter={true} withHeroSection={false}>
      <DonationDetailsUI />
    </AppLayout>
    </Suspense>
  );
};

export default Details;
