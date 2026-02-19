"use client";

import DonationTemplate from "@/components/templates/donationTemplate/DonationTemplate";
import MemoizedPersonalInfoDonationForm from "./PersonalInfoDonationForm";
import { useDispatch } from "react-redux";
import {
  cardHolderNameHandler,
  donationCommentHandler,
  publicVisibilityHandler,
  resetDonationState,
} from "@/store/slices/donationSlice";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { SignUpSchema } from "./FormFields/validation";
import { useEffect, useRef, useState } from "react";
import { generateRandomToken, getUTMParams } from "@/utils/helpers";
import dayjs from "dayjs";
import { getCookie } from "cookies-next";
import { handlePosthog, savePixelLogs } from "@/api/post-api-services";
import { getInitiateCheckoutFbTags } from "@/api/get-api-services";
import toast from "react-hot-toast";
import { emailValidation } from "@/api/api-services";
import { usePathname } from "next/navigation";
// import posthog from "posthog-js";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// import posthog from "posthog-js";

const PersonalInfoDonation = ({
  activeStep,
  setActiveStep,
  setCurrentIndex,
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationComment, setDonationComment] = useState(
    useSelector((state) => state.donation.donationComment),
  );
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const isLogin = getCookie("token");
  const isRecurring = useSelector((state) => state.donation.isRecurring);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const cardNumberRedux = useSelector(
    (state) => state.donation?.creditCardDetails?.number,
  );
  const campaignPixelId = useSelector(
    (state) => state?.campaign?.campaignerId?.pixelId,
  );
  const expiryDateRexux = useSelector(
    (state) => state.donation?.creditCardDetails?.expiryDate,
  );
  const hasUrlChanged = useRef(false); // Track if the URL has changed
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);

  const cvv = useSelector((state) => state.donation?.creditCardDetails?.cvv);
  const selectedBoxData = useSelector(
    (state) => state.donation.selectedBoxData,
  );
  const donationValues = useSelector((state) => state.donation.donationValues);
  const campaignDetails = useSelector(
    (state) => state.donation?.campaignDetails,
  );
  const campaignId = useSelector((state) => state.donation.campaignId);

  const utmParameters = useSelector((state) => state.utmParameters);
  const fbclid = utmParameters.fbclid;
  // Format fbc as "fb.subdomainIndex.creationTime.fbclid"
  const fbc = fbclid ? `fb.1.${Date.now()}.${fbclid}` : null;
  const event_month = dayjs().format("MMMM");
  const event_day = dayjs().format("dddd");
  const event_hour = dayjs().format("H-") + (parseInt(dayjs().format("H")) + 1);
  const traffic_source =
    utmParameters?.utmMedium === "email" || utmParameters?.utmMedium === "Email"
      ? ""
      : "";
  const content_ids = [campaignId];
  const content_type = "product";
  const user_roles = "guest";
  const url = window?.location?.href;
  const fbpData = getCookie("_fbp");
  const experimentalFeature = getCookie("abtesting");
  const campaignVersion = getCookie("campaign_testing");
  const experimentKey = localStorage.getItem("experimentKey");
  const variationKey = localStorage.getItem("variationKey");
  const externalId = getCookie("externalId");

  const nameOnCard = useSelector(
    (state) => state.donation?.creditCardDetails?.nameOnCard,
  );
  const cardFirstName = useSelector(
    (state) => state.donation?.cardHolderName?.firstName,
  );
  const cardLastName = useSelector(
    (state) => state.donation?.cardHolderName?.lastName,
  );
  const cardEmail = useSelector(
    (state) => state.donation?.cardHolderName?.email,
  );

  const cardPhone = useSelector(
    (state) => state.donation?.cardHolderName?.phoneNumber,
  );
  const donation = useSelector((state) => state.donation);

  const formik = useFormik({
    initialValues: {
      firstName: isLogin ? userDetails?.firstName || "" : cardFirstName || "",
      lastName: isLogin ? userDetails?.lastName || "" : cardLastName || "",
      email: isLogin ? userDetails?.email || "" : cardEmail || "",
      phone: isLogin ? userDetails?.phoneNumber : cardPhone,
      donateAnon: donation?.publicVisibility
        ? donation?.publicVisibility
        : false,
      cardNumber: cardNumberRedux || "",
      expiryDate: expiryDateRexux || "",
      cvv: cvv || "",
      nameOnCard: nameOnCard || "",
    },
    validationSchema: SignUpSchema,
  });

  const isFormValid =
    formik.values.firstName &&
    formik.values.lastName &&
    formik.values.email &&
    !formik.errors.firstName &&
    !formik.errors.lastName &&
    !formik.errors.email &&
    (!donation?.campaignDetails?.isCommentAllowed || donationComment);

  const nextButtonHandler = async () => {
    const userId = getCookie("distinctId");
    const utmParams = getUTMParams(window.location.href);
    const payload = {
      distinctId: userId,
      event: "Personal Info Added in Donation Flow",
      properties: {
        $current_url: window?.location?.href,
        // ...posthog?.persistence?.props,
        ...utmParams,
      },
    };
    if (parsedConsent?.analytics || !consentCookie) {
      enhancedHandlePosthog(
        handlePosthog,
        payload,
        campaignDetails?.title || "Campaign Page",
      );
    }
    setIsSubmitting(true);
    const cardHolder = {
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
      email: formik.values.email,
      phoneNumber: formik.values.phone,
    };

    try {
      // Validate email before proceeding
      const payload = {
        email: formik.values.email,
      };

      const emailValidationResponse = await emailValidation(payload);
      const validationResult = emailValidationResponse?.data;

      if (validationResult && validationResult.success) {
        // Only proceed after successful email validation
        dispatch(cardHolderNameHandler(cardHolder));
        dispatch(publicVisibilityHandler(formik.values.donateAnon));
        setActiveStep((prevActiveStep) => {
          setCurrentIndex(prevActiveStep);
          return prevActiveStep + 1;
        });
      } else {
        toast.error(
          validationResult?.message || "Invalid email. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error during email validation:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // App Router: Track route changes via pathname instead of router.events
  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      hasUrlChanged.current = true;
      dispatch(resetDonationState());
      previousPathRef.current = pathname;
    }
    return () => {
      if (hasUrlChanged.current) {
        dispatch(resetDonationState());
      }
    };
  }, [pathname, dispatch]);

  useEffect(() => {
    const eventId = generateRandomToken("a", 5) + dayjs().unix();

    if (window.fbq) {
      const fbqData = {
        value: selectedBoxData
          ? selectedBoxData.amount
          : donationValues?.totalAmount,
        currency: campaignDetails?.amountCurrency,
        campaignName: campaignDetails?.title,
        category: campaignDetails?.categoryId?.name,
        givingLevel: selectedBoxData?.title,
      };

      // Prepare UTM parameters and add only valid ones
      const utmParams = {
        utmSource: utmParameters?.utmSource,
        utmMedium: utmParameters?.utmMedium,
        utmCampaign: utmParameters?.utmCampaign,
        utmTerm: utmParameters?.utmTerm,
        utmContent: utmParameters?.utmContent,
        referral: utmParameters?.referral,
        src: utmParameters?.src,
        fbc,
        event_month,
        event_day,
        event_hour,
        traffic_source,
        content_ids,
        content_type,
        user_roles,
        url,
      };

      // Filter and append valid UTM parameters to fbqData
      Object.entries(utmParams).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          value !== "null" &&
          value !== "undefined"
        ) {
          fbqData[key] = value;
        }
      });
      if (campaignPixelId) {
        window?.fbq(
          "trackSingle",
          campaignPixelId,
          "InitiateCheckout",
          fbqData,
          {
            eventID: eventId,
            fbp: fbpData,
            external_id: externalId,
          },
        );
      }

      window.fbq("track", "InitiateCheckout", fbqData, {
        eventID: eventId,
        fbp: fbpData,
        external_id: externalId,
      });

      const payload = {
        campaignId: campaignDetails?._id,
        totalAmount: fbqData.value,
        currency: fbqData.currency,
        givingLevelTitle: fbqData.givingLevel,
        utmSource: fbqData.utmSource,
        utmMedium: fbqData.utmMedium,
        utmCampaign: fbqData.utmCampaign,
        utmTerm: fbqData.utmTerm,
        utmContent: fbqData.utmContent,
        referral: fbqData.referral,
        src: fbqData.src,
        fbc,
        event_month,
        event_day,
        event_hour,
        traffic_source,
        content_ids,
        content_type,
        user_roles,
        url,
        eventId: eventId,
        fbp: fbpData,
        externalId: externalId,
        version: experimentalFeature,
        campaignVersion,
        experimentKey,
        variationKey,
      };

      const pixelPayload = {
        campaignId: campaignDetails?._id,
        totalAmount: fbqData.value,
        currency: fbqData.currency,
        givingLevelTitle: fbqData.givingLevel,
        utmSource: fbqData.utmSource,
        utmMedium: fbqData.utmMedium,
        utmCampaign: fbqData.utmCampaign,
        utmTerm: fbqData.utmTerm,
        utmContent: fbqData.utmContent,
        referral: fbqData.referral,
        src: fbqData.src,
        fbc,
        event_month,
        event_day,
        event_hour,
        traffic_source,
        content_ids,
        content_type,
        user_roles,
        url,
        eventId: eventId,
        fbp: fbpData,
        externalId: externalId,
        eventName: "InitiateCheckout",
      };

      savePixelLogs(pixelPayload, campaignDetails?._id);
      getInitiateCheckoutFbTags(payload).catch((err) =>
        console.error(err, "Initiate checkout script did not work"),
      );
    }
  }, []);

  const handleCommentChange = (e) => {
    const value = e.target.value; // This ensures text is trimmed at MAX_CHARS
    setDonationComment(value);
    dispatch(donationCommentHandler(value));
  };

  return (
    <DonationTemplate
      setActiveStep={setActiveStep}
      activeStep={activeStep}
      setCurrentIndex={setCurrentIndex}
      heading="Enter your details"
      onClickHandler={nextButtonHandler}
      newDonation
      isContinueButtonDisabled={!isFormValid || isSubmitting}
      isRecurring={isRecurring}
      isLoading={isSubmitting}
    >
      <MemoizedPersonalInfoDonationForm
        formik={formik}
        donation={donation}
        donationComment={donationComment}
        handleCommentChange={handleCommentChange}
      />
    </DonationTemplate>
  );
};

export default PersonalInfoDonation;
