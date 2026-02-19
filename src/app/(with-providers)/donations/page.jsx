"use client";

import DonationsUI from "@/components/UI/CampaignDonationStats";
import Private from "@/Layouts/Private";
import { useInjectCampaignManagementSlices } from "@/hooks/useInjectReducers";
import { Suspense } from "react";

const Donations = () => {
  // Inject campaign management slices (donations, donationTable)
  useInjectCampaignManagementSlices();

  return (
    <Suspense>
    <Private withSidebar={true} withFooter={true}>
      <DonationsUI />
    </Private>
    </Suspense>
  );
};

export default Donations;
