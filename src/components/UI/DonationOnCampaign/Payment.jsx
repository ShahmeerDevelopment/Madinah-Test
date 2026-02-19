"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageTransitionWrapper from "@/components/atoms/PageTransitionWrapper";
import StepperComp from "@/components/molecules/StepperComp/StepperComp";
import { DONATION_STEPPER } from "@/config/constant";
import GivingLevels from "./givingLevels/GivingLevels";
import { useSearchParams } from "next/navigation";
import PaymentMethod from "./paymentMethod/PaymentMethod";
import DonationTemplate from "@/components/templates/donationTemplate/DonationTemplate";
import PaymentSummary from "./paymentSummary/PaymentSummary";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import BlockingNavigationModal from "./blockingNavigationModal/BlockingNavigationModal";
import { getCookie } from "cookies-next";

const Payment = ({ donationIndex }) => {
  const searchParams = useSearchParams();

  // Build query object from searchParams for compatibility
  const query = useMemo(() => {
    const obj = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    // Handle slug from URL path
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      obj.slug = pathParts;
    }
    return obj;
  }, [searchParams]);

  const experimentalFeature = getCookie("abtesting");
  const [activeStep, setActiveStep] = useState(0);
  const [cardToken, setCardToken] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [is3dError, setIs3dError] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const id =
    experimentalFeature === "donation_version_1"
      ? query.slug?.[0]
      : query.slug?.[0];
  const levelIndex =
    experimentalFeature === "donation_version_1"
      ? donationIndex
      : donationIndex;

  // Check if user is navigating back to donation page after clicking "Not Today"
  // If so, redirect them to the campaign page immediately
  useEffect(() => {
    const leavingFlag = sessionStorage.getItem("__skipDonationPage");
    const targetUrl = sessionStorage.getItem("__skipDonationPageTarget");

    if (leavingFlag === "true" && targetUrl) {
      // Clear flags and redirect
      sessionStorage.removeItem("__skipDonationPage");
      sessionStorage.removeItem("__skipDonationPageTarget");
      window.location.replace(targetUrl);
      return;
    }
  }, []);

  useEffect(() => {
    // Initialize history with modal state
    window?.history?.replaceState({ modalOpened: true }, "");
    window?.history?.pushState({ modalOpened: false }, "");

    const handlePopState = (event) => {
      // Check if we're intentionally leaving the donation page
      if (window.__leavingDonationPage) {
        return;
      }

      // Check if we're on the payment summary step and had a 3DS error
      const isPaymentSummaryWith3dsError = activeStep === 2 && is3dError;

      if (event.state?.modalOpened && !isPaymentSummaryWith3dsError) {
        setOpen(true);
        // Prevent default back navigation
        window?.history?.pushState({ modalOpened: false }, "");
      } else if (isPaymentSummaryWith3dsError) {
        // If there was a 3DS error, we want to ensure the next back press shows the modal
        window?.history?.replaceState({ modalOpened: true }, "");
        window?.history?.pushState({ modalOpened: false }, "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [activeStep, is3dError]); // Add dependencies

  // Add effect to manage history state after 3DS error
  useEffect(() => {
    if (is3dError) {
      // Reset history state when 3DS error occurs
      window?.history?.replaceState({ modalOpened: true }, "");
      window?.history?.pushState({ modalOpened: false }, "");
    }
  }, [is3dError]);

  return (
    <>
      <div>
        <StepperComp
          activeStep={activeStep}
          currentIndex={currentIndex}
          STEPPER_DATA={DONATION_STEPPER}
          isCardResponsive={true}
          isStepperResponsive={true}
          overflowProp="visible"
        >
          {activeStep === 0 ? (
            <PageTransitionWrapper uniqueKey={activeStep}>
              <GivingLevels
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setCurrentIndex={setCurrentIndex}
                randomToken={id}
                levelIndex={levelIndex}
              />
            </PageTransitionWrapper>
          ) : activeStep === 1 ? (
            <PageTransitionWrapper uniqueKey={activeStep}>
              <PaymentMethod
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setCurrentIndex={setCurrentIndex}
                setCardToken={setCardToken}
              />
            </PageTransitionWrapper>
          ) : activeStep === 2 ? (
            <DonationTemplate
              heading="Donation Summary"
              isSubmitButton={false}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              setCurrentIndex={setCurrentIndex}
              disableBack={isPaymentProcessing} // Add this prop
            >
              <PaymentSummary
                cardToken={cardToken}
                setIsPaymentProcessing={setIsPaymentProcessing} // Pass this prop
                onError={setIs3dError}
              />
            </DonationTemplate>
          ) : null}
        </StepperComp>
        <ModalComponent
          open={open}
          onClose={handleClose}
          width={612}
          borderRadius="32px"
          padding="0px 32px 48px 32px"
          responsivePadding={"0px 16px 56px 16px"}
        >
          <BlockingNavigationModal id={id} setOpen={setOpen} />
        </ModalComponent>
      </div>
    </>
  );
};

export default Payment;
