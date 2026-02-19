"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { ASSET_PATHS } from "@/utils/assets";
const donation = ASSET_PATHS.svg.donation;
const averageDonation = ASSET_PATHS.svg.average;
// import { formatDate } from "@/utils/helpers";
import GridComp from "@/components/atoms/GridComp/GridComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CalenderButton from "@/components/molecules/calenderButton/CalenderButton";
import StatisticsCardComp from "@/components/molecules/statisticsCardComp/StatisticsCardComp";

const DonationCard = ({ isFilterStatus, data, handleCalendarModal }) => {
  const { startDate, endDate } = useSelector(
    (state) => state.donations.calenderDate
  );
  const startDateFormatted = startDate;
  const endDateFormatted = endDate || startDate;

  const { totalAmount, numberOfDonations } = useMemo(() => {
    if (!isFilterStatus) {
      return {
        totalAmount: data?.totalAmount?.toFixed(2),
        numberOfDonations: data.numberOfDonations,
      };
    }
    const successfulDonations = data?.tableData.filter(
      (item) => item.status === "success" || item.status === "offline"
    );

    const successfulDonationsLength = data?.tableData.filter(
      (item) => item.status === "success" || item.status === "offline"
    ); // Calculate credit donations count
    const creditDonations = successfulDonationsLength.filter(
      (item) => item.paymentType === "credit"
    );

    // Calculate final donation count: total successful donations - (credit donations * 2)
    const finalDonationCount =
      successfulDonationsLength.length - creditDonations.length * 2;

    const successAmount = successfulDonations.filter(
      (item) => item.paymentType !== "credit"
    );

    const creditedAmountList = data?.tableData?.filter(
      (item) => item.paymentType === "credit"
    );
    const totalCreditAmount = creditedAmountList.reduce(
      (sum, item) => sum + item.usdAmount,
      0
    );

    const filteredAmount = successAmount.reduce(
      (sum, item) => sum + (Number(item.usdAmount) || 0),
      0
    );

    return {
      totalAmount: (filteredAmount + totalCreditAmount).toFixed(2),
      numberOfDonations: Math.max(0, finalDonationCount), // Ensure it doesn't go below 0
    };
  }, [isFilterStatus, data]);

  return (
    <>
      <GridComp container spacing={1} mt={1} mb={2}>
        <GridComp item xs={12} sm={6} md={4.7}>
          <StatisticsCardComp
            name={"Total amount"}
            currencyUnit={"USD"}
            currencySymbol={"$"}
            value={totalAmount}
            icon={averageDonation}
            altName={"totalAmount"}
            isClickable={false}
          />
        </GridComp>
        <GridComp item xs={12} sm={6} md={4.7}>
          <StatisticsCardComp
            name={"Number of donations"}
            currencyUnit={""}
            currencySymbol={""}
            value={numberOfDonations}
            icon={donation}
            altName={"Number of donations"}
            isClickable={false}
          />
        </GridComp>

        <GridComp item xs={12} sm={12} md={2.5}>
          <BoxComponent
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "row", md: "column" },
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <CalenderButton
              content={`Starting: ${startDateFormatted}`}
              onClickHandler={() => handleCalendarModal(true)}
              // marginBottom={'5px'}
              width={"100%"}
            />
            <CalenderButton
              content={`Ending: ${endDateFormatted}`}
              onClickHandler={() => handleCalendarModal(true)}
              width={"100%"}
            />
          </BoxComponent>
        </GridComp>
      </GridComp>
    </>
  );
};

DonationCard.propTypes = {
  data: PropTypes.any,
  handleCalendarModal: PropTypes.func,
};
export default DonationCard;
