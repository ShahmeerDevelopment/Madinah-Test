"use client";

import { postDonationFeedback } from "@/api/update-api-service";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import DonationTemplate from "@/components/templates/donationTemplate/DonationTemplate";
import { resetDonationState } from "@/store/slices/donationSlice";
import { createSearchParams } from "@/utils/helpers";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const DonationFeedback = ({ activeStep, setActiveStep, setCurrentIndex }) => {
  const [donationFeedback, setDonationFeedback] = useState("");
  const MAX_CHARS = 5000;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef(pathname);

  // Build query object from searchParams for compatibility
  const query = useMemo(() => {
    const obj = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  const paymentType = "credit_card";

  const donation = useSelector((state) => state.donation);
  const successDonationValues = useSelector(
    (state) => state.successDonation.successDonationValues,
  );
  const yourDonationData = useSelector(
    (state) => state.successDonation.yourDonationData,
  );

  const randomToken = useSelector((state) => state.donation.randomToken);
  const hasUrlChanged = useRef(false);
  const dispatch = useDispatch();
  const feedbackTokens = useSelector(
    (state) => state.successDonation.feedbackTokens,
  );

  // App Router: Track route changes via pathname instead of router.events
  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      hasUrlChanged.current = true;
      dispatch(resetDonationState());
      toast.dismiss();
      previousPathRef.current = pathname;
    }
    return () => {
      if (hasUrlChanged.current) {
        dispatch(resetDonationState());
      }
      toast.dismiss();
    };
  }, [pathname, dispatch]);

  const handleFeedbackChange = (e) => {
    const value = e.target.value.slice(0, MAX_CHARS); // This ensures text is trimmed at MAX_CHARS
    setDonationFeedback(value);
  };

  const nextButtonHandler = async () => {
    // Preserve all existing URL parameters
    const existingParams = query;

    const persistDonationSuccessSnapshot = () => {
      if (typeof window === "undefined") return;
      try {
        const snapshot = {
          v: 1,
          ts: Date.now(),
          successDonationValues: successDonationValues || {},
          yourDonationData: yourDonationData || {},
        };
        window.sessionStorage.setItem(
          "madinah_donation_success_snapshot",
          JSON.stringify(snapshot),
        );
      } catch {
        // ignore
      }
    };

    if (donationFeedback) {
      const res = await postDonationFeedback(feedbackTokens, donationFeedback);
      const result = res?.data;
      if (result.success) {
        const route = createSearchParams(
          {
            type: paymentType,
            email: donation?.cardHolderName?.email,
            ...existingParams, // Spread all existing parameters
          },
          "/donation-success",
          randomToken, // Pass campaign ID as path parameter
        );
        persistDonationSuccessSnapshot();
        router.push(route);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      const route = createSearchParams(
        {
          type: paymentType,
          email: donation?.cardHolderName?.email,
          ...existingParams, // Spread all existing parameters
        },
        "/donation-success",
        randomToken, // Pass campaign ID as path parameter
      );
      persistDonationSuccessSnapshot();
      router.push(route);
    }
    // postPaymentApi();
  };

  return (
    <DonationTemplate
      setActiveStep={setActiveStep}
      activeStep={activeStep}
      setCurrentIndex={setCurrentIndex}
      heading="Additional Information"
      newDonation
      isSubmitButton={false}
      feedbackPage
      disableBack
    >
      {/* <ThreeDSecureAuthentication isLoading={is3dLoading}>
        <div
          style={{
            height: is3d && is3dDisplayMode === "inline" ? "400px" : 0,
          }}
          id="my-container"
        />
      </ThreeDSecureAuthentication> */}
      <BoxComponent>
        <TypographyComp sx={{ fontSize: "15px", fontWeight: 500 }}>
          Help us with out efforts, let us know why you donated to our cause.{" "}
          <span style={{ color: "#697484" }}>(optional)</span>
        </TypographyComp>
        <TextFieldComp
          isRequired
          id="feedback"
          name="feedback"
          placeholder="Your feedback"
          sx={{ borderRadius: "10px", marginTop: "10px" }}
          value={donationFeedback}
          onChange={handleFeedbackChange}
          fullWidth
          helperText={`${donationFeedback.length}/${MAX_CHARS} characters`}
          inputProps={{
            maxLength: MAX_CHARS,
          }}
        />
      </BoxComponent>
      <BoxComponent
        sx={{
          marginTop: "20px",
          gap: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ButtonComp
          sx={{ width: "100%", borderRadius: "10px" }}
          onClick={nextButtonHandler}
        >
          Continue
        </ButtonComp>
      </BoxComponent>
    </DonationTemplate>
  );
};

export default DonationFeedback;
