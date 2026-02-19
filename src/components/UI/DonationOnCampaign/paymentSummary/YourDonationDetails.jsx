/* eslint-disable indent */
"use client";

import React from "react";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { theme } from "@/config/customTheme";
import { useSelector } from "react-redux";
import { AUTOMATIC_DONATION_DAYS } from "@/config/constant";
import { formatNumberWithCommas } from "@/utils/helpers";

const YourDonationDetails = ({ donationValue }) => {
  const yourDonationData = useSelector(
    (state) => state.successDonation.yourDonationData
  );

  const getRecurringTypeLabel = () => {
    const recurringOption = AUTOMATIC_DONATION_DAYS.find(
      (option) => option.value === yourDonationData?.recurringType
    );

    if (!recurringOption) return "Recurring donation";

    // Return shortened versions for specific types
    switch (yourDonationData?.recurringType) {
      case "dailyLast10NightsRamadan":
        return "Last 10 nights of Ramadan";
      case "dailyFirst10DaysDhulHijjah":
        return "First 10 days of Dhul Hijjah";
      case "daily30DaysRamadan":
        return "30 days of Ramadan";
      case "everyFriday":
        return "Every Friday";
      case "monthly":
        return "Monthly";
      default:
        return "Recurring donation";
    }
  };

  // const getRecurringTypeLabel = () => {
  //   const recurringTypeItem = AUTOMATIC_DONATION_DAYS.find(
  //     (item) => item.value === yourDonationData?.recurringType
  //   );
  //   return recurringTypeItem
  //     ? recurringTypeItem.label
  //     : yourDonationData?.recurringType;
  // };

  const formatDate = (dateString, showDayOfWeek = false) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    if (showDayOfWeek) {
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
      return `${formattedDate} (${dayOfWeek})`;
    }

    return formattedDate;
  };

  return (
    <BoxComponent
      sx={{ my: 5, display: "flex", gap: "16px", flexDirection: "column" }}
    >
      <SubHeading>Details</SubHeading>

      <StackComponent
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
      // mt={2}
      >
        <TypographyComp
          sx={{
            fontWeight: 500,
            fontSize: "18px",
            color: theme.palette.primary.gray,
          }}
        >
          Frequency
        </TypographyComp>
        <TypographyComp
          sx={{ fontWeight: 400, fontSize: "16px", color: "#424243" }}
        >
          {getRecurringTypeLabel()}
        </TypographyComp>
      </StackComponent>
      {yourDonationData?.startDate && yourDonationData?.endDate && (
        <StackComponent
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
        // mt={2}
        >
          <TypographyComp
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              color: theme.palette.primary.gray,
            }}
          >
            Duration
          </TypographyComp>
          <TypographyComp
            sx={{ fontWeight: 400, fontSize: "16px", color: "#424243" }}
          >
            {yourDonationData?.startDate && yourDonationData?.endDate
              ? yourDonationData?.startDate === yourDonationData?.endDate
                ? formatDate(yourDonationData?.startDate)
                : `${formatDate(yourDonationData?.startDate)} - ${formatDate(
                  yourDonationData?.endDate
                )}`
              : "N/A"}
          </TypographyComp>
        </StackComponent>
      )}
      <StackComponent
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
      // mt={2}
      >
        <TypographyComp
          sx={{
            fontWeight: 500,
            fontSize: "18px",
            color: theme.palette.primary.gray,
          }}
        >
          {yourDonationData?.recurringType === "everyFriday"
            ? "Payment date"
            : "Next payment"}
        </TypographyComp>
        <TypographyComp
          sx={{ fontWeight: 400, fontSize: "16px", color: "#424243" }}
        >
          {(() => {
            // Check if start and end dates are the same and if it's today
            if (
              yourDonationData?.startDate &&
              yourDonationData?.endDate &&
              yourDonationData?.startDate === yourDonationData?.endDate
            ) {
              const today = new Date();
              const startDate = new Date(yourDonationData?.startDate);
              const isToday =
                today.getFullYear() === startDate.getFullYear() &&
                today.getMonth() === startDate.getMonth() &&
                today.getDate() === startDate.getDate();

              if (isToday) {
                return "N/A";
              }
            }

            // Default behavior for next payment
            return yourDonationData?.nextInvoice
              ? formatDate(yourDonationData?.nextInvoice, true)
              : "N/A";
          })()}
        </TypographyComp>
      </StackComponent>
      {yourDonationData?.totalPayments && (
        <StackComponent
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
        // mt={2}
        >
          <TypographyComp
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              color: theme.palette.primary.gray,
            }}
          >
            Number of payments
          </TypographyComp>
          <TypographyComp
            sx={{ fontWeight: 400, fontSize: "16px", color: "#424243" }}
          >
            {yourDonationData?.totalPayments
              ? yourDonationData?.totalPayments
              : "N/A"}
          </TypographyComp>
        </StackComponent>
      )}
      {yourDonationData?.totalAmount && yourDonationData?.totalPayments && (
        <StackComponent
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
        // mt={2}
        >
          <TypographyComp
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              color: theme.palette.primary.gray,
            }}
          >
            Total amount of payments
          </TypographyComp>
          <TypographyComp
            sx={{ fontWeight: 400, fontSize: "16px", color: "#424243" }}
          >
            {yourDonationData?.totalAmount && yourDonationData?.totalPayments
              ? `${donationValue?.units || donationValue?.currency || yourDonationData?.units} ${donationValue?.symbol || yourDonationData?.symbol
              }${formatNumberWithCommas(
                (
                  yourDonationData?.totalAmount *
                  yourDonationData?.totalPayments
                ).toFixed(2)
              )}`
              : "N/A"}
          </TypographyComp>
        </StackComponent>
      )}
    </BoxComponent>
  );
};

YourDonationDetails.displayName = "YourDonationDetails";
export default YourDonationDetails;
