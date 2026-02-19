"use client";


import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import StackComponent from "@/components/atoms/StackComponent";
import RangeSliderComponent from "@/components/atoms/RangeSliderComponent";
import Animate from "@/components/atoms/Animate/Animate";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { styles } from "./DonationProgressBar.style";
import { useLottieAnimation } from "@/hooks/useLottieAnimation";
import { formatNumber } from "@/utils/formatNumber";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const NewDonationProgressBar = ({
  recentSupportersCount,
  isStatic = true,
  minVal = 3000,
  maxVal = 10000,
  defaultValue = 5000,
  getValue = () => { },
  currency = "$",
  small = false,
  recurringDonation,
  isLoading,
  isAnimation = true,
  oneTimeDonation,
  status,
}) => {
  const { animationData: dotsIcon } = useLottieAnimation("dots");
  const [value, setValue] = React.useState(isAnimation ? minVal : defaultValue);
  const [displayValue, setDisplayValue] = useState(isAnimation ? 0 : defaultValue);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Skip expensive animation if isAnimation is false (reduces TBT on mobile)
    if (!isAnimation) {
      setValue(defaultValue);
      setDisplayValue(defaultValue);
      return;
    }

    setValue(0);
    setDisplayValue(0);

    // const duration = 3200;
    const steps = 180;
    const slowdownThreshold = defaultValue * 0.99;
    let current = 0;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      // const elapsed = timestamp - startTime;
      // const increment = elapsed / (duration / steps);

      if (current >= slowdownThreshold) {
        current += (defaultValue - slowdownThreshold) / (steps * 0.5);
      } else {
        current += slowdownThreshold / steps;
      }

      current = Math.min(current, defaultValue);

      setValue(Math.floor(current));
      setDisplayValue(Math.floor(current));

      if (current < defaultValue) {
        requestAnimationFrame(animate); // Schedule next frame
      }
    };

    requestAnimationFrame(animate);

    return () => {
      current = defaultValue; // Clean up
    };
  }, [defaultValue, isAnimation]);

  useEffect(() => {
    // Skip if animation is disabled
    if (!isAnimation) return;
    
    const timer = setTimeout(() => {
      setValue(defaultValue); // Set directly to defaultValue after a small delay
    }, 100); // Small delay before the animation starts

    return () => clearTimeout(timer);
  }, [defaultValue, isAnimation]);

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
    <>
      <BoxComponent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          //
          position: "relative",
          zIndex: 2,
          transform: "translateZ(0)", // Forces GPU acceleration
          willChange: "transform",
        }}
      >
        <TypographyComp
          sx={{
            fontSize: "48px",
            fontWeight: 600,
            lineHeight: "48px",
            //
            WebkitFontSmoothing: "antialiased",
            textRendering: "optimizeLegibility",
            transform: "translateZ(0)",
            position: "relative",
          }}
        >
          <span>
            {currency}
            {formatNumber(displayValue)}
            {isMonth}
          </span>
        </TypographyComp>
        <TypographyComp sx={styles.limitSubtextStyle}>
          raised of{" "}
          <span style={{ color: "#000000" }}>
            {currency}
            {formatNumber(maxVal)}
            {isMonth}
          </span>
          <span style={styles.limitSubtextStyle}>goal</span>
        </TypographyComp>
      </BoxComponent>

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
            cursor: "default",

            "& .MuiSlider-rail": {
              backgroundColor: "rgba(240, 240, 240, 1)",
              opacity: 1,
            },
          }}
          // disableSwap
          value={isStatic ? defaultValue : value}
          min={minVal}
          max={maxVal}
          onChange={handleChange}
          aria-label="Donation-Progress"
          valueLabelDisplay="on"
          valueLabelFormat={(value) => valueLabelFormat(value, minVal, maxVal)}
          showBall={false}
          campaignView
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
              //
              zIndex: 1,
              pointerEvents: "none",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          >
            <Animate
              animationData={dotsIcon}
              loop={false}
              onComplete={() => setShowAnimation(false)} // Set showAnimation to false when the animation completes
            />
          </div>
        ) : null}
        {recentSupportersCount > 0 ? (
          <BoxComponent sx={{ display: "flex", justifyContent: "center" }}>
            <TypographyComp>
              {recentSupportersCount}{" "}
              <span style={{ color: "#a1a1a8" }}>
                {recentSupportersCount === 1 ? "supporter" : "supporters"}
              </span>
            </TypographyComp>
          </BoxComponent>
        ) : null}
        {status === "pending-approval" ? (
          <BoxComponent sx={{ display: "flex", justifyContent: "center" }}>
            <TypographyComp>The campaign is under review</TypographyComp>
          </BoxComponent>
        ) : null}
      </StackComponent>
    </>
  );
};

NewDonationProgressBar.propTypes = {
  currency: PropTypes.string,
  defaultValue: PropTypes.number,
  getValue: PropTypes.func,
  isStatic: PropTypes.bool,
  maxVal: PropTypes.number,
  minVal: PropTypes.number,
  small: PropTypes.bool,
  recurringDonation: PropTypes.bool,
  isLoading: PropTypes.bool,
  isAnimation: PropTypes.bool,
  oneTimeDonation: PropTypes.any,
  recentSupportersCount: PropTypes.any,
};

export default NewDonationProgressBar;
