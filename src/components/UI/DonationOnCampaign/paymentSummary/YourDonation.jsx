/* eslint-disable indent */
"use client";

import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { tipAmountHandler } from "@/store/slices/donationSlice";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { theme } from "@/config/customTheme";
import DividerComponent from "@/components/atoms/DividerComponent";
import { formatNumberWithCommas } from "@/utils/helpers";

const YourDonation = ({
  donationValue,
  tip,
  customTipValue,
  isRecurringPaymentSelected,
  isOrderBumpSelected,
  processingFeePercentage,
  isProcessingFee,
  isThankYou = false,
}) => {
  const dispatch = useDispatch();

  const sellConfigs = useSelector((state) => state.sellConfigs?.sellConfigs);
  const yourDonationData = useSelector(
    (state) => state?.successDonation?.yourDonationData
  );

  const amount = isRecurringPaymentSelected
    ? donationValue?.recurringDonation
    : donationValue?.totalAmount;

  const safeAmount = Number(amount) || 0;

  let TipPercent;
  let TipValue;

  const orderBump = useMemo(
    () => sellConfigs?.filter((item) => item.type === "orderBump") || [],
    [sellConfigs]
  );

  const tipNumeric = useMemo(() => {
    switch (tip) {
      case 0:
        return +(0.05 * safeAmount).toFixed(2);
      case 1:
        return +(0.1 * safeAmount).toFixed(2);
      case 2:
        return +(0.15 * safeAmount).toFixed(2);
      case 3:
        return +(0.2 * safeAmount).toFixed(2);
      case 4:
        return +(0.25 * safeAmount).toFixed(2);
      default: {
        const parsed = Number(customTipValue);
        return Number.isFinite(parsed) ? +parsed.toFixed(2) : 0;
      }
    }
  }, [tip, safeAmount, customTipValue]);

  useEffect(() => {
    dispatch(tipAmountHandler(tipNumeric));
  }, [dispatch, tipNumeric]);

  switch (tip) {
    case 0:
      TipPercent = `Tip (${5}%)`;
      break;
    case 1:
      TipPercent = `Tip (${10}%)`;
      break;
    case 2:
      TipPercent = `Tip (${15}%)`;
      break;
    case 3:
      TipPercent = `Tip (${20}%)`;
      break;
    case 4:
      TipPercent = `Tip (${25}%)`;
      break;
    default:
      TipPercent = "Tip";
      TipValue = customTipValue?.toFixed(2);
      dispatch(tipAmountHandler(customTipValue));
      break;
  }

  TipValue = tipNumeric.toFixed(2);

  const totalBeforeFee =
    Number(safeAmount) +
    Number(TipValue) +
    (isOrderBumpSelected ? orderBump[0]?.amount : 0);

  const processingFeeValue = parseFloat(
    ((processingFeePercentage / 100) * totalBeforeFee).toFixed(2)
  );

  const totalAmount = isProcessingFee
    ? (totalBeforeFee + processingFeeValue).toFixed(2)
    : totalBeforeFee.toFixed(2);
  // console.log("show total", total);
  // const totalAmount = total.toFixed(2);

  const monthStatus = (
    <span style={{ fontWeight: 400, color: theme.palette.primary.gray }}>
      /month
    </span>
  );

  return (
    <BoxComponent
      sx={{ my: 5, display: "flex", gap: "16px", flexDirection: "column" }}
    >
      <SubHeading>
        {isRecurringPaymentSelected && yourDonationData?.recurringType
          ? "Your recurring donation"
          : "Your donation"}
      </SubHeading>
      {!isRecurringPaymentSelected || !yourDonationData?.recurringType ? (
        <StackComponent
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <TypographyComp
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              color: theme.palette.primary.gray,
            }}
          >
            {donationValue?.title
              ? donationValue.title.toLowerCase().charAt(0).toUpperCase() +
                donationValue.title.toLowerCase().slice(1)
              : "Your donation"}
          </TypographyComp>
          {isThankYou ? (
            <TypographyComp sx={{ fontWeight: 500, fontSize: "18px" }}>
              $0.00
            </TypographyComp>
          ) : (
            <TypographyComp sx={{ fontWeight: 500, fontSize: "18px" }}>
              {donationValue?.units ||
                donationValue?.currency ||
                yourDonationData?.units}
              &nbsp;
              {donationValue?.symbol || yourDonationData?.symbol}
              {amount ? formatNumberWithCommas(Number(amount)?.toFixed(2)) : ""}
            </TypographyComp>
          )}
        </StackComponent>
      ) : null}
      {isRecurringPaymentSelected === true &&
      yourDonationData?.recurringType ? (
        <StackComponent
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
          // mt={3}
        >
          <TypographyComp
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              color: theme.palette.primary.gray,
            }}
          >
            First payment
          </TypographyComp>
          <TypographyComp sx={{ fontWeight: 500, fontSize: "18px" }}>
            {donationValue?.units ||
              donationValue?.currency ||
              yourDonationData?.units}
            &nbsp;
            {donationValue?.symbol || yourDonationData?.symbol}
            {formatNumberWithCommas(
              donationValue?.recurringDonation?.toFixed(2)
            )}
            {isOrderBumpSelected === true && isRecurringPaymentSelected === true
              ? monthStatus
              : null}
          </TypographyComp>
        </StackComponent>
      ) : null}
      <StackComponent
        direction={"row"}
        justifyContent="space-between"
        alignItem="center"
      >
        <TypographyComp
          sx={{
            fontWeight: 500,
            fontSize: "18px",
            color: theme.palette.primary.gray,
          }}
        >
          {TipPercent}
        </TypographyComp>
        {isThankYou ? (
          <TypographyComp sx={{ fontWeight: 500, fontSize: "18px" }}>
            $0.00
          </TypographyComp>
        ) : (
          <TypographyComp sx={{ fontWeight: 500, fontSize: "18px" }}>
            {donationValue?.units ||
              donationValue?.currency ||
              yourDonationData?.units}
            &nbsp;
            {donationValue?.symbol || yourDonationData?.symbol}
            {formatNumberWithCommas(TipValue)}
            {isOrderBumpSelected === true && isRecurringPaymentSelected === true
              ? monthStatus
              : null}
          </TypographyComp>
        )}
      </StackComponent>
      {isOrderBumpSelected ? (
        <StackComponent
          direction={"row"}
          justifyContent="space-between"
          alignItem="center"
        >
          <TypographyComp
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              color: theme.palette.primary.gray,
              wordBreak: orderBump[0]?.title
                ?.split(" ")
                .some((word) => word.length > 30)
                ? "break-all"
                : undefined,
            }}
          >
            {`Donation bump (${orderBump[0]?.title})`}
          </TypographyComp>
          <TypographyComp sx={{ fontWeight: 500, fontSize: "18px" }}>
            {donationValue?.units ||
              donationValue?.currency ||
              yourDonationData?.units}
            &nbsp;
            {donationValue?.symbol || yourDonationData?.symbol}
            {formatNumberWithCommas(orderBump[0]?.amount?.toFixed(2))}
          </TypographyComp>
        </StackComponent>
      ) : null}
      {isProcessingFee && (
        <StackComponent
          direction={"row"}
          justifyContent="space-between"
          alignItem="center"
        >
          <TypographyComp
            sx={{
              fontWeight: 500,
              fontSize: "18px",
              color: theme.palette.primary.gray,
            }}
          >
            Processing fee
          </TypographyComp>
          <TypographyComp sx={{ fontWeight: 500, fontSize: "18px" }}>
            {donationValue?.units ||
              donationValue?.currency ||
              yourDonationData?.units}
            &nbsp;
            {donationValue?.symbol || yourDonationData?.symbol}
            {formatNumberWithCommas(processingFeeValue?.toFixed(2))}
          </TypographyComp>
        </StackComponent>
      )}
      <DividerComponent light sx={{ opacity: 0.6 }} />
      <StackComponent
        direction={"row"}
        justifyContent="space-between"
        alignItem="center"
        // mt={3}
      >
        <TypographyComp
          sx={{
            fontWeight: 500,
            fontSize: "18px",
            color: theme.palette.primary.gray,
          }}
        >
          Total
        </TypographyComp>
        {isThankYou ? (
          <TypographyComp sx={{ fontWeight: 500, fontSize: "18px" }}>
            $0.00
          </TypographyComp>
        ) : (
          <TypographyComp sx={{ fontWeight: 500, fontSize: "18px" }}>
            {donationValue?.units ||
              donationValue?.currency ||
              yourDonationData?.units}
            &nbsp;
            {donationValue?.symbol || yourDonationData?.symbol}
            {totalAmount === "NaN" ? "" : formatNumberWithCommas(totalAmount)}
            {isOrderBumpSelected === true &&
              isRecurringPaymentSelected &&
              monthStatus}
          </TypographyComp>
        )}
      </StackComponent>
    </BoxComponent>
  );
};

YourDonation.propTypes = {
  tip: PropTypes.number,
  customTipValue: PropTypes.any,
  donationValue: PropTypes.object,
  isRecurringPaymentSelected: PropTypes.bool,
  isOrderBumpSelected: PropTypes.any,
  processingFeePercentage: PropTypes.any,
  isProcessingFee: PropTypes.bool,
  isThankYou: PropTypes.bool,
};
YourDonation.displayName = "YourDonation";

export default YourDonation;
