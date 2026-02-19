"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllVisits } from "@/api/get-api-services";

/**
 * DiscoverInit - Client component for discover page initialization
 * Handles UTM tracking and other initialization that requires Redux context
 */
export default function DiscoverInit() {
  const utmParameters = useSelector((state) => state.utmParameters);

  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral
    );
  }, [
    utmParameters.utmSource,
    utmParameters.utmMedium,
    utmParameters.utmCampaign,
    utmParameters.utmTerm,
    utmParameters.utmContent,
    utmParameters.referral,
  ]);

  return null;
}
