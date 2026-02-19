/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
"use client";


import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import StackComponent from "@/components/atoms/StackComponent";
import RangeSliderComponent from "@/components/atoms/RangeSliderComponent";
import Animate from "@/components/atoms/Animate/Animate";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { styles } from "./DonationProgressBar.style";
import useLottieAnimation from "@/hooks/useLottieAnimation";
import { formatNumber } from "@/utils/formatNumber";

const DonationProgressBar = ({
  isStatic = true,
  minVal = 3000,
  maxVal = 10000,
  defaultValue = 5000,
  getValue = () => { },
  currency = "$",
  small = false,
  recurringDonation,
  isLoading,
  withoutResponsiveness = false,
  isAnimation = true,
  oneTimeDonation,
}) => {
  const [value, setValue] = React.useState(minVal);
  const [showAnimation, setShowAnimation] = useState(false);
  const { animationData: dotsIcon } = useLottieAnimation("dots");

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(defaultValue); // Set directly to defaultValue after a small delay
    }, 100); // Small delay before the animation starts

    return () => clearTimeout(timer);
  }, [defaultValue]);

  useEffect(() => {
    // Start animation when isLoading becomes false and delay for 1.3 seconds
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowAnimation(true);
      }, 1300); // Delay before showing animation
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleChange = (event, newValue) => {
    // Return early if isStatic is true or if any user interaction
    if (isStatic) {
      return;
    }

    // Check if event originated from any user interaction (mouse or touch)
    if (
      event?.pointerType === "mouse" ||
      event?.pointerType === "touch" ||
      event?.nativeEvent?.pointerType === "mouse" ||
      event?.nativeEvent?.pointerType === "touch" ||
      event?.type?.includes("mouse") ||
      event?.type?.includes("touch")
    ) {
      return;
    }

    getValue(newValue);
    if (typeof newValue === "number") {
      setValue(newValue);
    }
  };

  function valueLabelFormat(value, minVal, maxVal) {
    const range = maxVal - minVal;
    const percentage = ((value - minVal) / range) * 100;
    return `${percentage.toFixed(0)}%`;
  }

  const position = Math.min(value / maxVal, 1) * 100; // Ensure it doesn't exceed 100%

  const isMonth = useMemo(() => {
    return oneTimeDonation === true &&
      recurringDonation === true ? null : recurringDonation ? (
        <span style={styles.limitMonthlyTextStyle}>/month</span>
      ) : null;
  }, [oneTimeDonation, recurringDonation]);

  return (
    <StackComponent
      direction="column"
      sx={{
        width: "100%",
        mt: 1.5,
        mb: { xs: "12px !important", sm: "20px !important" },
        position: "relative",
      }}
      spacing={small ? "0px" : 1}
    >
      <RangeSliderComponent
        sx={{
          height: small ? "8px" : "12px",
          p: "0px !important",

          "& .MuiSlider-rail": {
            backgroundColor: "rgba(240, 240, 240, 1)",
            opacity: 1,
          },
        }}
        value={isStatic ? defaultValue : value}
        min={minVal}
        max={maxVal}
        onChange={handleChange}
        aria-label="Donation-Progress"
        valueLabelDisplay="on"
        valueLabelFormat={(value) => valueLabelFormat(value, minVal, maxVal)}
        showBall={false}
      />
      {isAnimation && showAnimation ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${position}%`, // Dynamically calculate left position based on value
            transform: "translate(-50%, -50%)", // Center the animation
            width: "150px", // Fixed width of the animation
            height: "150px", // Fixed height of the animation
          }}
        >
          <Animate
            animationData={dotsIcon}
            loop={false}
            onComplete={() => setShowAnimation(false)} // Set showAnimation to false when the animation completes
          />
        </div>
      ) : null}
      <StackComponent
        sx={{
          marginTop: "8px !important",
          "@media (max-width:1250px)": withoutResponsiveness
            ? null
            : {
              flexDirection: "column",
              alignItems: "center",
            },
        }}
        spacing={0}
        justifyContent="space-between"
      >
        <TypographyComp
          sx={styles.limitStyle}
          {...(small ? { style: { fontSize: "14px" } } : null)}
        >
          <span>
            {currency}
            {formatNumber(defaultValue)}
            {isMonth}
          </span>
          <span style={styles.limitSubtextStyle}>raised</span>
        </TypographyComp>
        <TypographyComp
          {...(small ? { style: { fontSize: "14px" } } : null)}
          sx={styles.limitStyle}
        >
          <span>
            {currency}
            {formatNumber(maxVal)}
            {isMonth}
          </span>
          <span style={styles.limitSubtextStyle}>goal</span>
        </TypographyComp>
      </StackComponent>
    </StackComponent>
  );
};

DonationProgressBar.propTypes = {
  currency: PropTypes.string,
  defaultValue: PropTypes.number,
  getValue: PropTypes.func,
  isStatic: PropTypes.bool,
  maxVal: PropTypes.number,
  minVal: PropTypes.number,
  small: PropTypes.bool,
  withoutResponsiveness: PropTypes.bool,
  recurringDonation: PropTypes.bool,
  isLoading: PropTypes.bool,
  isAnimation: PropTypes.bool,
  oneTimeDonation: PropTypes.any,
};

export default DonationProgressBar;
