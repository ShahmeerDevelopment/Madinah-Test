"use client";

/**
 * GivingLevelCard - Client Component for giving level cards
 *
 * This component needs to be client-side because it uses:
 * - styled() components (LimitedParagraph, SubHeading1, Paragraph)
 * - ShowMoreComponent (uses client-side state)
 * - MUI Chip component
 * 
 * TBT Optimization: Uses CSS-based responsive styles instead of useResponsiveScreen
 */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import Chip from "@mui/material/Chip";
import toast from "react-hot-toast";

import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import ShowMoreComponent from "@/components/atoms/ShowMoreComponent";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

import RecurringIcon from "@/assets/iconComponent/RecurringIcon";
import { AUTOMATIC_DONATION_DAYS } from "@/config/constant";
import { formatNumber } from "@/utils/formatNumber";
// Removed useResponsiveScreen - using CSS-based responsive design for better TBT

import {
  donatePressHandler,
  desktopLevelIndexHandler,
  recurringTypeHandler,
  donationBackHandler,
} from "@/store/slices/donationSlice";

const styles = {
  sectionLayout: {
    p: "32px",
    borderRadius: "32px",
    background: "white",
    lineHeight: "20px",
    marginTop: "8px",
  },
};

export default function GivingLevelCard({
  title,
  amount,
  claimed,
  description,
  isMostNeeded,
  donationType,
  recurringType,
  currencySymbol,
  status,
  index,
  previewMode = false,
}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  // Removed useResponsiveScreen - using CSS sx props for responsive design

  const isAdminLogin = useSelector((state) =>
    state.auth.userDetails?.loginAs === "admin" ? true : false,
  );

  const overflowStylesHeading = {
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
  };

  useEffect(() => {
    dispatch(donationBackHandler(false));
  }, [dispatch]);

  const getRecurringTypeTitle = () => {
    const recurringTypeItem = AUTOMATIC_DONATION_DAYS.find(
      (item) => item.value === recurringType,
    );
    return recurringTypeItem ? recurringTypeItem.label : "";
  };

  const givingLevelHandler = () => {
    // IMPORTANT: Set intentional flag AND clear skip flags BEFORE navigation
    sessionStorage.setItem("__intentionalDonation", "true");
    sessionStorage.removeItem("__skipDonationPage");
    sessionStorage.removeItem("__skipDonationPageTarget");
    window.__blockBackToDonation = false;

    // Verify flag was set
    const checkFlag = sessionStorage.getItem("__intentionalDonation");

    if (recurringType) {
      dispatch(recurringTypeHandler(recurringType));
    }
    if (previewMode) {
      toast("Not Functional in Preview Mode", { duration: 1000 });
      return;
    }
    // Dispatch for both mobile and desktop to store the level index
    dispatch(donatePressHandler(true));
    dispatch(desktopLevelIndexHandler(index));
  };

  const formattedAmount = formatNumber(amount);
  const buttonText = `Donate ${currencySymbol}${formattedAmount}`;

  return (
    <StackComponent
      sx={styles.sectionLayout}
      direction="column"
      component="section"
    >
      {/* Most Needed Badge */}
      <StackComponent direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        {isMostNeeded && (
          <Chip
            label="Most Needed"
            size="small"
            sx={{
              backgroundColor: "#FFD700",
              color: "black",
              fontWeight: 500,
              paddingTop: "2px",
              height: "28px",
              fontSize: "12px",
              lineHeight: "16px",
            }}
          />
        )}
      </StackComponent>

      {/* Title and Amount */}
      <StackComponent
        sx={{
          "& > *": {
            fontSize: "18px",
            fontWeight: 500,
          },
        }}
        justifyContent="space-between"
      >
        <LimitedParagraph
          line={2}
          fontWeight={500}
          fontSize={"18px"}
          sx={{
            ...overflowStylesHeading,
            lineHeight: "22px",
          }}
        >
          {title}
        </LimitedParagraph>
        <SubHeading1>
          {currencySymbol}
          {formattedAmount}
        </SubHeading1>
      </StackComponent>

      {/* Description */}
      {description && (
        <ShowMoreComponent
          lines={3}
          descriptionLength={description?.length || 0}
        >
          <Paragraph sx={{ lineHeight: "20px" }}>{description}</Paragraph>
        </ShowMoreComponent>
      )}

      {/* Claimed count */}
      <TypographyComp
        sx={{
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "16px",
          color: "#424243",
        }}
      >
        {claimed} claimed
      </TypographyComp>

      {/* Button - different for recurring vs one-time */}
      {donationType !== "recurringDonation" && (
        <ButtonComp
          variant="outlined"
          size="normal"
          fontSize="14px"
          fontWeight={500}
          height="34px"
          lineHeight="16px"
          disabled={isAdminLogin || status !== "active" ? true : false}
          sx={{
            "&:hover": {
              color: "#ffffff",
              background: theme.palette.primary.main,
            },
          }}
          onClick={givingLevelHandler}
        >
          {`${buttonText} ${donationType === "recurringDonation" ? " monthly" : ""}`}
        </ButtonComp>
      )}

      {donationType === "recurringDonation" && (
        <BoxComponent
          sx={{
            borderRadius: "22px",
            border: "2px solid #F7F7FF",
            height: "auto",
            padding: "12px 16px 12px 16px",
            gap: "24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <BoxComponent
            sx={{
              display: "flex",
              gap: "10px",
              height: "40px",
              alignItems: "center",
            }}
          >
            <RecurringIcon />
            <BoxComponent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <TypographyComp
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "16px",
                  color: "#090909",
                }}
              >
                {getRecurringTypeTitle()}
              </TypographyComp>
            </BoxComponent>
          </BoxComponent>
          <BoxComponent
            sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <ButtonComp
              variant="outlined"
              size="normal"
              fontSize="14px"
              fontWeight={500}
              height="34px"
              lineHeight="16px"
              disabled={isAdminLogin || status !== "active" ? true : false}
              sx={{
                width: "100%",
                "&:hover": {
                  color: "#ffffff",
                  background: theme.palette.primary.main,
                },
              }}
              onClick={givingLevelHandler}
            >
              {buttonText}
            </ButtonComp>
          </BoxComponent>
        </BoxComponent>
      )}
    </StackComponent>
  );
}
