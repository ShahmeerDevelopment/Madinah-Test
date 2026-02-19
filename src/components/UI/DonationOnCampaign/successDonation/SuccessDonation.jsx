"use client";

/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useEffect,
  useState,
  Suspense,
  useMemo,
  // useCallback,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { useGetAllCampaigns } from "@/api";
import {
  CONSENT_COOKIE_NAME,
  modalHeightAdjustAble,
  RANDOM_URL,
} from "@/config/constant";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { theme } from "@/config/customTheme";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import LinearText from "@/components/atoms/typography/LinearText";
import { resetDonationState } from "@/store/slices/donationSlice";

// Lazy load heavier components
const ModalComponent = dynamic(
  () => import("@/components/molecules/modal/ModalComponent"),
  { ssr: false },
);
const UpsellModal = dynamic(() => import("./UpsellModal"), { ssr: false });
const DownsellModal = dynamic(() => import("./DownsellModal"), { ssr: false });
const SocialIconBox = dynamic(
  () => import("@/components/molecules/socialShare/SocialIconBox"),
  { ssr: false },
);
const CampaignCarousel = dynamic(() => import("./CampaignCarousel"), {
  ssr: false,
});
const YourDonation = dynamic(() => import("../paymentSummary/YourDonation"), {
  ssr: false,
});
const LazyHeartfallAnimation = dynamic(
  () => import("@/components/atoms/LazyHeartfallAnimation"),
  { ssr: false },
);
const LazyHandsHeartAnimation = dynamic(
  () => import("@/components/atoms/LazyHandsHeartAnimation"),
  { ssr: false },
);

// Loading placeholder
const LoadingPlaceholder = () => (
  <div
    style={{
      textAlign: "center",
      padding: "20px",
      margin: "10px 0",
      background: "#f5f5f5",
      borderRadius: "8px",
    }}
  >
    Loading...
  </div>
);
import YourDonationDetails from "../paymentSummary/YourDonationDetails";
import { getCookie } from "cookies-next";
import {
  googleTagLogs,
  googleTagServer,
  handlePosthog,
  savePixelLogs,
} from "@/api/post-api-services";
import { generateRandomToken, getUTMParams } from "@/utils/helpers";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
import {
  successDonationHandler,
  yourDonationDataHandler,
} from "@/store/slices/successDonationSlice";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import toast from "react-hot-toast";
import { postDonationFeedback } from "@/api/update-api-service";
import dayjs from "dayjs";
// import posthog from "posthog-js";
// import { getVisits } from "@/api/get-api-services";

