"use client";

import React from "react";
import PropTypes from "prop-types";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";

// Next
export const STICKY_BTN_STYLES = {
  position: "sticky",
  bottom: 0,
  right: 0,
  left: 0,
  height: "max-content",
  zIndex: 13,
  background: "white",
  paddingTop: "0.5rem",
  paddingBottom: "1rem",
};

const SubmitButton = ({
  isContinueButtonDisabled,
  children = "Continue",
  onClick,
  withSticky = false,
  submitCampaign = false,
  borderRadius,
  newDonation = false,
  ...props
}) => {
  const { isSmallScreen } = useResponsiveScreen();

  return (
    <BoxComponent
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        margin: {
          xs: "2px",
          sm: newDonation ? "12px 0px 22px 0px" : "22px 0px 22px -3px",
        },
        ...(withSticky && !isSmallScreen && !submitCampaign
          ? STICKY_BTN_STYLES
          : {}),
      }}
    >
      <ButtonComp
        type="submit"
        size="small"
        fullWidth={isSmallScreen ? true : false}
        disabled={isContinueButtonDisabled}
        onClick={onClick}
        borderRadius={borderRadius}
        sx={{
          padding: "12px 32px",
          letterSpacing: "-0.41px",
          fontSize: "16px",
          fontWeight: 400,
        }}
        {...props}
      >
        {children}
      </ButtonComp>
    </BoxComponent>
  );
};

SubmitButton.propTypes = {
  isContinueButtonDisabled: PropTypes.bool,
  children: PropTypes.any,
  onClick: PropTypes.func,
  withSticky: PropTypes.bool,
  submitCampaign: PropTypes.bool,
};

export default SubmitButton;
