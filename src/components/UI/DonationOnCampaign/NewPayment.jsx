"use client";

import React, { useEffect, useState, useMemo, Activity } from "react";
import PageTransitionWrapper from "@/components/atoms/PageTransitionWrapper";
import StepperComp from "@/components/molecules/StepperComp/StepperComp";
import { NEW_DONATION_STEPPER } from "@/config/constant";
import { useSearchParams, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import DonationTemplate from "@/components/templates/donationTemplate/DonationTemplate";
import PaymentSummary from "./paymentSummary/PaymentSummary";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import BlockingNavigationModal from "./blockingNavigationModal/BlockingNavigationModal";
import NewGivingLevels from "./givingLevels/NewGivingLevels";
import RecurringDonationPage from "./recurringDonationPage";
import NewPaymentMethod from "./paymentMethod/NewPaymentMethod";
import DonationCardInfo from "./donationCardInfo";
import DonationFeedback from "./donationFeedback";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const NewPayment = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const donation = useSelector((state) => state.donation);
  const { isSmallScreen } = useResponsiveScreen();
  const [activeStep, setActiveStep] = useState(0);
  const [cardToken] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false); // Add this state
  const [is3dError, setIs3dError] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // Ref to ensure redirect check only happens once (prevent double execution in Strict Mode)
  const hasCheckedRedirectRef = React.useRef(false);

  // Check if user is navigating back to donation page after clicking "Not Today"
  // If so, redirect them to the campaign page immediately
  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasCheckedRedirectRef.current) return;
    hasCheckedRedirectRef.current = true;

    const intentionalDonation = sessionStorage.getItem("__intentionalDonation");
    const leavingFlag = sessionStorage.getItem("__skipDonationPage");
    const targetUrl = sessionStorage.getItem("__skipDonationPageTarget");

    // CRITICAL: Check intentional donation flag FIRST (sessionStorage only)
    // URL params persist in history, so we only trust sessionStorage which gets cleared immediately
    if (intentionalDonation === "true") {
      sessionStorage.removeItem("__intentionalDonation");
      sessionStorage.removeItem("__skipDonationPage");
      sessionStorage.removeItem("__skipDonationPageTarget");
      window.__blockBackToDonation = false;
      return; // Don't redirect - user intentionally navigated here
    }

    // Only redirect if skip flags are set AND intentional donation flag was NOT present
    if (leavingFlag === "true" && targetUrl) {
      // Clear flags and redirect
      sessionStorage.removeItem("__skipDonationPage");
      sessionStorage.removeItem("__skipDonationPageTarget");
      window.__blockBackToDonation = false;
      window.location.replace(targetUrl);
      return;
    }
  }, []);

  // Track previous campaign ID to detect campaign changes
  const previousCampaignIdRef = React.useRef(null);
  // Track if this is a fresh mount (not a re-render)
  const isFreshMountRef = React.useRef(true);

  // Build query object from searchParams for compatibility
  const query = useMemo(() => {
    const obj = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  // Get slug from pathname for App Router
  const slugFromPath = useMemo(() => {
    const segments = pathname?.split("/").filter(Boolean) || [];
    return segments.length > 0 ? segments : undefined;
  }, [pathname]);

  const id = isSmallScreen ? query?.id : slugFromPath?.[0] || query?.id;
  const levelIndex = query?.levelIndex;

  const activeStepRef = React.useRef(activeStep);

  // Reset activeStep when campaign ID changes (for mobile navigation without page refresh)
  useEffect(() => {
    if (
      previousCampaignIdRef.current !== null &&
      previousCampaignIdRef.current !== id
    ) {
      setActiveStep(0);
      setCurrentIndex(0);
      setIsPaymentProcessing(false);
      setIs3dError(false);
      setOpen(false);
    }
    previousCampaignIdRef.current = id;
  }, [id]);

  // Reset state on fresh mount (handles same campaign navigation)
  useEffect(() => {
    if (isFreshMountRef.current) {
      // Always reset to step 0 on fresh mount
      setActiveStep(0);
      setCurrentIndex(0);
      setIsPaymentProcessing(false);
      setIs3dError(false);
      setOpen(false);
      isFreshMountRef.current = false;
    }

    return () => {
      // Mark as fresh mount for next time component mounts
      isFreshMountRef.current = true;
    };
  }, []);

  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep, id]);

  // Add initial history entry on mount to enable back button interception
  useEffect(() => {
    // Mark the current history state as donation page
    window.history.replaceState(
      { ...window.history.state, isDonationPage: true, step: 0 },
      "",
    );
    // Add one entry so back button triggers popstate
    window.history.pushState({ isDonationPage: true, step: 0 }, "");
  }, []); // Empty deps - only runs once on mount

  useEffect(() => {
    const handlePopState = (event) => {
      // Check if we're intentionally leaving the donation page
      if (window.__leavingDonationPage) {
        return;
      }

      const currentStep = activeStepRef.current;

      // If on feedback step (step 5), refresh the page instead of going back
      if (currentStep === 5) {
        window.location.reload();
        return;
      }

      if (currentStep === 0) {
        // On step 0, show modal and push state to keep user here
        event.preventDefault();
        setOpen(true);
        // Push state so modal can be dismissed with back button
        window.history.pushState(
          { isDonationPage: true, modalOpen: true, step: 0 },
          "",
        );
      } else {
        // On other steps, just go back to previous step
        event.preventDefault();

        // Mirror the forward navigation logic - skip recurring page if:
        // 1. isRecurring is true AND has a selected box (recurring box was selected)
        // 2. Campaign doesn't support recurring donations at all
        // 3. Promote recurring is false (recurring page should be skipped)
        const shouldSkipRecurringPage =
          currentStep === 2 &&
          ((donation?.isRecurring && donation?.selectedBoxData) ||
            !donation?.campaignDetails?.isRecurringDonation ||
            !donation?.campaignDetails?.isPromoteRecurringDonations);

        if (shouldSkipRecurringPage) {
          setActiveStep((prevStep) => {
            setCurrentIndex(prevStep - 2);
            return prevStep - 2;
          });
        } else {
          setActiveStep((prevStep) => {
            setCurrentIndex(prevStep - 1);
            return prevStep - 1;
          });
        }

        // Add a dummy history entry to keep user on donation page
        window.history.pushState(
          { isDonationPage: true, step: currentStep - 1 },
          "",
        );
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    is3dError,
    donation?.campaignDetails?.isRecurringDonation,
    donation?.campaignDetails?.isPromoteRecurringDonations,
    donation?.isRecurring,
    donation?.selectedBoxData,
  ]);

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
          STEPPER_DATA={NEW_DONATION_STEPPER}
          isCardResponsive={true}
          isStepperResponsive={true}
          overflowProp="visible"
          newDonation
        >
          {/* Using React Activity component for keep-alive functionality */}
          <Activity mode={activeStep === 0 ? "visible" : "hidden"}>
            <PageTransitionWrapper uniqueKey={0}>
              <NewGivingLevels
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setCurrentIndex={setCurrentIndex}
                randomToken={id}
                levelIndex={levelIndex}
              />
            </PageTransitionWrapper>
          </Activity>

          <Activity mode={activeStep === 1 ? "visible" : "hidden"}>
            <PageTransitionWrapper uniqueKey={1}>
              <RecurringDonationPage
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setCurrentIndex={setCurrentIndex}
              />
            </PageTransitionWrapper>
          </Activity>
          <Activity mode={activeStep === 2 ? "visible" : "hidden"}>
            <PageTransitionWrapper uniqueKey={2}>
              <NewPaymentMethod
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setCurrentIndex={setCurrentIndex}
                // setCardToken={setCardToken}
              />
            </PageTransitionWrapper>
          </Activity>

          <Activity mode={activeStep === 3 ? "visible" : "hidden"}>
            <PageTransitionWrapper uniqueKey={3}>
              <DonationCardInfo
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setCurrentIndex={setCurrentIndex}
              />
            </PageTransitionWrapper>
          </Activity>

          <Activity mode={activeStep === 4 ? "visible" : "hidden"}>
            <PageTransitionWrapper uniqueKey={4}>
              <DonationFeedback
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setCurrentIndex={setCurrentIndex}
              />
            </PageTransitionWrapper>
          </Activity>

          {activeStep === 5 ? (
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

export default NewPayment;
