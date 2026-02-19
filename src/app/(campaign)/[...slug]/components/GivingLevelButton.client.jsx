"use client";

/**
 * GivingLevelButton - Client Component for giving level donation buttons
 *
 * This component handles the interactive button for giving levels,
 * including dispatch actions and analytics tracking.
 * 
 * TBT Optimization: Removed unused useResponsiveScreen import
 */

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

// Removed unused useResponsiveScreen import for better TBT
import RecurringIcon from "@/assets/iconComponent/RecurringIcon";
import { AUTOMATIC_DONATION_DAYS } from "@/config/constant";

import {
  donatePressHandler,
  desktopLevelIndexHandler,
  recurringTypeHandler,
} from "@/store/slices/donationSlice";

export default function GivingLevelButton({
  index,
  recurringType,
  donationType,
  buttonText,
  status,
  previewMode = false,
}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  // Removed unused useResponsiveScreen hook

  const isAdminLogin = useSelector((state) =>
    state.auth.userDetails?.loginAs === "admin" ? true : false,
  );

  const givingLevelHandler = useCallback(() => {
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
  }, [dispatch, previewMode, recurringType, index]);

  const getRecurringTypeTitle = () => {
    const recurringTypeItem = AUTOMATIC_DONATION_DAYS.find(
      (item) => item.value === recurringType,
    );
    return recurringTypeItem ? recurringTypeItem.label : "";
  };

  if (donationType !== "recurringDonation") {
    return (
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
    );
  }

  // Recurring donation type
  return (
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
          {`${buttonText}${donationType === "recurringDonation" ? "" : ""}`}
        </ButtonComp>
      </BoxComponent>
    </BoxComponent>
  );
}
