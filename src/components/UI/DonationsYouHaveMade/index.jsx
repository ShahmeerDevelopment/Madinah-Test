"use client";

import React, { useEffect, useState } from "react";
import YourDonationLayout from "@/Layouts/YourDonationLayout/YourDonationLayout";
import DonationTabs from "./DonationTabs";
import { getAllVisits, useGetRecurringTableList } from "@/api/get-api-services";
import { useSelector } from "react-redux";

const DonationsYouHaveMadeUI = () => {
  const [offSet, setOffSet] = useState(0);
  const [sortBy, setSortBy] = useState("donation-date-desc");
  const [perPageLimit, setPerPageLimit] = useState(5);
  const utmParameters = useSelector((state) => state.utmParameters);

  const adjustedOffset =
    offSet === 1 || offSet === 0 ? 0 : (offSet - 1) * perPageLimit;

  const {
    data: recurringList,
    isLoading,
    isError,
    error,
  } = useGetRecurringTableList(
    { limit: perPageLimit, offset: adjustedOffset },
    sortBy,
  );
  let receiptsTableData = recurringList?.data.data;

  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral,
    );
  }, []);

  return (
    <YourDonationLayout>
      <DonationTabs
        error={error}
        isError={isError}
        data={receiptsTableData}
        isLoading={isLoading}
        setSortBy={setSortBy}
        setOffSet={setOffSet}
        setPerPageLimit={setPerPageLimit}
      />
    </YourDonationLayout>
  );
};

export default DonationsYouHaveMadeUI;
