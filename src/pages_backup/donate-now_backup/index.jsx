import React from "react";
// import Payment from "@/components/UI/DonationOnCampaign/Payment";
import NewPayment from "@/components/UI/DonationOnCampaign/NewPayment";
import { getCookie } from "cookies-next";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { useInjectDonationSlices } from "@/hooks/useInjectReducers";

const DonateNow = () => {
  // Inject donation flow slices on mount
  const isDonationReady = useInjectDonationSlices();

  const { isSmallScreen } = useResponsiveScreen();
  const experimentalFeature = getCookie("abtesting");
  if (experimentalFeature === "donation_version_1" && isSmallScreen) {
    return <NewPayment />;
  }
  return <NewPayment />;
};

export default DonateNow;
