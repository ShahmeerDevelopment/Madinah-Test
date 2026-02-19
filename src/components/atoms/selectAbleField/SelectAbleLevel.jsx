"use client";

import React from "react";
import PropTypes from "prop-types";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "../StackComponent";
import SubHeading from "../createCampaigns/SubHeading";
import { formatNumberWithCommas } from "@/utils/helpers";
// import Paragraph from "../createCampaigns/Paragraph";
import LimitedParagraph from "../limitedParagraph/LimitedParagraph";
import Check from "@/assets/iconComponent/Check";
import { theme } from "@/config/customTheme";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { Paragraph } from "../limitedParagraph/LimitedParagraph.style";

// Next
const SelectAbleLevel = ({
  onClick = () => {},
  isActive,
  heading = "heading",
  title = "title",
  amount = 70,
  currencySymbol = "$",
  currencyUnit = "USD",
  height = { xs: "100%", sm: "100px" },
  isIcon = true,
  donationType = "oneTimeDonation",
  sx,
}) => {
  const { isSmallScreen } = useResponsiveScreen();
  const overflowStyles = {
    display: "-webkit-box",
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
  };
  const overflowStylesHeading = {
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
  };
  return (
    <BoxComponent
      onClick={onClick}
      sx={{
        height: height,
        width: "100%",
        mb: { xs: 0, sm: 1 },
        display: "flex",
        justifyContent: isActive ? "space-between" : "flex-start",
        alignItems: "center",
        gap: 1,
        cursor: "pointer",
        padding: "1rem 1rem 1rem 1.5rem",
        borderRadius: "28px",
        border: isActive ? "2px solid transparent" : "2px solid #E9E9EB",
        background:
          "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box",
        ...sx,
      }}
    >
      <StackComponent
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ width: "100%" }}
      >
        <BoxComponent>
          <SubHeading sx={{ color: theme.palette.primary.main }}>
            {currencySymbol}
            {formatNumberWithCommas(amount)}&nbsp;
            <span
              style={{
                fontWeight: 400,
                fontSize: "16px",
                color: "#C1C1F5",
              }}
            >
              {currencyUnit}
            </span>
            {donationType === "recurringDonation" && isSmallScreen && (
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "16px",
                  color: "#C1C1F5",
                  marginLeft: "4px",
                }}
              >
                per month
              </span>
            )}
            {donationType === "recurringDonation" && !isSmallScreen ? (
              <Paragraph sx={{ color: "#C1C1F5", mt: -0.5 }} fontSize="16px">
                per month
              </Paragraph>
            ) : null}
          </SubHeading>
        </BoxComponent>
        <BoxComponent
          sx={{
            width: { xs: isIcon ? "90%" : "100%", sm: "80%" },
            marginTop: "5px !important",
          }}
        >
          <LimitedParagraph
            line={2}
            align="left"
            fontWeight={500}
            fontSize="20px"
            sx={{
              ...overflowStylesHeading,
              lineHeight: "20px",
              color: isActive
                ? theme.palette.primary.darkGray
                : theme.palette.primary.gray,
            }}
          >
            {heading}
          </LimitedParagraph>

          <LimitedParagraph
            align="left"
            line={2}
            fontWeight={400}
            fontSize="16px"
            sx={{
              ...overflowStyles,
              WebkitLineClamp: "2", // Override for 2 lines
              lineHeight: "20px",
              color: theme.palette.primary.gray,
            }}
          >
            {title}
          </LimitedParagraph>
        </BoxComponent>
      </StackComponent>
      {isIcon
        ? isActive && (
            <BoxComponent>
              <Check />
            </BoxComponent>
          )
        : null}
    </BoxComponent>
  );
};

SelectAbleLevel.propTypes = {
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

export default SelectAbleLevel;
