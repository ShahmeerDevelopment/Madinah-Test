"use client";

/**
 * CampaignRightSideWrapper - Client wrapper to handle dynamic styling
 *
 * This wrapper handles the dynamic styling based on payment form visibility
 * and wraps the DonationPaymentWrapper to receive state updates.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import StackComponent from "@/components/atoms/StackComponent";
import DonationPaymentWrapper from "./DonationPaymentWrapper.client";

const styles = {
  rightSide: {
    width: "100%",
    position: "relative",
    maxHeight: { xs: "none", md: "calc(100vh - 112px)" },
    borderRadius: "32px",
    WebkitOverflowScrolling: "touch",
    flexShrink: 0,
    scrollbarGutter: "stable",
    MsOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  rightSideWithPayment: {
    width: "100%",
    position: "relative",
    maxHeight: { xs: "none", md: "calc(100vh - 112px)" },
    minHeight: { xs: "auto", md: "600px" },
    overflowY: { xs: "visible", md: "auto" },
    borderRadius: "32px",
    WebkitOverflowScrolling: "touch",
    flexShrink: 0,
    scrollbarGutter: "stable",
    MsOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
};

export default function CampaignRightSideWrapper({
  children,
  hasGivingLevels,
}) {
  const [isPaymentActive, setIsPaymentActive] = useState(false);
  const containerRef = useRef(null);

  const handlePaymentStateChange = useCallback((isActive) => {
    setIsPaymentActive(isActive);
  }, []);

  // Scroll the right side container to top when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Determine which style to use
  const containerStyle = isPaymentActive
    ? styles.rightSideWithPayment
    : {
        ...styles.rightSide,
        overflowY: hasGivingLevels ? { xs: "visible", md: "auto" } : "visible",
      };

  return (
    <StackComponent ref={containerRef} direction="column" sx={containerStyle}>
      <DonationPaymentWrapper
        onPaymentStateChange={handlePaymentStateChange}
      >
        {children}
      </DonationPaymentWrapper>
    </StackComponent>
  );
}
