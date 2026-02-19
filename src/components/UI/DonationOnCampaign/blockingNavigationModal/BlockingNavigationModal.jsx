"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import useLottieAnimation from "@/hooks/useLottieAnimation";
import StackComponent from "@/components/atoms/StackComponent";
import Animate from "@/components/atoms/Animate/Animate";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import { theme } from "@/config/customTheme";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { resetDonationState } from "@/store/slices/donationSlice";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";

const BlockingNavigationModal = ({ id, setOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const src = searchParams.get("src");
  const { animationData: heartbreaking } = useLottieAnimation("heartbreaking");
  const [givingLevelsValues] = useState(
    useSelector((state) => state.donation?.campaignDetails?.givingLevels),
  );
  const currencySymbol = useSelector(
    (state) => state.donation?.campaignDetails?.currencySymbol,
  );

  const donation = useSelector((state) => state?.donation);

  const getMinAmount = () => {
    const minDonationAmount =
      donation?.campaignDetails?.minimumDonationAmount || 0;

    const getFormattedMinDonation = () => {
      if (minDonationAmount < 1) return 1;
      return Number(minDonationAmount).toFixed(2);
    };

    if (!givingLevelsValues || givingLevelsValues.length === 0) {
      return getFormattedMinDonation();
    }

    // Filter giving levels based on donation type
    let filteredLevels = givingLevelsValues;

    if (donation?.donationType === "giveOnce") {
      // Filter for one-time donations
      filteredLevels = givingLevelsValues.filter(
        (level) => level.donationType === "oneTimeDonation",
      );
    } else if (donation?.donationType === "monthly") {
      // Filter for recurring donations
      filteredLevels = givingLevelsValues.filter(
        (level) => level.donationType === "recurringDonation",
      );
    }

    // If no matching levels found, fallback to all levels
    if (filteredLevels.length === 0) {
      filteredLevels = givingLevelsValues;
    }

    const minGivingLevelAmount = Math.min(
      ...filteredLevels.map((level) => level.amount),
    );

    if (donation?.selectedBoxData) {
      return minGivingLevelAmount;
    }

    if (
      donation?.donationValueBack &&
      Number(donation?.donationValueBack) > 0
    ) {
      return getFormattedMinDonation();
    }

    return minGivingLevelAmount;
  };

  return (
    <StackComponent direction={"column"} alignItems="center">
      <Animate animationData={heartbreaking} />
      <CampaignHeading sx={{ mt: "-30px !important" }}>
        Please don`t go yet!
      </CampaignHeading>
      <SubHeading1 align="center" sx={{ color: theme.palette.primary.gray }}>
        Just{" "}
        <span style={{ color: "#090909" }}>
          {currencySymbol}
          {getMinAmount()}
        </span>{" "}
        can make a difference.
      </SubHeading1>
      <StackComponent
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ width: "100%", marginTop: "28px !important" }}
      >
        <ButtonComp
          fullWidth={true}
          size={"normal"}
          onClick={() => setOpen(false)}
        >
          Yes, I will help
        </ButtonComp>
        <ButtonComp
          fullWidth={true}
          size={"normal"}
          variant="outlined"
          onClick={() => {
            dispatch(resetDonationState());
            setOpen(false);

            // Set flag to allow leaving
            window.__leavingDonationPage = true;

            // On mobile, navigate back through history
            // On desktop, just close (donation is in same page)
            if (isSmallScreen) {
              // Navigate back to campaign by repeatedly going back until off donation page
              const goBackLoop = () => {
                const state = window.history.state;
                if (state?.isDonationPage) {
                  window.history.back();
                  setTimeout(goBackLoop, 50);
                } else {
                  window.__leavingDonationPage = false;
                }
              };

              setTimeout(goBackLoop, 50);
            } else {
              // Desktop: just reset the flag, modal is already closed
              setTimeout(() => {
                window.__leavingDonationPage = false;
              }, 100);
            }
          }}
        >
          Sorry, not today
        </ButtonComp>
      </StackComponent>
    </StackComponent>
  );
};

BlockingNavigationModal.propTypes = {
  setOpen: PropTypes.setOpen,
  id: PropTypes.any,
  updateTitle: PropTypes.any,
};

export default BlockingNavigationModal;
