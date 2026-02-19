"use client";

import React, { forwardRef, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { theme } from "@/config/customTheme";
import { BOX_SHADOW_STYLE } from "@/config/constant";
import BackButton from "@/components/atoms/createCampaigns/BackButton";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
// import { getCookie } from "cookies-next";
import { scrollToTop } from "@/utils/helpers";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip"; // Added MUI components
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { useSearchParams } from "next/navigation";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    PopperProps={{ disablePortal: true }}
  />
))(({ isSmallScreen }) => ({
  "& .MuiTooltip-arrow": {
    "&::before": {
      backgroundColor: "white",
    },
  },
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#fff",
    color: "#222832",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
    // height: tipCheckbox ? "70px" : "60px",
    lineHeight: "20px",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 400,
    marginTop: "0px !important",
    width: isSmallScreen ? "250px !important" : "370px !important", // force the width
    maxWidth: "none !important", // override default maxWidth
  },
}));

const DonationTemplate = forwardRef(
  (
    {
      children,
      heading = "Heading",
      isSubmitButton = true,
      onClickHandler,
      isContinueButtonDisabled,
      activeStep,
      setActiveStep,
      setCurrentIndex,
      disableBack = false,
      newDonation = false,
      selectedDonationType = false,
      isRecurring,
      feedbackPage = false,
      // isGivingLevel = false, // Add new prop
      customInputField = null, // Add new prop for custom input field
      hasGivingLevels = true,
    },
    ref,
  ) => {
    // const experimentalFeature = getCookie("abtesting");
    const { isSmallScreen } = useResponsiveScreen();
    const searchParams = useSearchParams();

    // Check if this is widget mode
    const isWidgetMode =
      searchParams.get("widget") === "true" &&
      searchParams.get("embedded") === "true";

    // Separate states for each tooltip
    const [showTooltipSecure, setShowTooltipSecure] = useState(false);
    const [showTooltipTax, setShowTooltipTax] = useState(false);
    const [showTooltipCancel, setShowTooltipCancel] = useState(false);
    const [isButtonSticky] = useState(true);
    const tooltipSectionRef = useRef(null);
    const containerRef = useRef(null);
    const tooltipSecureRef = useRef(null);
    const tooltipTaxRef = useRef(null);
    const tooltipCancelRef = useRef(null);

    // Determine if the button should be sticky based on screen size, active step, and giving levels
    const shouldBeSticky =
      (isSmallScreen || (newDonation && activeStep === 0)) && hasGivingLevels;

    // Global click to close tooltips if clicking outside togglers
    useEffect(() => {
      const handleClickOutside = (e) => {
        // Don't close if clicking on any tooltip trigger
        if (
          tooltipSecureRef.current?.contains(e.target) ||
          tooltipTaxRef.current?.contains(e.target) ||
          tooltipCancelRef.current?.contains(e.target)
        ) {
          return;
        }
        setShowTooltipSecure(false);
        setShowTooltipTax(false);
        setShowTooltipCancel(false);
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
      if (typeof window !== "undefined") {
        scrollToTop();
      }
    }, []);

    // Add scroll event listener to detect when tooltip section is visible or when at bottom of page
    useEffect(() => {
      const handleScroll = () => {
        // Only check scroll conditions if we should be sticky based on screen size and step
        // if (!shouldBeSticky) {
        //   setIsButtonSticky(false);
        //   return;
        // }
        // if (tooltipSectionRef.current) {
        //   const tooltipRect = tooltipSectionRef.current.getBoundingClientRect();
        //   // Check if scrolled to tooltip section
        //   if (tooltipRect.top < window.innerHeight && tooltipRect.bottom >= 0) {
        //     setIsButtonSticky(false);
        //     return;
        //   }
        // }
        // Check if scrolled to bottom of the page
        // const scrollHeight = document.documentElement.scrollHeight;
        // const scrollTop = window.scrollY || document.documentElement.scrollTop;
        // const clientHeight = document.documentElement.clientHeight;
        // If we're at the bottom of the page (with a small buffer of 20px)
        // const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
        // setIsButtonSticky(!isAtBottom);
      };

      window.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    }, [shouldBeSticky]); // Added shouldBeSticky as dependency

    return (
      <BoxComponent
        ref={(node) => {
          // Assign to both refs
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          containerRef.current = node;
        }}
        component="section"
        sx={{
          background: theme.palette.primary.light,
          boxShadow: BOX_SHADOW_STYLE,
          width: "100%",
          height: "100%",
          borderRadius: newDonation ? "0px" : "32px",
          mt: newDonation ? (isWidgetMode ? "50px" : 0) : 2,
          padding: {
            xs: newDonation ? "32px 32px 40px 32px" : "32px 16px 40px 16px", // Added bottom padding to account for sticky button
            sm: "32px 32px 40px 32px",
          },
          position: "relative",
        }}
      >
        {!feedbackPage ? (
          <BackButton
            isStepperLocal={true}
            activeStep={activeStep}
            setCurrentIndex={setCurrentIndex}
            setActiveStep={setActiveStep}
            disabled={disableBack}
            newDonation={newDonation}
            isRecurring={isRecurring}
          />
        ) : null}

        <CampaignHeading
          sx={{
            mt: newDonation ? 0 : 2,
            fontSize: newDonation ? "22px" : "32px",
            fontWeight: newDonation ? 600 : 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            lineHeight: newDonation ? "30px" : "38px",
          }}
        >
          {heading === "Secure donation" && (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginTop: "-3px" }}
            >
              <path
                d="M20.4098 6.95994V8.78994C20.4098 9.42994 20.1098 10.0299 19.5898 10.3999L8.58984 18.4599C7.87984 18.9799 6.90984 18.9799 6.20984 18.4499L4.76984 17.3699C4.11984 16.8799 3.58984 15.8199 3.58984 15.0099V6.95994C3.58984 5.83994 4.44984 4.59994 5.49984 4.20994L10.9698 2.15994C11.5398 1.94994 12.4598 1.94994 13.0298 2.15994L18.4998 4.20994C19.5498 4.59994 20.4098 5.83994 20.4098 6.95994Z"
                fill="#6363E6"
              />
              <path
                d="M18.8196 12.3399C19.4796 11.8599 20.4096 12.3299 20.4096 13.1499V15.0299C20.4096 15.8399 19.8796 16.8899 19.2296 17.3799L13.7596 21.4699C13.2796 21.8199 12.6396 21.9999 11.9996 21.9999C11.3596 21.9999 10.7196 21.8199 10.2396 21.4599L9.40962 20.8399C8.86962 20.4399 8.86962 19.6299 9.41962 19.2299L18.8196 12.3399Z"
                fill="#6363E6"
              />
            </svg>
          )}
          {heading}
        </CampaignHeading>
        {children}
        {isSubmitButton ? (
          <BoxComponent
            sx={{
              position:
                isButtonSticky && shouldBeSticky && activeStep !== 2
                  ? "sticky"
                  : "static", // Always sticky if isButtonSticky is true
              bottom: 0,
              left: isSmallScreen ? 0 : "auto",
              right: isSmallScreen ? 0 : "auto",
              padding: isSmallScreen ? "16px" : "16px 2px 0 0",
              background: "white",
              boxShadow:
                isButtonSticky && shouldBeSticky && activeStep !== 2
                  ? "0px -4px 10px rgba(0, 0, 0, 0.1)"
                  : "none",
              width: "100%",
              zIndex: 1000,
              marginTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxWidth: isSmallScreen ? "100%" : "100%", // Full width on all devices
              boxSizing: "border-box",
              borderRadius: "10px",
            }}
          >
            {customInputField &&
              isButtonSticky &&
              shouldBeSticky &&
              hasGivingLevels && (
                <BoxComponent sx={{ padding: "0 10px" }}>
                  {customInputField}
                </BoxComponent>
              )}
            <BoxComponent sx={{ padding: "0 10px" }}>
              <SubmitButton
                sx={{
                  mt: { xs: 2, sm: 0 },
                  width: { sm: newDonation ? "100%" : "auto" },
                  maxWidth: newDonation && isSmallScreen ? "600px" : "none",
                  margin: newDonation && isSmallScreen ? "0 auto" : "0 auto",
                }}
                isContinueButtonDisabled={isContinueButtonDisabled}
                onClick={onClickHandler}
                borderRadius={newDonation ? "10px" : "48px"}
                newDonation={newDonation}
              >
                {newDonation && selectedDonationType
                  ? selectedDonationType === "monthly"
                    ? "Choose frequency"
                    : "Donate"
                  : "Continue"}
              </SubmitButton>
            </BoxComponent>
          </BoxComponent>
        ) : null}
        {newDonation ? (
          <BoxComponent
            ref={tooltipSectionRef}
            sx={{
              marginTop: "32px",
              height: "auto",
              // height: isSmallScreen
              //   ? activeStep === 0
              //     ? "300px"
              //     : activeStep === 1
              //       ? "220px"
              //       : activeStep === 2
              //         ? "150px"
              //         : activeStep === 3
              //           ? "150px"
              //           : activeStep === 4
              //             ? "250px"
              //             : activeStep === 5
              //               ? "400px"
              //               : "50px"
              //   : "auto", // default height for non-small screens
            }}
          >
            <hr />
            <BoxComponent sx={{ display: "flex", gap: "20px" }}>
              <BoxComponent sx={{ marginTop: "16px" }}>
                <CustomTooltip
                  isSmallScreen={isSmallScreen}
                  open={showTooltipSecure}
                  title={
                    <div style={{ maxWidth: "300px" }}>
                      <strong>Is my donation secure?</strong>
                      <p>
                        Yes, we use industry-standard SSL technology to keep
                        your information secure.
                      </p>
                      <p>
                        We partner with Stripe/Recurly, the industry&apos;s
                        established payment processor trusted by some of the
                        world&apos;s largest companies.
                      </p>
                      <p>
                        Your sensitive financial information never touches our
                        servers. We send all data directly to
                        Stripe&apos;s/Recurly&apos;s PCI-compliant servers
                        through SSL.
                      </p>
                    </div>
                  }
                  arrow
                >
                  <span
                    ref={tooltipSecureRef}
                    data-tooltip-trigger
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltipSecure((prev) => !prev);
                      setShowTooltipTax(false);
                      setShowTooltipCancel(false);
                    }}
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "#697484",
                      fontSize: "13px",
                      fontWeight: 400,
                    }}
                  >
                    Is my donation secure?
                  </span>
                </CustomTooltip>
              </BoxComponent>
              <BoxComponent sx={{ marginTop: "16px" }}>
                <CustomTooltip
                  isSmallScreen={isSmallScreen}
                  open={showTooltipTax}
                  title={
                    <div style={{ maxWidth: "300px" }}>
                      <strong>Is this donation tax-deductible?</strong>
                      <p>
                        Your gift is tax deductible as per your local
                        regulations, as we are a tax exempt organization.
                      </p>
                      <p>
                        We will email you a donation receipt. Please keep this,
                        as it is your official record to claim this donation as
                        a tax deduction.
                      </p>
                    </div>
                  }
                  arrow
                >
                  <span
                    ref={tooltipTaxRef}
                    data-tooltip-trigger
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltipTax((prev) => !prev);
                      setShowTooltipSecure(false);
                      setShowTooltipCancel(false);
                    }}
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "#697484",
                      fontSize: "13px",
                      fontWeight: 400,
                    }}
                  >
                    Is this donation tax-deductible?
                  </span>
                </CustomTooltip>
              </BoxComponent>
            </BoxComponent>
            <BoxComponent sx={{ marginTop: "10px" }}>
              <CustomTooltip
                isSmallScreen={isSmallScreen}
                open={showTooltipCancel}
                title={
                  <div style={{ maxWidth: "300px" }}>
                    <strong>Can I cancel my recurring donation?</strong>
                    <p>
                      Of course. You always remain in full control of your
                      recurring donation, and you’re free to change or cancel it
                      at any time.
                    </p>
                  </div>
                }
                arrow
              >
                <span
                  ref={tooltipCancelRef}
                  data-tooltip-trigger
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltipCancel((prev) => !prev);
                    setShowTooltipSecure(false);
                    setShowTooltipTax(false);
                  }}
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "#697484",
                    fontSize: "13px",
                    fontWeight: 400,
                  }}
                >
                  Can I cancel my recurring donation?
                </span>
              </CustomTooltip>
            </BoxComponent>
          </BoxComponent>
        ) : null}
      </BoxComponent>
    );
  },
);

DonationTemplate.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string,
  isSubmitButton: PropTypes.bool,
  onClickHandler: PropTypes.func,
  isContinueButtonDisabled: PropTypes.bool,
  setActiveStep: PropTypes.func,
  setCurrentIndex: PropTypes.func,
  activeStep: PropTypes.number,
  disableBack: PropTypes.bool,
  newDonation: PropTypes.bool,
  selectedDonationType: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isRecurring: PropTypes.bool,
  feedbackPage: PropTypes.bool,
  customInputField: PropTypes.node,
  hasGivingLevels: PropTypes.bool,
};

DonationTemplate.displayName = "DonationTemplate";

export default DonationTemplate;
