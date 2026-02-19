"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getCookie } from "cookies-next";

import StackComponent from "@/components/atoms/StackComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { postCardPayment } from "@/api";
import toast from "react-hot-toast";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import CoverImagePreview from "@/components/advance/CoverImagePreview";
import { useDispatch } from "react-redux";
import {
  successDonationHandler,
  yourDonationDataHandler,
} from "@/store/slices/successDonationSlice";
import LoadingBtn from "@/components/advance/LoadingBtn";
import dayjs from "dayjs";
import {
  generateRandomToken,
  getUTMParams,
  scrollToTop,
} from "@/utils/helpers";
import {
  googleTagLogs,
  googleTagServer,
  handlePosthog,
  savePixelLogs,
  // savePixelLogs,
} from "@/api/post-api-services";
import RecurringIcon from "@/assets/iconComponent/RecurringIcon";
import {
  AUTOMATIC_DONATION_DAYS,
  CONSENT_COOKIE_NAME,
} from "@/config/constant";
import ThreeDSecureAuthentication from "@/components/advance/ThreeDSecureAuthentication";
import axios from "axios";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// import posthog from "posthog-js";

const DownsellModal = ({ setOpen, downSells }) => {
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const isLogin = getCookie("token");
  const dispatch = useDispatch();
  const donateEventId = generateRandomToken("a", 5) + dayjs().unix();
  const purchaseEventId = generateRandomToken("a", 5) + dayjs().unix();
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
  const externalId = getCookie("externalId");
  const isSaveCardContinueSell = useSelector(
    (state) => state?.successDonation?.isSaveCardContinueSell,
  );
  const donationTransactionId = useSelector(
    (state) => state.sellConfigs?.paymentPayload?.transactionId,
  );
  const cardHolderValues = useSelector(
    (state) => state?.successDonation?.cardHolderValues,
  );
  const campaignId = useSelector((state) => state.sellConfigs?.campaignId);
  const content_ids = [campaignId];
  const content_type = "product";
  const user_roles = "guest";
  const url = window?.location?.href;
  const campaignPixelId = useSelector(
    (state) => state?.campaign?.campaignerId?.pixelId,
  );
  const campaignGtmId = useSelector(
    (state) =>
      state?.successDonation?.successDonationValues?.campaignDetails?.gtmId ||
      state?.campaign?.campaignerId?.gtmId,
  );
  const [paymentLoader, setPaymentLoader] = useState(false);
  const fbpData = getCookie("_fbp");
  const experimentalFeature = getCookie("abtesting");
  const campaignVersion = getCookie("campaign_testing");
  const experimentKey = localStorage.getItem("experimentKey");
  const variationKey = localStorage.getItem("variationKey");
  const userId = localStorage.getItem("gb_visitor_id");
  const [is3d, setIs3d] = useState(false);
  const [is3dDisplayMode, setIs3dDisplayMode] = useState("inline"); // 'inline' or 'modal'
  const recurlyKey = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;

  const paymentPayload = useSelector(
    (state) => state.sellConfigs?.paymentPayload,
  );
  // const amountCurrency = useSelector(
  //   (state) => state?.sellConfigs?.amountCurrency,
  // );

  const campaignDetails = useSelector(
    (state) => state?.successDonation?.successDonationValues?.campaignDetails,
  );

  const updatePaymentPayloadForUpsell = (paymentPayload, upsellAmount) => {
    const cfCountry =
      typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;

    console.log("DONATION TRANSACTION ID", donationTransactionId);
    const updatedPayload = { ...paymentPayload };
    updatedPayload.donationAmount = downSells[0]?.isRecurring
      ? 0
      : upsellAmount;
    const tipAmount = 0;
    updatedPayload.tipAmount = 0;
    updatedPayload.currency = paymentPayload?.currency;
    updatedPayload.recurringAmount = downSells[0]?.isRecurring
      ? upsellAmount
      : 0;
    updatedPayload.totalAmount = (upsellAmount + tipAmount).toFixed(2);
    updatedPayload.sellId = downSells[0]?._id;
    updatedPayload.isRecurring = downSells[0]?.isRecurring ? true : false;
    updatedPayload.recurringType = downSells[0]?.recurringType;
    updatedPayload.donationBumpAmount = 0;
    updatedPayload.donationBumpId = null;
    updatedPayload.givingLevelId = null;
    updatedPayload.currencyConversionId = paymentPayload?.currencyConversionId;
    updatedPayload.paymentProcessingFees = 0;
    updatedPayload.isPaymentProcessingFeesIncluded = false;
    updatedPayload.mainDonationId = donationTransactionId;
    updatedPayload.countryCode = cfCountry;
    updatedPayload.isConsentForFbEvents = parsedConsent?.marketing || false;

    delete updatedPayload.transactionId;
    delete updatedPayload.symbol;

    return updatedPayload;
  };

  const handleYesButtonClick = async () => {
    const userIdd = getCookie("distinctId");
    const utmParams = getUTMParams(window.location.href);
    const payload = {
      distinctId: userIdd,
      event: "Accepted Downsell",
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
    setPaymentLoader(true);
    const updatedPaymentPayload = updatePaymentPayloadForUpsell(
      paymentPayload,
      downSells[0]?.amount,
    );
    delete updatedPaymentPayload.previousTransactionId;

    const successAmountPayload = {
      ...updatedPaymentPayload,
      symbol: paymentPayload?.symbol,
      title: downSells[0]?.title,
      donationAmount: downSells[0].amount,
      recurringDonation: downSells[0]?.isRecurring ? downSells[0]?.amount : 0,
    };
    const successPayload = {
      donationValue: successAmountPayload,
      tip: 5,
      customTipValue: 0,
      isOrderBumpSelected: false,
      processingFeePercentage: 0,
      isProcessingFee: false,
      isRecurringPaymentSelected: downSells[0]?.isRecurring ? true : false,
    };
    const tokenData = await axios({
      method: "get",
      url: `https://api.recurly.com/js/v1/token?${cardHolderValues}`,
    });
    if (!isSaveCardContinueSell) {
      if (tokenData.status === 200 && tokenData.data.type) {
        const recurlyToken = tokenData.data.id;
        updatedPaymentPayload.paymentMethodId = recurlyToken;
        postCardPayment(
          campaignId,
          updatedPaymentPayload,
          isLogin,
          utmParameters.utmSource,
          utmParameters.utmMedium,
          utmParameters.utmCampaign,
          utmParameters.utmTerm,
          utmParameters.utmContent,
          utmParameters.referral,
          utmParameters.src,
          fbc,
          event_month,
          event_day,
          event_hour,
          traffic_source,
          content_ids,
          content_type,
          user_roles,
          url,
          purchaseEventId,
          donateEventId,
          fbpData,
          externalId,
          experimentalFeature,
          campaignVersion,
          experimentKey,
          variationKey,
          userId,
        )
          .then((res) => {
            const result = res?.data;
            setPaymentLoader(false);

            if (res?.data.success) {
              // Close modal only on successful payment
              setOpen(false);
              const yourDonationPayload = {
                recurringType: result?.data?.recurringType,
                totalAmount: result?.data?.unitAmount,
                totalPayments: result?.data?.totalBillingCycles,
                startDate: result?.data?.startDate,
                endDate: result?.data?.endDate,
                nextInvoice: result?.data?.currentPeriodEndsAt,
              };
              dispatch(yourDonationDataHandler(yourDonationPayload));
              handleDonationSuccess(
                updatedPaymentPayload,
                utmParameters.utmSource,
                utmParameters.utmMedium,
                utmParameters.utmCampaign,
                utmParameters.utmTerm,
                utmParameters.utmContent,
                utmParameters.referral,
                utmParameters.src,
                fbc,
                event_month,
                event_day,
                event_hour,
                traffic_source,
                content_ids,
                content_type,
                user_roles,
                url,
                result?.data?.totalUSDAmount,
                result?.data?.transactionId,
              );
              dispatch(successDonationHandler(successPayload));
              toast.success(result.message);
            } else if (result.data.is3dSecureAuthenticationRequired) {
              if (window.recurly) {
                // setIs3dLoading(true);
                // setNewLoader(true);
                window.recurly.configure(recurlyKey);
                const risk = window.recurly.Risk();
                setIs3d(true);
                // setIs3dError(false);
                if (typeof window !== "undefined") {
                  scrollToTop();
                }
                const threeDSecure = risk.ThreeDSecure({
                  actionTokenId: result.data.token,
                });
                threeDSecure.attach(document.querySelector("#my-container"));
                const loadingToast = toast.loading(
                  "Processing your payment...",
                );

                threeDSecure.on("ready", () => {
                  // setIs3dLoading(false);
                  const container = document.querySelector("#my-container");
                  const iframe = container?.querySelector("iframe");

                  // If no direct iframe after ready event, it's probably using a modal
                  if (!iframe) {
                    setIs3dDisplayMode("modal");
                  }
                });
                threeDSecure.on("error", (err) => {
                  // setIsPaymentProcessing(false); // Set when payment starts

                  toast.dismiss(loadingToast);
                  // setIs3dLoading(false);
                  setIs3d(false);
                  // setNewLoader(false);
                  threeDSecure.remove(document.querySelector("#my-container"));
                  // setIs3dError(true);
                  toast.error(err.message);
                  setPaymentLoader(false);
                  // Modal should remain open for 3D secure errors so user can retry
                  // display an error message to your user requesting they retry
                  // or use a different payment method
                });

                threeDSecure.on("token", (token) => {
                  threeDSecure.remove(document.querySelector("#my-container"));

                  // setIsPaymentProcessing(true); // Set when payment starts

                  updatedPaymentPayload.tokenId = recurlyToken;
                  updatedPaymentPayload.paymentMethodId = token.id;
                  updatedPaymentPayload.previousTransactionId =
                    result.data.transactionId;
                  // setNewLoader(true);
                  postCardPayment(
                    campaignId,
                    updatedPaymentPayload,
                    isLogin,
                    utmParameters.utmSource,
                    utmParameters.utmMedium,
                    utmParameters.utmCampaign,
                    utmParameters.utmTerm,
                    utmParameters.utmContent,
                    utmParameters.referral,
                    utmParameters.src,
                    fbc,
                    event_month,
                    event_day,
                    event_hour,
                    traffic_source,
                    content_ids,
                    content_type,
                    user_roles,
                    url,
                    purchaseEventId,
                    donateEventId,
                    fbpData,
                    externalId,
                    experimentalFeature,
                    campaignVersion,
                    experimentKey,
                    variationKey,
                    userId,
                  )
                    .then((res) => {
                      setIs3d(false);
                      const result = res?.data;
                      if (result.success) {
                        setIs3d(false);
                        toast.dismiss(loadingToast);
                        toast.success(result.message, { duration: 10000 });
                        // Close modal on successful 3D secure payment
                        setOpen(false);
                        payload.symbol = paymentPayload?.symbol;
                        payload.transactionId = result?.data?.transactionId;

                        // dispatch(updatePaymentPayload(payload));
                        // dispatch(isRecurringHandler(false));
                        // dispatch(resetDonationState());
                        handleDonationSuccess(
                          payload,
                          utmParameters.utmSource,
                          utmParameters.utmMedium,
                          utmParameters.utmCampaign,
                          utmParameters.utmTerm,
                          utmParameters.utmContent,
                          utmParameters.referral,
                          utmParameters.src,
                          fbc,
                          event_month,
                          event_day,
                          event_hour,
                          traffic_source,
                          content_ids,
                          content_type,
                          user_roles,
                          url,
                          result?.data?.totalUSDAmount,
                          result?.data?.transactionId,
                        );
                        dispatch(successDonationHandler(successPayload));

                        // const route = createSearchParams(
                        //   {
                        //     id: randomToken,
                        //     type: paymentType,
                        //     email: donation?.cardHolderName?.email,
                        //   },
                        //   "/donation-success"
                        // );

                        // router.push(route);
                        // const tokenPayload = {
                        //   paymentId: result?.data?.transactionId,
                        //   feedbackToken: result?.data?.feedbackToken,
                        // };
                        const yourDonationPayload = {
                          recurringType: result?.data?.recurringType,
                          totalAmount: result?.data?.unitAmount,
                          totalPayments: result?.data?.totalBillingCycles,
                          startDate: result?.data?.startDate,
                          endDate: result?.data?.endDate,
                          nextInvoice: result?.data?.currentPeriodEndsAt,
                        };
                        dispatch(yourDonationDataHandler(yourDonationPayload));
                        // dispatch(feedbackTokensHandler(tokenPayload));
                        // setNewLoader(false);
                        const userId = getCookie("distinctId");
                        const utmParams = getUTMParams(window.location.href);
                        const posthogPayload = {
                          distinctId: userId,
                          event: "Donation Made Successfully",
                          properties: {
                            $current_url: window?.location?.href,
                            // ...posthog?.persistence?.props,
                            ...utmParams,
                          },
                        };
                        if (parsedConsent?.analytics || !consentCookie) {
                          enhancedHandlePosthog(
                            handlePosthog,
                            posthogPayload,
                            campaignDetails?.title || "Campaign Page",
                          );
                        }
                        // setActiveStep((prevActiveStep) => {
                        //   setCurrentIndex(prevActiveStep);
                        //   return prevActiveStep + 1;
                        // });
                      } else {
                        setIs3d(false);
                        threeDSecure.remove(
                          document.querySelector("#my-container"),
                        );
                        toast.error(result.message);
                        setPaymentLoader(false);
                        // Modal should remain open for 3D secure payment failures so user can retry
                      }
                    })
                    .catch(() => {
                      setIs3d(false);
                      toast.dismiss(loadingToast);
                      setPaymentLoader(false);
                      threeDSecure.remove(
                        document.querySelector("#my-container"),
                      );
                      toast.error("Payment failed. Please try again.");
                      // Modal should remain open for 3D secure network errors so user can retry
                    });

                  // send `token.id` to your server to retry your API request
                });
              } else {
                // Recurly not available but 3DS required - keep modal open and show error
                setPaymentLoader(false);
                toast.error(
                  "3D Secure authentication is required but payment processor is not available. Please try again.",
                );
                // Modal should remain open so user can retry
              }
            } else {
              toast.error(result.message);
              // Close modal on regular payment failure
              setOpen(false);
            }
          })
          .catch(() => {
            setPaymentLoader(false);
            toast.error("Something went wrong");
            // Close modal on network/API errors for regular payments
            setOpen(false);
          });
      }
    } else {
      postCardPayment(
        campaignId,
        updatedPaymentPayload,
        isLogin,
        utmParameters.utmSource,
        utmParameters.utmMedium,
        utmParameters.utmCampaign,
        utmParameters.utmTerm,
        utmParameters.utmContent,
        utmParameters.referral,
        utmParameters.src,
        fbc,
        event_month,
        event_day,
        event_hour,
        traffic_source,
        content_ids,
        content_type,
        user_roles,
        url,
        purchaseEventId,
        donateEventId,
        fbpData,
        externalId,
        experimentalFeature,
        campaignVersion,
        experimentKey,
        variationKey,
        userId,
      )
        .then((res) => {
          const result = res?.data;
          setPaymentLoader(false);

          if (res?.data.success) {
            // Close modal only on successful payment
            setOpen(false);
            const yourDonationPayload = {
              recurringType: result?.data?.recurringType,
              totalAmount: result?.data?.unitAmount,
              totalPayments: result?.data?.totalBillingCycles,
              startDate: result?.data?.startDate,
              endDate: result?.data?.endDate,
              nextInvoice: result?.data?.currentPeriodEndsAt,
            };
            dispatch(yourDonationDataHandler(yourDonationPayload));
            handleDonationSuccess(
              updatedPaymentPayload,
              utmParameters.utmSource,
              utmParameters.utmMedium,
              utmParameters.utmCampaign,
              utmParameters.utmTerm,
              utmParameters.utmContent,
              utmParameters.referral,
              utmParameters.src,
              fbc,
              event_month,
              event_day,
              event_hour,
              traffic_source,
              content_ids,
              content_type,
              user_roles,
              url,
              result?.data?.totalUSDAmount,
              result?.data?.transactionId,
            );
            dispatch(successDonationHandler(successPayload));
            toast.success(result.message);
          } else if (result.data.is3dSecureAuthenticationRequired) {
            if (window.recurly) {
              // setIs3dLoading(true);
              // setNewLoader(true);
              window.recurly.configure(recurlyKey);
              const risk = window.recurly.Risk();
              setIs3d(true);
              // setIs3dError(false);
              if (typeof window !== "undefined") {
                scrollToTop();
              }
              const threeDSecure = risk.ThreeDSecure({
                actionTokenId: result.data.token,
              });
              threeDSecure.attach(document.querySelector("#my-container"));
              const loadingToast = toast.loading("Processing your payment...");

              threeDSecure.on("ready", () => {
                // setIs3dLoading(false);
                const container = document.querySelector("#my-container");
                const iframe = container?.querySelector("iframe");

                // If no direct iframe after ready event, it's probably using a modal
                if (!iframe) {
                  setIs3dDisplayMode("modal");
                }
              });
              threeDSecure.on("error", (err) => {
                // setIsPaymentProcessing(false); // Set when payment starts

                toast.dismiss(loadingToast);
                // setIs3dLoading(false);
                setIs3d(false);
                // setNewLoader(false);
                threeDSecure.remove(document.querySelector("#my-container"));
                // setIs3dError(true);
                toast.error(err.message);
                setPaymentLoader(false);
                // Modal should remain open for 3D secure errors so user can retry
                // display an error message to your user requesting they retry
                // or use a different payment method
              });

              threeDSecure.on("token", (token) => {
                threeDSecure.remove(document.querySelector("#my-container"));

                // setIsPaymentProcessing(true); // Set when payment starts

                updatedPaymentPayload.tokenId = token.id;
                updatedPaymentPayload.paymentMethodId = token.id;
                updatedPaymentPayload.previousTransactionId =
                  result.data.transactionId;
                // setNewLoader(true);
                postCardPayment(
                  campaignId,
                  updatedPaymentPayload,
                  isLogin,
                  utmParameters.utmSource,
                  utmParameters.utmMedium,
                  utmParameters.utmCampaign,
                  utmParameters.utmTerm,
                  utmParameters.utmContent,
                  utmParameters.referral,
                  utmParameters.src,
                  fbc,
                  event_month,
                  event_day,
                  event_hour,
                  traffic_source,
                  content_ids,
                  content_type,
                  user_roles,
                  url,
                  purchaseEventId,
                  donateEventId,
                  fbpData,
                  externalId,
                  experimentalFeature,
                  campaignVersion,
                  experimentKey,
                  variationKey,
                  userId,
                )
                  .then((res) => {
                    setIs3d(false);
                    const result = res?.data;
                    if (result.success) {
                      setIs3d(false);
                      toast.dismiss(loadingToast);
                      toast.success(result.message, { duration: 10000 });
                      // Close modal on successful 3D secure payment
                      setOpen(false);
                      payload.symbol = paymentPayload?.symbol;
                      payload.transactionId = result?.data?.transactionId;

                      // dispatch(updatePaymentPayload(payload));
                      // dispatch(isRecurringHandler(false));
                      // dispatch(resetDonationState());
                      handleDonationSuccess(
                        payload,
                        utmParameters.utmSource,
                        utmParameters.utmMedium,
                        utmParameters.utmCampaign,
                        utmParameters.utmTerm,
                        utmParameters.utmContent,
                        utmParameters.referral,
                        utmParameters.src,
                        fbc,
                        event_month,
                        event_day,
                        event_hour,
                        traffic_source,
                        content_ids,
                        content_type,
                        user_roles,
                        url,
                        result?.data?.totalUSDAmount,
                        result?.data?.transactionId,
                      );
                      dispatch(successDonationHandler(successPayload));

                      // const route = createSearchParams(
                      //   {
                      //     id: randomToken,
                      //     type: paymentType,
                      //     email: donation?.cardHolderName?.email,
                      //   },
                      //   "/donation-success"
                      // );

                      // router.push(route);
                      // const tokenPayload = {
                      //   paymentId: result?.data?.transactionId,
                      //   feedbackToken: result?.data?.feedbackToken,
                      // };
                      const yourDonationPayload = {
                        recurringType: result?.data?.recurringType,
                        totalAmount: result?.data?.unitAmount,
                        totalPayments: result?.data?.totalBillingCycles,
                        startDate: result?.data?.startDate,
                        endDate: result?.data?.endDate,
                        nextInvoice: result?.data?.currentPeriodEndsAt,
                      };
                      dispatch(yourDonationDataHandler(yourDonationPayload));
                      // dispatch(feedbackTokensHandler(tokenPayload));
                      // setNewLoader(false);
                      const userId = getCookie("distinctId");
                      const utmParams = getUTMParams(window.location.href);
                      const posthogPayload = {
                        distinctId: userId,
                        event: "Donation Made Successfully",
                        properties: {
                          $current_url: window?.location?.href,
                          // ...posthog?.persistence?.props,
                          ...utmParams,
                        },
                      };
                      if (parsedConsent?.analytics || !consentCookie) {
                        enhancedHandlePosthog(
                          handlePosthog,
                          posthogPayload,
                          campaignDetails?.title || "Campaign Page",
                        );
                      }
                      // setActiveStep((prevActiveStep) => {
                      //   setCurrentIndex(prevActiveStep);
                      //   return prevActiveStep + 1;
                      // });
                    } else {
                      setIs3d(false);
                      threeDSecure.remove(
                        document.querySelector("#my-container"),
                      );
                      toast.error(result.message);
                      setPaymentLoader(false);
                      // Modal should remain open for 3D secure payment failures so user can retry
                    }
                  })
                  .catch(() => {
                    setIs3d(false);
                    toast.dismiss(loadingToast);
                    setPaymentLoader(false);
                    threeDSecure.remove(
                      document.querySelector("#my-container"),
                    );
                    toast.error("Payment failed. Please try again.");
                    // Modal should remain open for 3D secure network errors so user can retry
                  });

                // send `token.id` to your server to retry your API request
              });
            } else {
              // Recurly not available but 3DS required - keep modal open and show error
              setPaymentLoader(false);
              toast.error(
                "3D Secure authentication is required but payment processor is not available. Please try again.",
              );
              // Modal should remain open so user can retry
            }
          } else {
            toast.error(result.message);
            // Close modal on regular payment failure
            setOpen(false);
          }
        })
        .catch(() => {
          setPaymentLoader(false);
          toast.error("Something went wrong");
          // Close modal on network/API errors for regular payments
          setOpen(false);
        });
    }
  };

  const handleDonationSuccess = (
    payload,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    referral,
    src,
    fbc,
    event_month,
    event_day,
    event_hour,
    traffic_source,
    content_ids,
    content_type,
    user_roles,
    url,
    totalUsdAmount,
    transactionId,
  ) => {
    // if (window && window.gtag) {
    const gtagData = {
      // send_to: `${process.env.NEXT_PUBLIC_GOOGLE_AD}/${process.env.NEXT_PUBLIC_GOOGLE_COVERSION_LABEL}`,
      name: "conversion",
      params: {
        transaction_id: transactionId,
        value: totalUsdAmount,
        currency: "USD",
        donationValue: payload?.totalAmount,
        donationCurrency: payload?.currency,
        items: [
          {
            item_id: campaignDetails?._id,
            item_name: campaignDetails?.title,
            item_category: campaignDetails?.categoryId?.name,
            price: parseFloat(payload?.totalAmount),
            quantity: 1,
          },
        ],
        // debug_mode: true,
        engagement_time_msec: 1200,
      },
    };
    const utmParams = {
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      referral,
      src,
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
    Object.entries(utmParams).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== "null" &&
        value !== "undefined"
      ) {
        gtagData[key] = value;
      }
    });

    // window.gtag("event", "conversion", gtagData);
    // window.gtag("event", "purchase", {
    //   transaction_id: transactionId,
    //   value: totalUsdAmount,
    //   currency: "USD",
    //   items: [
    //     {
    //       id: campaignDetails?._id,
    //       name: campaignDetails?.title,
    //       category: campaignDetails?.categoryId?.name,
    //       price: payload?.totalAmount,
    //       quantity: 1,
    //     },
    //   ],
    // });

    const gtagPurchase = {
      name: "purchase",
      params: {
        transaction_id: transactionId,
        value: totalUsdAmount,
        currency: "USD",
        donationValue: payload?.totalAmount,
        donationCurrency: payload?.currency,
        items: [
          {
            item_id: campaignDetails?._id,
            item_name: campaignDetails?.title,
            item_category: campaignDetails?.categoryId?.name,
            price: parseFloat(payload?.totalAmount),
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
    // }
    if (window.fbq) {
      const fbqData = {
        value: totalUsdAmount,
        currency: "USD",
        campaignName: campaignDetails?.title,
        campaignCreator:
          campaignDetails?.campaignerId?.firstName +
          " " +
          campaignDetails?.campaignerId?.lastName,
        category: campaignDetails?.categoryId?.name,
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
        utmSource: utmSource,
        utmMedium: utmMedium,
        utmCampaign: utmCampaign,
        utmTerm: utmTerm,
        utmContent: utmContent,
        referral: referral,
        src: src,
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
        value: totalUsdAmount,
        currency: "USD",
        campaignName: campaignDetails?.title,
        campaignCreator:
          campaignDetails?.campaignerId?.firstName +
          " " +
          campaignDetails?.campaignerId?.lastName,
        category: campaignDetails?.categoryId?.name,
        utmSource: fbqData?.utmSource,
        utmMedium: fbqData?.utmMedium,
        utmCampaign: fbqData?.utmCampaign,
        utmTerm: fbqData?.utmTerm,
        utmContent: fbqData?.utmContent,
        referral: fbqData?.referral,
        src: fbqData?.src,
        fbc: fbc,
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
        value: totalUsdAmount,
        currency: "USD",
        campaignName: campaignDetails?.title,
        campaignCreator:
          campaignDetails?.campaignerId?.firstName +
          " " +
          campaignDetails?.campaignerId?.lastName,
        category: campaignDetails?.categoryId?.name,
        utmSource: fbqData?.utmSource,
        utmMedium: fbqData?.utmMedium,
        utmCampaign: fbqData?.utmCampaign,
        utmTerm: fbqData?.utmTerm,
        utmContent: fbqData?.utmContent,
        referral: fbqData?.referral,
        src: fbqData?.src,
        fbc: fbc,
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
      if (pixelPayloadDonate?.utmSource) {
        savePixelLogs(pixelPayloadPurchase, campaignId);
        savePixelLogs(pixelPayloadDonate, campaignId);
      }
    } else {
      console.error("Facebook Pixel not loaded.");
    }
  };

  const getRecurringTypeTitle = () => {
    const recurringTypeItem = AUTOMATIC_DONATION_DAYS.find(
      (item) => item.value === downSells[0]?.recurringType,
    );
    return recurringTypeItem ? recurringTypeItem.label : "";
  };

  return (
    <StackComponent direction={"column"} alignItems="center">
      <BoxComponent sx={{ marginTop: "42px !important" }}>
        <CoverImagePreview imageSrc={downSells[0]?.imageUrl} />
      </BoxComponent>
      <ThreeDSecureAuthentication>
        <div
          style={{
            height: is3d && is3dDisplayMode === "inline" ? "400px" : 0,
          }}
          id="my-container"
        />
      </ThreeDSecureAuthentication>
      <CampaignHeading
        sx={{
          textAlign: "center",
          width: "100%",
          marginTop: "32px !important",
        }}
      >
        {downSells[0]?.title}
      </CampaignHeading>

      <SubHeading
        sx={{
          width: "100%",
          fontWeight: 500,
          fontSize: "18px",
          lineHeight: "22px",
          color: "#424243",
          // ...breakWordStyle,
        }}
      >
        {downSells[0]?.subTitle}
      </SubHeading>

      <BoxComponent sx={{ marginBottom: "20px !important" }}>
        <TypographyComp
          sx={{
            fontSize: "18px",
            fontWeight: 500,
            lineHeight: "22px",
            color: "#424243",
            wordWrap: downSells[0]?.description
              ?.split(" ")
              .some((word) => word.length > 30)
              ? "break-word"
              : undefined,
            // ...breakWordStyle,
          }}
        >
          {downSells[0]?.description}
        </TypographyComp>
      </BoxComponent>
      <StackComponent
        direction={{ xs: "column", sm: "column" }}
        spacing={1.5}
        sx={{ width: "100%" }}
      >
        {downSells[0]?.recurringType ? (
          <BoxComponent
            sx={{
              borderRadius: "22px",
              border: "2px solid #F7F7FF",
              height: "auto",
              padding: "12px 16px 12px 16px",
              gap: "24px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <BoxComponent
              sx={{
                display: "flex",
                gap: "10px",
                height: "40px",
                alignItems: "center",
              }}
            >
              <RecurringIcon />
              <BoxComponent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TypographyComp
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "16px",
                    color: "#090909",
                  }}
                >
                  {getRecurringTypeTitle()}
                </TypographyComp>
              </BoxComponent>
            </BoxComponent>
            <BoxComponent
              sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <LoadingBtn
                disabled={paymentLoader}
                loadingState={paymentLoader}
                loadingLabel="Loading"
                fullWidth={true}
                size={"normal"}
                onClick={handleYesButtonClick}
              >
                {downSells[0]?.yesButtonText}
              </LoadingBtn>
            </BoxComponent>
          </BoxComponent>
        ) : (
          <LoadingBtn
            disabled={paymentLoader}
            loadingState={paymentLoader}
            loadingLabel="Loading"
            fullWidth={true}
            size={"normal"}
            onClick={handleYesButtonClick}
          >
            {downSells[0]?.yesButtonText}
          </LoadingBtn>
        )}
        <ButtonComp
          fullWidth={true}
          size={"normal"}
          variant="text"
          onClick={() => {
            setOpen(false);
            const userIdd = getCookie("distinctId");
            const utmParams = getUTMParams(window.location.href);
            const payload = {
              distinctId: userIdd,
              event: "Rejected Downsell",
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
          }}
        >
          {downSells[0]?.noButtonText}
        </ButtonComp>
      </StackComponent>
    </StackComponent>
  );
};
DownsellModal.propTypes = {
  setOpen: PropTypes.setOpen,
  id: PropTypes.any,
  downSells: PropTypes.any,
};

export default DownsellModal;
