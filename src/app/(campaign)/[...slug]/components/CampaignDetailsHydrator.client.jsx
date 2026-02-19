"use client";

/**
 * CampaignDetailsHydrator - Client Component that hydrates campaign details into Redux
 *
 * This component receives mergedCampaignDetails from the server and dispatches it
 * to the Redux store once on mount, making it available to all downstream components
 * via useSelector instead of prop drilling.
 *
 * Placed early in the component tree so that CampaignRightSide, DonationPaymentWrapper,
 * MobileBottomBar, and all donation flow components can read from Redux directly.
 */

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateCampaignDetails } from "@/store/slices/donationSlice";
import { useInjectDonationSlices } from "@/hooks/useInjectReducers";

export default function CampaignDetailsHydrator({ campaignDetails }) {
  const isReady = useInjectDonationSlices();
  const dispatch = useDispatch();
  const hasHydrated = useRef(false);

  const existingCampaignDetails = useSelector(
    (state) => state.donation?.campaignDetails,
  );

  useEffect(() => {
    if (
      isReady &&
      campaignDetails &&
      !hasHydrated.current &&
      (!existingCampaignDetails || !existingCampaignDetails.title)
    ) {
      dispatch(updateCampaignDetails(campaignDetails));
      hasHydrated.current = true;
    }
  }, [isReady, campaignDetails, existingCampaignDetails, dispatch]);

  // This component renders nothing - it only hydrates Redux
  return null;
}
