"use client";

import React from "react";
import PropTypes from "prop-types";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "../StackComponent";
import SubHeading from "../createCampaigns/SubHeading";
import { formatNumberShort } from "@/utils/helpers";
// import LimitedParagraph from "../limitedParagraph/LimitedParagraph";
// import Check from "@/assets/iconComponent/Check";
import { theme } from "@/config/customTheme";
import { AUTOMATIC_DONATION_DAYS } from "@/config/constant";
// import { Paragraph } from "../limitedParagraph/LimitedParagraph.style";
// import { AUTOMATIC_DONATION_DAYS } from "@/config/constant";

// Next
const NewSelectAbleLevel = ({
  onClick = () => { },
  isActive,
  // heading = "heading",
  amount = 70,
  currencySymbol = "$",
  // currencyUnit = s"USD",
  height = { xs: "100%", sm: "45px" },
  // isIcon = true,
  donationType = "oneTimeDonation",
  recurringType,
  sx,
}) => {
  // const overflowStylesHeading = {
  //   display: "-webkit-box",
  //   WebkitLineClamp: "2",
  //   WebkitBoxOrient: "vertical",
  //   overflow: "hidden",
  //   textOverflow: "ellipsis",
  //   wordBreak: "break-word",
  // };

  // Function to get the recurring type title from constants
  const getRecurringTypeTitle = (recurringType) => {
    const recurringOption = AUTOMATIC_DONATION_DAYS.find(
      (option) => option.value === recurringType
    );

    if (!recurringOption) return "Recurring donation";

    // Return shortened versions for specific types
    switch (recurringType) {
      case "dailyLast10NightsRamadan":
        return "last 10 nights of Ramadan";
      case "dailyFirst10DaysDhulHijjah":
        return "first 10 days of Dhul Hijjah";
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

  return (
    <BoxComponent
      onClick={onClick}
      sx={{
        height: height,
        width: "100%",
        // mb: { xs: 0, sm: 1 },
        // gap: "12px !important",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // gap: 1,
        cursor: "pointer",
        padding: "1rem 1rem 1rem 1rem",
        borderRadius: "10px",
        border: isActive ? "2px solid transparent" : "2px solid #E9E9EB",
        background:
          "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box",
        ...sx,
      }}
    >
      <StackComponent
        direction={{ xs: "row", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "center", sm: "center" }}
        sx={{ width: "100%", justifyContent: "center" }}
      >
        <BoxComponent
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              // gap: "5px",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <SubHeading
              sx={{
                color: theme.palette.primary.main,
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              {currencySymbol}
              {formatNumberShort(amount)}&nbsp;
            </SubHeading>
            {donationType === "recurringDonation" ? (
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "10px",
                  color: "#C1C1F5",
                  textAlign: "center"
                }}
              >
                {getRecurringTypeTitle(recurringType)}
                {/* Every Friday */}
              </span>
            ) : null}
            {/* {donationType === "recurringDonation" ? (
            <Paragraph
              sx={{ color: "#C1C1F5", lineHeight: "28px", fontSize: "12px" }}
            >
              {getRecurringTypeTitle(recurringType)}
            </Paragraph>
          ) : null} */}
          </BoxComponent>
        </BoxComponent>
        {/* <BoxComponent
          sx={{
            width: { xs: isIcon ? "90%" : "100%", sm: "80%" },
            marginTop: "0px !important",
          }}
        >
          <LimitedParagraph
            line={2}
            align="left"
            fontWeight={400}
            fontSize="16px"
            sx={{
              ...overflowStylesHeading,
              lineHeight: "20px",
              color: isActive
                ? theme.palette.primary.darkGray
                : theme.palette.primary.darkGray,
            }}
          >
            {heading}
          </LimitedParagraph>
        </BoxComponent> */}
      </StackComponent>
      {/* {isIcon
        ? isActive && (
            <BoxComponent sx={{ marginLeft: "10px" }}>
              <Check />
            </BoxComponent>
          )
        : null} */}
    </BoxComponent>
  );
};

NewSelectAbleLevel.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  heading: PropTypes.string,
  title: PropTypes.string,
  currencySymbol: PropTypes.string,
  currencyUnit: PropTypes.string,
  amount: PropTypes.number,
  height: PropTypes.any,
  isIcon: PropTypes.bool,
  sx: PropTypes.object,
  donationType: PropTypes.string,
};

export default NewSelectAbleLevel;