const SuccessDonation = () => {
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Build query object from searchParams for compatibility
  const query = useMemo(() => {
    const obj = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  const { isSmallScreen } = useResponsiveScreen();
  const campaignToken = query.id;
  const utmParameters = useSelector((state) => state.utmParameters);
  const fbclid = utmParameters.fbclid;
  const fbc = fbclid ? `fb.1.${Date.now()}.${fbclid}` : null;
  const fbpData = getCookie("_fbp");
  const externalId = getCookie("externalId");
  const event_month = dayjs().format("MMMM");
  const event_day = dayjs().format("dddd");
  const event_hour = dayjs().format("H-") + (parseInt(dayjs().format("H")) + 1);
  const traffic_source =
    utmParameters?.utmMedium === "email" || utmParameters?.utmMedium === "Email"
      ? ""
      : "";
  const donateEventId = generateRandomToken("a", 5) + dayjs().unix();
  const content_type = "product";
  const user_roles = "guest";
  const url = window?.location?.href;
  const selectedBoxData = useSelector(
    (state) => state.donation.selectedBoxData,
  );
  const campaignPixelId = useSelector(
    (state) =>
      state?.successDonation?.successDonationValues?.campaignDetails
        ?.campaignerId?.pixelId,
  );
  const campaignGtmId = useSelector(
    (state) =>
      state?.successDonation?.successDonationValues?.campaignDetails
        ?.campaignerId?.gtmId,
  );
  console.log(
    "Success Donation - Campaign Pixel ID:",
    useSelector((state) => state?.successDonation),
  );
  const purchaseEventId = generateRandomToken("a", 5) + dayjs().unix();
  const comingFromRecurringPayment = useSelector(
    (state) => state.donation.isRecurring,
  );
  const successDonation = useSelector(
    (state) => state.successDonation.successDonationValues,
  );
  // const campaignToken = router.query.id;
  const campaignId = successDonation?.campaignDetails?._id;
  const content_ids = [campaignId];
  const donationValues = successDonation?.donationValue;
  const campaignDetails = successDonation?.campaignDetails;

  const thankYouPageData = useSelector(
    (state) => state.successDonation.thankYouPageData,
  );
  const transactionId = thankYouPageData?.transactionId;
  const totalUSDAmount = thankYouPageData?.totalUSDAmount;
  const isThankYouPage = searchParams.get("isThankYouPage");
  const isThankYouPageBool = isThankYouPage === "true";

  // Check if this is widget mode
  const isWidgetMode = query.widget === "true" && query.embedded === "true";

  // const utmParameters = useSelector((state) => state.utmParameters);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const campaignTitle = useSelector((state) => state.auth.campaignTitle);
  const sellConfigs = useSelector((state) => state.sellConfigs?.sellConfigs);
  const userEmailFromProfile = useSelector((state) => state.auth.emailAddress);

  // Group all useSelector hooks together
  // const campaignToken = query.id;
  const [donationFeedback, setDonationFeedback] = useState("");
  const MAX_CHARS = 5000;
  const feedbackTokens = useSelector(
    (state) => state.successDonation.feedbackTokens,
  );

  // State declarations
  const yourDonationData = useSelector(
    (state) => state.successDonation.yourDonationData,
  );

  console.log("Campign GTM ID", campaignGtmId);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSuccessValues =
      successDonation && Object.keys(successDonation).length > 0;
    const hasYourDonationData =
      yourDonationData && Object.keys(yourDonationData).length > 0;

    if (hasSuccessValues && hasYourDonationData) return;

    try {
      const raw = window.sessionStorage.getItem(
        "madinah_donation_success_snapshot",
      );
      if (!raw) return;
      const snapshot = JSON.parse(raw);
      if (snapshot?.successDonationValues && !hasSuccessValues) {
        dispatch(successDonationHandler(snapshot.successDonationValues));
      }
      if (snapshot?.yourDonationData && !hasYourDonationData) {
        dispatch(yourDonationDataHandler(snapshot.yourDonationData));
      }
    } catch {
      // ignore
    }
  }, [dispatch, successDonation, yourDonationData]);
  const [currentModalType, setCurrentModalType] = useState(null);
  const [currentUpsellIndex, setCurrentUpsellIndex] = useState(0);

  // Route parameters
  const randomToken = query.id;
  const paymentType = query.type;
  const userEmailFromCardDetails = query.email;

  // API call hook - keep this together with other hooks
  const {
    data: allCampaigns,
    isLoading,
    // isError,
    // error,
  } = useGetAllCampaigns();

  // Derived values
  const socialShareLink = `${RANDOM_URL}${randomToken}`;
  const getAllCampaigns = allCampaigns?.data?.data?.campaigns;

  // Safe access with default empty arrays - move this before conditional returns
  // const upSells = useMemo(
  //   () =>
  //     sellConfigs && Array.isArray(sellConfigs)
  //       ? sellConfigs.filter((item) => item.type === "upSell")
  //       : [],
  //   [sellConfigs]
  // );

  // Event handlers
  // const handleCloseUpsellModal = useCallback(() => {
  //   setUpsellModalOpen(false);
  //   setDownsellModalOpen(true);
  // }, []);

  // const handleCloseDownsellModal = useCallback(
  //   () => setDownsellModalOpen(false),
  //   []
  // );

  // Effects
  useEffect(() => {
    if (totalUSDAmount) {
      const eventId = generateRandomToken("a", 5) + dayjs().unix();
      if (window.fbq) {
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
          // contents,
        };
        const fbqData = {
          value: selectedBoxData
            ? selectedBoxData.amount
            : donationValues?.totalAmount,
          currency: "USD",
          campaignName: campaignDetails?.title,
          category: campaignDetails?.categoryId?.name,
          givingLevel:
            selectedBoxData && !comingFromRecurringPayment
              ? selectedBoxData.title
              : null,
          event_month: dayjs().format("MMMM"),
          event_day: dayjs().format("dddd"),
          event_hour:
            dayjs().format("H-") + (parseInt(dayjs().format("H")) + 1),
          traffic_source:
            utmParameters?.utmMedium === "email" ||
            utmParameters?.utmMedium === "Email"
              ? ""
              : "",
        };
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
        window.fbq("track", "AddPaymentInfo", fbqData, {
          URL: window.location.href,
          eventID: eventId,
          fbp: fbpData,
          external_id: externalId,
        });
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "purchase",
        transaction_id: transactionId,
        value: totalUSDAmount,
        currency: "USD",
      });
      window.dataLayer.push({
        event: "purchase",
        send_to: campaignGtmId,
        transaction_id: transactionId,
        value: totalUSDAmount,
        currency: "USD",
      });
      const gtagData = {
        name: "conversion",
        params: {
          transaction_id: transactionId,
          value: totalUSDAmount,
          currency: "USD",
          donationValue: thankYouPageData?.totalAmount,
          donationCurrency: thankYouPageData?.currency,
          items: [
            {
              item_id: campaignDetails?._id,
              item_name: campaignDetails?.title,
              item_category: campaignDetails?.categoryId?.name,
              price: parseFloat(thankYouPageData?.totalAmount),
              quantity: 1,
            },
          ],
          // debug_mode: true,
          engagement_time_msec: 1200,
        },
      };
      const gtagPurchase = {
        name: "purchase",
        params: {
          transaction_id: transactionId,
          value: totalUSDAmount,
          currency: "USD",
          donationValue: thankYouPageData?.totalAmount,
          donationCurrency: thankYouPageData?.currency,
          items: [
            {
              item_id: campaignDetails?._id,
              item_name: campaignDetails?.title,
              item_category: campaignDetails?.categoryId?.name,
              price: parseFloat(thankYouPageData?.totalAmount),
              quantity: 1,
            },
          ],
          // debug_mode: true,
          engagement_time_msec: 1200,
        },
      };
      googleTagServer(gtagData, campaignDetails?._id);
      googleTagServer(gtagPurchase, campaignDetails?._id);
      gtagData.eventName = "Conversion";
      googleTagLogs(gtagData, campaignId);
      if (window.fbq) {
        const fbqData = {
          value: totalUSDAmount,
          currency: "USD",
          campaignName: campaignDetails?.title,
          campaignCreator:
            campaignDetails?.campaignerId?.firstName +
            " " +
            campaignDetails?.campaignerId?.lastName,
          category: campaignDetails?.categoryId?.name,
          givingLevel: selectedBoxData?.title,
          fbc: fbc,
          event_month,
          event_day,
          event_hour,
          traffic_source,
          content_ids,
          content_type,
          user_roles,
          url,
        };
        const utmParams = {
          utmSource: utmParameters?.utmSource,
          utmMedium: utmParameters?.utmMedium,
          utmCampaign: utmParameters?.utmCampaign,
          utmTerm: utmParameters?.utmTerm,
          utmContent: utmParameters?.utmContent,
          referral: utmParameters?.referral,
          src: utmParameters?.src,
          fbc: fbc,
          event_month,
          event_day,
          event_hour,
          traffic_source,
          content_ids,
          content_type,
          user_roles,
          url,
        };
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
        if (fbqData.utmSource) {
          if (campaignPixelId) {
            window?.fbq("trackSingle", campaignPixelId, "Donate", fbqData, {
              eventID: donateEventId,
              fbp: fbpData,
              external_id: externalId,
            });
          }
          if (campaignPixelId) {
            window?.fbq("trackSingle", campaignPixelId, "Purchase", fbqData, {
              eventID: purchaseEventId,
              fbp: fbpData,
              external_id: externalId,
            });
          }

          window.fbq("track", "Donate", fbqData, {
            eventID: donateEventId,
            fbp: fbpData,
            external_id: externalId,
          });
          window.fbq("track", "Purchase", fbqData, {
            eventID: purchaseEventId,
            fbp: fbpData,
            external_id: externalId,
          });
        }
        const pixelPayloadPurchase = {
          value: totalUSDAmount,
          currency: "USD",
          campaignName: campaignDetails?.title,
          campaignCreator:
            campaignDetails?.campaignerId?.firstName +
            " " +
            campaignDetails?.campaignerId?.lastName,
          category: campaignDetails?.categoryId?.name,
          givingLevel: selectedBoxData?.title,
          utmSource: fbqData?.utmSource,
          utmMedium: fbqData?.utmMedium,
          utmCampaign: fbqData?.utmCampaign,
          utmTerm: fbqData?.utmTerm,
          utmContent: fbqData?.utmContent,
          referral: fbqData?.referral,
          src: fbqData?.src,
          fbc, // Keep this as is since fbqData already gets values from utmParams
          event_month,
          event_day,
          event_hour,
          traffic_source,
          content_ids,
          content_type,
          user_roles,
          url,
          eventID: purchaseEventId,
          fbp: fbpData,
          externalId: externalId,
          eventName: "Purchase",
        };
        const pixelPayloadDonate = {
          value: totalUSDAmount,
          currency: "USD",
          campaignName: campaignDetails?.title,
          campaignCreator:
            campaignDetails?.campaignerId?.firstName +
            " " +
            campaignDetails?.campaignerId?.lastName,
          category: campaignDetails?.categoryId?.name,
          givingLevel: selectedBoxData?.title,
          utmSource: fbqData?.utmSource,
          utmMedium: fbqData?.utmMedium,
          utmCampaign: fbqData?.utmCampaign,
          utmTerm: fbqData?.utmTerm,
          utmContent: fbqData?.utmContent,
          referral: fbqData?.referral,
          src: fbqData?.src,
          fbc, // Keep this as is since fbqData already gets values from utmParams
          event_month,
          event_day,
          event_hour,
          traffic_source,
          content_ids,
          content_type,
          user_roles,
          url,
          eventID: donateEventId,
          fbp: fbpData,
          externalId: externalId,
          eventName: "Donate",
        };
        if (pixelPayloadPurchase.utmSource) {
          savePixelLogs(pixelPayloadPurchase, campaignId);
          savePixelLogs(pixelPayloadDonate, campaignId);
        }
      }
    }
  }, []);

  useEffect(() => {
    document.title = "Thank you for your donation";
    return () => {
      document.title = "Madinah";
      dispatch(resetDonationState());
    };
  }, [dispatch]);

  // Handle browser back button - redirect to campaign view page (not donate-now)
  useEffect(() => {
    if (typeof window === "undefined" || !campaignToken) return;

    // The campaign view page URL (without any query parameters)
    const campaignViewUrl = `/${campaignToken}`;

    // Push a new state onto history stack - this creates an extra entry
    // so when user presses back, they stay on this page but trigger popstate
    window.history.pushState({ thankYouPage: true }, "", window.location.href);

    // Handle the back button press - redirect to campaign view page
    const handlePopState = (event) => {
      // Prevent default back navigation and redirect to campaign view
      // Using location.replace removes the thank you page from history
      window.location.replace(campaignViewUrl);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [campaignToken]);

  // Filter different types of sell configs
  const regularUpsells =
    sellConfigs?.filter(
      (item) => item.type === "upSell" && !item.isAdminSellConfig,
    ) || [];
  const downSells = useMemo(
    () =>
      sellConfigs && Array.isArray(sellConfigs)
        ? sellConfigs?.filter((item) => item.type === "downSell")
        : [],
    [sellConfigs],
  );
  const adminUpSells =
    sellConfigs?.filter(
      (item) => item.type === "upSell" && item.isAdminSellConfig,
    ) || [];

  // Initialize the modal flow
  useEffect(() => {
    if (regularUpsells.length > 0) {
      setCurrentModalType("firstUpsell");
      setCurrentUpsellIndex(0);
    } else if (adminUpSells.length > 0) {
      setCurrentModalType("adminUpsell");
    }
  }, [sellConfigs, regularUpsells.length, adminUpSells.length]);

  const handleFirstUpsellAccepted = () => {
    if (regularUpsells.length > 1) {
      // Show second upsell
      setCurrentModalType("secondUpsell");
      setCurrentUpsellIndex(1);
    } else if (adminUpSells.length > 0) {
      // Show admin upsell if no second regular upsell
      setCurrentModalType("adminUpsell");
    } else {
      setCurrentModalType(null);
    }
  };

  const handleFirstUpsellRejected = () => {
    if (downSells.length > 0) {
      setCurrentModalType("downsell");
    } else if (adminUpSells.length > 0) {
      setCurrentModalType("adminUpsell");
    } else {
      setCurrentModalType(null);
    }
  };

  const handleSecondUpsellAccepted = () => {
    if (adminUpSells.length > 0) {
      setCurrentModalType("adminUpsell");
    } else {
      setCurrentModalType(null);
    }
  };

  const handleSecondUpsellRejected = () => {
    if (downSells.length > 0) {
      setCurrentModalType("downsell");
    } else if (adminUpSells.length > 0) {
      setCurrentModalType("adminUpsell");
    } else {
      setCurrentModalType(null);
    }
  };

  const handleDownsellCompleted = () => {
    if (adminUpSells.length > 0) {
      setCurrentModalType("adminUpsell");
    } else {
      setCurrentModalType(null);
    }
  };

  const handleAdminUpsellCompleted = () => {
    setCurrentModalType(null);
  };

  const closeModal = () => {
    setCurrentModalType(null);
  };

  const getCurrentUpsell = () => {
    if (
      currentModalType === "firstUpsell" ||
      currentModalType === "secondUpsell"
    ) {
      return [regularUpsells[currentUpsellIndex]];
    } else if (currentModalType === "adminUpsell") {
      return adminUpSells;
    }
    return [];
  };

  const handleFeedbackChange = (e) => {
    const value = e.target.value.slice(0, MAX_CHARS); // This ensures text is trimmed at MAX_CHARS
    setDonationFeedback(value);
  };

  const nextButtonHandler = async () => {
    // Preserve all existing URL parameters

    if (donationFeedback) {
      const res = await postDonationFeedback(feedbackTokens, donationFeedback);
      const result = res?.data;
      if (result.success) {
        toast.success("Feedback submitted successfully!");
        setFeedbackSubmitted(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <BoxComponent
        sx={{
          mt: isWidgetMode ? "50px" : 1,
          background: theme.palette.primary.light,
          padding: { xs: "10px 8px 48px 8px", sm: "10px 32px 40px 32px" },
          borderRadius: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "100%",
          position: "relative",
        }}
      >
        {/* Heartfall background animation */}
        <BoxComponent
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100vw",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <LazyHeartfallAnimation height="850px" width="1920px" loop={false} />
        </BoxComponent>
        <BoxComponent
          sx={{
            width: { xs: "100%", sm: "720px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
            paddingRight: { xs: "14px" },
            paddingLeft: { xs: "14px" },
          }}
        >
          <BoxComponent sx={{ width: "110px", height: "110px" }}>
            <Suspense fallback={<LoadingPlaceholder />}>
              <LazyHandsHeartAnimation />
            </Suspense>
          </BoxComponent>
          <LinearText
            fontSize={isSmallScreen ? "32px" : "48px"}
            fontWeight={isSmallScreen ? 500 : 600}
            style={{
              lineHeight: isSmallScreen ? "38px" : "54px",
              textAlign: "center",
            }}
          >
            Thank you for your donation
          </LinearText>
          {paymentType === "apple_pay" ? (
            <SubHeading align={"center"}>
              Paid with <strong>Apple Pay</strong>{" "}
            </SubHeading>
          ) : paymentType === "google_pay" ? (
            <SubHeading align={"center"}>
              Paid with <strong>Google Pay</strong>{" "}
            </SubHeading>
          ) : (
            <SubHeading align={"center"}>
              A receipt has been sent to{" "}
              {isThankYouPageBool
                ? "sample@sample.com"
                : userEmailFromCardDetails
                  ? userEmailFromCardDetails
                  : userEmailFromProfile}
            </SubHeading>
          )}
          <BoxComponent
            sx={{
              width: "100%",
              border: "1px solid #E3E3FD",
              borderRadius: "20px",
              padding: "16px",
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: "20px",
            }}
          >
            <Suspense fallback={<LoadingPlaceholder />}>
              <YourDonation
                donationValue={successDonation?.donationValue}
                tip={successDonation?.tip}
                customTipValue={successDonation?.customTipValue}
                isRecurringPaymentSelected={
                  successDonation?.isRecurringPaymentSelected
                }
                isOrderBumpSelected={successDonation?.isOrderBumpSelected}
                processingFeePercentage={
                  successDonation?.isProcessingFee
                    ? successDonation?.processingFeePercentage
                    : 0
                }
                isProcessingFee={successDonation?.isProcessingFee}
                isThankYou={isThankYouPageBool}
              />
            </Suspense>
          </BoxComponent>
          {yourDonationData?.recurringType ? (
            <BoxComponent
              sx={{
                width: "100%",
                border: "1px solid #E3E3FD",
                borderRadius: "20px",
                padding: "16px",
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: "20px",
              }}
            >
              <YourDonationDetails
                donationValue={successDonation?.donationValue}
              />
            </BoxComponent>
          ) : null}
          <SubHeading sx={{ mt: 3 }}>Want to Maximize Your Impact?</SubHeading>
          <Paragraph sx={{ mb: 4 }}>
            Each share on average brings $36 in donations
          </Paragraph>
          {!feedbackSubmitted && (
            <>
              <BoxComponent sx={{ width: "100%" }}>
                <TypographyComp sx={{ fontSize: "15px", fontWeight: 500 }}>
                  Your feedback helps us do better. Let us know what inspired
                  your donation.
                </TypographyComp>
                <TextFieldComp
                  // isRequired
                  id="feedback"
                  name="feedback"
                  placeholder="Your feedback"
                  sx={{ borderRadius: "16px" }}
                  value={donationFeedback}
                  onChange={handleFeedbackChange}
                  fullWidth
                  helperText={`${donationFeedback.length}/${MAX_CHARS} characters`}
                  inputProps={{
                    maxLength: MAX_CHARS,
                  }}
                  multiline
                  maxRows={4}
                  disabled={feedbackSubmitted}
                />
              </BoxComponent>
              <BoxComponent
                sx={{
                  marginBottom: "8px",
                  gap: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
                <ButtonComp
                  sx={{ borderRadius: "10px" }}
                  onClick={nextButtonHandler}
                  disabled={feedbackSubmitted || !donationFeedback.trim()}
                >
                  Submit
                </ButtonComp>
              </BoxComponent>
            </>
          )}
          <Suspense fallback={<LoadingPlaceholder />}>
            <SocialIconBox
              customUrlData={socialShareLink}
              customTitle={campaignTitle}
            />
          </Suspense>
        </BoxComponent>
        {isLoading ? (
          <p style={{ marginTop: "10px" }}>Campaign loading....</p>
        ) : (
          <Suspense fallback={<LoadingPlaceholder />}>
            <CampaignCarousel
              getAllCampaigns={getAllCampaigns}
              isWidgetMode={isWidgetMode}
            />
          </Suspense>
        )}
      </BoxComponent>

      {/* First or Second Upsell Modal */}
      {(currentModalType === "firstUpsell" ||
        currentModalType === "secondUpsell") && (
        <ModalComponent
          open={true}
          onClose={closeModal}
          width={582}
          borderRadius="32px"
          padding="0px 32px 48px 32px"
          responsivePadding={"0px 16px 56px 16px"}
          containerStyleOverrides={modalHeightAdjustAble}
        >
          <UpsellModal
            upSells={getCurrentUpsell()}
            setOpen={() => setCurrentModalType(null)}
            onYesButtonClick={
              currentModalType === "firstUpsell"
                ? handleFirstUpsellAccepted
                : handleSecondUpsellAccepted
            }
            onNoButtonClick={() => {
              const userId = getCookie("distinctId");
              const utmParams = getUTMParams(window.location.href);
              const payload = {
                distinctId: userId,
                event: `Rejected ${
                  currentModalType === "firstUpsell" ? "First" : "Second"
                } Upsell`,
                properties: {
                  $current_url: window?.location?.href,
                  // ...posthog?.persistence?.props,
                  ...utmParams,
                },
              };
              if (parsedConsent && parsedConsent?.analytics) {
                enhancedHandlePosthog(
                  handlePosthog,
                  payload,
                  campaignTitle || "Campaign Page",
                );
              }

              if (currentModalType === "firstUpsell") {
                handleFirstUpsellRejected();
              } else {
                handleSecondUpsellRejected();
              }
            }}
          />
        </ModalComponent>
      )}

      {/* Downsell Modal */}
      {currentModalType === "downsell" && !isThankYouPageBool && (
        <ModalComponent
          open={true}
          onClose={() => handleDownsellCompleted()}
          width={"582px"}
          borderRadius="32px"
          padding="0px 32px 48px 32px"
          responsivePadding={"0px 16px 56px 16px"}
          containerStyleOverrides={modalHeightAdjustAble}
        >
          <DownsellModal
            setOpen={(isOpen) => {
              if (!isOpen) {
                handleDownsellCompleted();
              }
            }}
            downSells={downSells}
          />
        </ModalComponent>
      )}

      {/* Admin Upsell Modal */}
      {currentModalType === "adminUpsell" && !isThankYouPageBool && (
        <ModalComponent
          open={true}
          onClose={() => handleAdminUpsellCompleted()}
          width={582}
          borderRadius="32px"
          padding="0px 32px 48px 32px"
          responsivePadding={"0px 16px 56px 16px"}
          containerStyleOverrides={modalHeightAdjustAble}
        >
          <UpsellModal
            upSells={adminUpSells}
            setOpen={() => setCurrentModalType(null)}
            onYesButtonClick={() => {
              handleAdminUpsellCompleted();
            }}
            onNoButtonClick={() => {
              const userId = getCookie("distinctId");
              const utmParams = getUTMParams(window.location.href);
              const payload = {
                distinctId: userId,
                event: "Rejected Admin Upsell",
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
                  campaignTitle || "Campaign Page",
                );
              }
              handleAdminUpsellCompleted();
            }}
          />
        </ModalComponent>
      )}
    </>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(SuccessDonation);
