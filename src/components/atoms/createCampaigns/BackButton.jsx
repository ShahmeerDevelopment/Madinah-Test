"use client";

import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { theme } from "@/config/customTheme";
import ButtonComp from "../buttonComponent/ButtonComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { campaignStepperDecrementHandler } from "@/store/slices/campaignSlice";
import { useSelector } from "react-redux";
import { donatePressHandler } from "@/store/slices/donationSlice";

// Next
const BackButton = ({
  isStepperInclude = true,
  path = "/dashboard",
  isStepperLocal = false,
  setActiveStep,
  setCurrentIndex,
  activeStep,
  disabled = false,
  newDonation = false,
  createCampaign = false,
}) => {
  const router = useRouter();
  const donation = useSelector((state) => state.donation);
  const dispatch = useDispatch();
  // const activeSteps = useSelector((state) => state.campaign.activeStep);
  const handleBack = () => {
    if (createCampaign) {
      dispatch(campaignStepperDecrementHandler(1));
      return;
    }

    if (isStepperInclude) {
      if (isStepperLocal) {
        if (activeStep === 0) {
          // dispatch(resetDonationState());
          dispatch(donatePressHandler(false));
          router.back(); // Navigate back if activeStep is 0
        } else {
          // Decrement activeStep if it's not 0
          // Check if selected box is recurring donation
          const isSelectedBoxRecurring =
            donation?.selectedBoxData?.donationType === "recurringDonation";
          const isPromoteRecurring =
            donation?.campaignDetails?.isPromoteRecurringDonations;
          const isRecurringDonation = donation?.isRecurring;
          const hasSelectedBox = !!donation?.selectedBoxData;

          // Apply special logic only when on step 2 (NewPaymentMethod)
          if (activeStep === 2) {
            // Mirror the forward navigation logic from NewGivingLevels.jsx (lines 1217-1225)
            // Go back 2 steps (skip recurring page) if ANY of these conditions are true:
            // 1. isRecurring is true AND has a selected box (recurring box was selected)
            // 2. Campaign doesn't support recurring donations at all
            // 3. Promote recurring is false (recurring page should be skipped)
            const shouldSkipRecurringPage =
              (isRecurringDonation && hasSelectedBox) ||
              !donation?.campaignDetails?.isRecurringDonation ||
              !isPromoteRecurring;

            if (shouldSkipRecurringPage) {
              setActiveStep((prevActiveStep) => {
                setCurrentIndex(prevActiveStep - 2);
                return prevActiveStep - 2;
              });
            } else {
              // Go back 1 step - recurring page should be shown
              setActiveStep((prevActiveStep) => {
                setCurrentIndex(prevActiveStep - 1);
                return prevActiveStep - 1;
              });
            }
          } else {
            // Default behavior for other steps - go back 1 step
            setActiveStep((prevActiveStep) => {
              setCurrentIndex(prevActiveStep - 1);
              return prevActiveStep - 1;
            });
          }
        }
      } else {
        dispatch(campaignStepperDecrementHandler(1));
      }
    } else {
      router.push(path);
    }
  };
  return (
    <BoxComponent sx={{ display: "flex" }}>
      <ButtonComp
        onClick={handleBack}
        disabled={disabled}
        fullWidth={false}
        size="normal"
        variant={newDonation ? "text" : "outlined"}
        sx={{
          padding: "5px 15px 4px 12px",
          color: theme.palette.primary.darkGray,
          border: `${
            !newDonation
              ? `1px solid ${theme.palette.primary.lightGray}`
              : "none"
          }`,
          width: "107px",
          marginLeft: newDonation && "-26px",
        }}
        startIcon={
          <KeyboardArrowLeftIcon
            sx={{ mr: -0.7, mt: -0.3 }}
            fontSize="medium"
          />
        }
      >
        Back
      </ButtonComp>
    </BoxComponent>
  );
};

BackButton.propTypes = {
  isStepperInclude: PropTypes.bool,
  path: PropTypes.string,
  isStepperLocal: PropTypes.bool,
  setActiveStep: PropTypes.func,
  setCurrentIndex: PropTypes.func,
  activeStep: PropTypes.number,
  disabled: PropTypes.bool,
  newDonation: PropTypes.bool,
  isRecurring: PropTypes.bool,
  createCampaign: PropTypes.bool,
};

export default BackButton;
