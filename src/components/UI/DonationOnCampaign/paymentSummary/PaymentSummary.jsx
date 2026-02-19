"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useRouter, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";

import {
  // updateCampaignId,
  updatePaymentPayload,
} from "@/store/slices/sellConfigSlice";

import AddTip from "./AddTip";
import { getPaymentInfoFbTags } from "@/api";
import { postCardDetails, postCardPayment, useGetCreditCardList } from "@/api";
import DonationBump from "./DonationBump";
import {
  calculateTotalAmount,
  createSearchParams,
  formatNumberWithCommas,
  generateRandomToken,
  scrollToTop,
} from "@/utils/helpers";
import {
  isRecurringHandler,
  provideNameAndEmailHandler,
  provideNumberHandler,
  resetDonationState,
  updateOrderBump,
  updateProcessingFee,
} from "@/store/slices/donationSlice";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SelectAbleLevel from "@/components/atoms/selectAbleField/SelectAbleLevel";
import YourDonation from "./YourDonation";
import StackComponent from "@/components/atoms/StackComponent";
import ApplePay from "../paymentMethod/applePay/ApplePay";
import GooglePay from "../paymentMethod/googlePay/GooglePay";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { successDonationHandler } from "@/store/slices/successDonationSlice";
import dayjs from "dayjs";
import {
  googleTagLogs,
  googleTagServer,
  savePixelLogs,
  // savePixelLogs,
} from "@/api/post-api-services";
import ThreeDSecureAuthentication from "@/components/advance/ThreeDSecureAuthentication";

const PaymentSummary = ({ cardToken, setIsPaymentProcessing, onError }) => {
  const purchaseEventId = generateRandomToken("a", 5) + dayjs().unix();
  const donateEventId = generateRandomToken("a", 5) + dayjs().unix();

  const recurlyKey = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;
  const isLogin = getCookie("token");
  const { data: creditCardList } = useGetCreditCardList({
    enabled: isLogin ? true : false,
  });

  const getCardDetails = creditCardList?.data.data.cards;
  const isSaveCard = getCardDetails?.length > 0 ? true : false;
  const router = useRouter();
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);

  const dispatch = useDispatch();
  const { isSmallScreen } = useResponsiveScreen();
  const fbpData = getCookie("_fbp");
  const externalId = getCookie("externalId");
  const announcementToken = useSelector(
    (state) => state.donation.announcementToken,
  );
  const experimentalFeature = getCookie("abtesting");
  const campaignVersion = getCookie("campaign_testing");
  const experimentKey = localStorage.getItem("experimentKey");
  const variationKey = localStorage.getItem("variationKey");
  const userId = localStorage.getItem("gb_visitor_id");
  const tipValue = useSelector((state) => state.donation.tipAmount);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const campaignId = useSelector((state) => state.donation.campaignId);
  const currency = useSelector((state) => state.donation.currencySymbol);
  const randomToken = useSelector((state) => state.donation.randomToken);
  const paymentType = useSelector((state) => state.donation.paymentType);
  const cardHolderName = useSelector((state) => state.donation.cardHolderName);
  const isCardSave = useSelector((state) => state.donation.isSaveCardContinue);
  const donationValues = useSelector((state) => state.donation.donationValues);
  const sellConfigs = useSelector((state) => state.sellConfigs?.sellConfigs);
  const successDonationState = useSelector((state) => state.successDonation);
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
  const [is3dLoading, setIs3dLoading] = useState(false);
  const [loadingToastId, setLoadingToastId] = useState(null);

  const userEmailFromCardDetails = useSelector(
    (state) => state.donation.cardHolderName.email,
  );
  const userPhoneFromCardDetails = useSelector(
    (state) => state.donation.cardHolderName.phoneNumber,
  );
  const creditCardDetails = useSelector(
    (state) => state.donation.creditCardDetails,
  );
  const comingFromRecurringPayment = useSelector(
    (state) => state.donation.isRecurring,
  );
  const selectedBoxData = useSelector(
    (state) => state.donation.selectedBoxData,
  );

  const campaignDetails = useSelector(
    (state) => state.donation?.campaignDetails,
  );

  // const contents = [
  //   {
  //     name: campaignDetails?.title,
  //     category: campaignDetails?.categoryId?.name,
  //     id: campaignId,
  //     quantity: 1,
  //     // item_price: donationValues?.totalAmount,
  //   },
  // ];

  const [is3d, setIs3d] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [selectedTip, setSelectedTip] = useState(
    useSelector((state) => state?.donation?.selectedTipRedux),
  );
  const [is3dError, setIs3dError] = useState(false);
  const [customTipValue, setCustomTipValue] = useState(0);
  const [notDisplayName, setNotDisplayName] = useState(false);
  const [provideNameAndEmail, setProvideNameAndEmail] = useState(
    useSelector((state) => state?.donation?.provideNameAndEmail),
  );
  const [provideNumber, setProvideNumber] = useState(
    useSelector((state) => state?.donation?.provideNumber),
  );
  const [isOrderBumpSelected, setIsOrderBumpSelected] = useState(
    useSelector((state) => state.donation?.orderBump),
  );

  const [isProcessingFee, setIsProcessingFee] = useState(
    campaignDetails?.paymentProcessingFeesPercentage,
  );

  // const [isProcessingFee, setIsProcessingFee] = useState(
  //   useSelector((state) => campaignDetails?.paymentProcessingFeesPercentage)
  // );
  const [googleLoader, setGoogleLoader] = useState(false);
  const [is3dDisplayMode, setIs3dDisplayMode] = useState("inline"); // 'inline' or 'modal'
  const hasUrlChanged = useRef(false); // Track if the URL has changed
  // const [googlePayload, setGooglePayload] = useState(null);

  const persistDonationSuccessSnapshot = () => {
    if (typeof window === "undefined") return;
    try {
      const successDonationValues = {
        donationValue: donationValues,
        campaignDetails: campaignDetails,
        announcementToken: announcementToken,
        tip: selectedTip,
        customTipValue: customTipValue,
        isRecurringPaymentSelected: comingFromRecurringPayment,
        isOrderBumpSelected: isOrderBumpSelected,
        processingFeePercentage: isProcessingFee
          ? campaignDetails?.paymentProcessingFeesPercentage
          : 0,
        isProcessingFee: isProcessingFee ? true : false,
      };

      const snapshot = {
        v: 1,
        ts: Date.now(),
        successDonationValues,
        yourDonationData: successDonationState?.yourDonationData || {},
      };

      window.sessionStorage.setItem(
        "madinah_donation_success_snapshot",
        JSON.stringify(snapshot),
      );
    } catch {
      // Ignore storage errors (private mode, quota, etc.)
    }
  };

  const processingFee = isProcessingFee
    ? campaignDetails?.paymentProcessingFeesPercentage
    : 0;

  const paymentButtonHandler = (userDetailsFromGooglePayment) => {
    setIsLoader(true);
    setGoogleLoader(true);
    postPaymentApi(userDetailsFromGooglePayment);
  };

  useEffect(() => {
    dispatch(updateProcessingFee(isProcessingFee ? processingFee : 0));
  }, [processingFee]);

  useEffect(() => {
    if (orderBump && orderBump.length > 0) {
      dispatch(updateOrderBump(isOrderBumpSelected ? orderBump[0].amount : 0));
    }
  }, [isOrderBumpSelected]);

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

  const toggleOrderBump = () => {
    setIsOrderBumpSelected(!isOrderBumpSelected);
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
    fbc, // Changed from fbclid to fbc
    event_month,
    event_day,
    event_hour,
    traffic_source,
    content_ids,
    content_type,
    user_roles,
    url,
    totalUSDAmount,
    transactionId,
  ) => {
    setIsPaymentProcessing(true); // Set when payment starts
    console.log("TOTAL USD", totalUSDAmount);
    const orderBumpConfig = campaignDetails?.sellConfigs?.find(
      (config) => config.type === "orderBump",
    );
    // const transactionId = payload?.transactionId || randomToken;

    // if (window && window.gtag) {
    // Prepare the base event data
    const gtagData = {
      // send_to: `${process.env.NEXT_PUBLIC_GOOGLE_AD}/${process.env.NEXT_PUBLIC_GOOGLE_COVERSION_LABEL}`,
      name: "conversion",
      params: {
        transaction_id: transactionId,
        value: totalUSDAmount,
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

    // Prepare UTM parameters and add only valid ones
    const utmParams = {
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      referral,
      src,
      // fbclid,
      fbc, // Add fbc to the parameters
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

    // Filter and append valid UTM parameters to the gtagData object
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

    // Trigger Google Analytics conversion event
    // window.gtag("event", "conversion", gtagData);

    // window.gtag("event", "purchase", {
    //   transaction_id: transactionId,
    //   value: totalUSDAmount,
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
        value: totalUSDAmount,
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
        value: totalUSDAmount,
        currency: "USD",
        campaignName: campaignDetails?.title,
        campaignCreator:
          campaignDetails?.campaignerId?.firstName +
          " " +
          campaignDetails?.campaignerId?.lastName,
        category: campaignDetails?.categoryId?.name,
        orderBump:
          orderBumpConfig && isOrderBumpSelected ? orderBumpConfig?.title : "",
        givingLevel: selectedBoxData?.title,
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
        orderBump:
          orderBumpConfig && isOrderBumpSelected ? orderBumpConfig?.title : "",
        givingLevel: selectedBoxData?.title,
        utmSource: fbqData?.utmSource,
        utmMedium: fbqData?.utmMedium,
        utmCampaign: fbqData?.utmCampaign,
        utmTerm: fbqData?.utmTerm,
        utmContent: fbqData?.utmContent,
        referral: fbqData?.referral,
        src: fbqData?.src,
        fbc: fbc, // Changed from fbclid to fbc
        event_month,
        event_day,
        event_hour,
        traffic_source,
        content_ids,
        content_type,
        user_roles,
        url,
        // contents,
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
        orderBump:
          orderBumpConfig && isOrderBumpSelected ? orderBumpConfig?.title : "",
        givingLevel: selectedBoxData?.title,
        utmSource: fbqData?.utmSource,
        utmMedium: fbqData?.utmMedium,
        utmCampaign: fbqData?.utmCampaign,
        utmTerm: fbqData?.utmTerm,
        utmContent: fbqData?.utmContent,
        referral: fbqData?.referral,
        src: fbqData?.src,
        fbc: fbc, // Changed from fbclid to fbc
        event_month,
        event_day,
        event_hour,
        traffic_source,
        content_ids,
        content_type,
        user_roles,
        url,
        // contents,
        eventID: donateEventId,
        fbp: fbpData,
        externalId: externalId,
        eventName: "Donate",
      };
      if (pixelPayloadPurchase.utmSource) {
        savePixelLogs(pixelPayloadPurchase, campaignId);
        savePixelLogs(pixelPayloadDonate, campaignId);
      }
    } else {
      console.error("Facebook Pixel not loaded.");
    }
  };

  const postCreditCard = (socialToken, successPayload, paymentPayload) => {
    const payload = {
      cardToken: socialToken,
      // postalCode: postalCode,
    };
    postCardDetails(payload)
      .then((res) => {
        const result = res?.data;

        if (result.success) {
          // toast.success(result.message);
          dispatch(successDonationHandler(successPayload));
          // contents.item_price = donationValues?.totalAmount;
          postCardPayment(
            campaignId,
            paymentPayload,
            isLogin,
            utmParameters.utmSource,
            utmParameters.utmMedium,
            utmParameters.utmCampaign,
            utmParameters.utmTerm,
            utmParameters.utmContent,
            utmParameters.referral,
            utmParameters.src,
            fbc, // Changed from fbclid to fbc
            event_month,
            event_day,
            event_hour,
            traffic_source,
            content_ids,
            content_type,
            user_roles,
            url,
            // contents,
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
              if (result.success) {
                toast.success(result.message);
                paymentPayload.symbol = donationValues?.symbol;
                paymentPayload.transactionId = result?.data?.transactionId;
                dispatch(updatePaymentPayload(paymentPayload));
                // dispatch(updateCampaignId(campaignId));
                dispatch(isRecurringHandler(false));
                // dispatch(resetDonationState());
                handleDonationSuccess(
                  paymentPayload,
                  utmParameters.utmSource,
                  utmParameters.utmMedium,
                  utmParameters.utmCampaign,
                  utmParameters.utmTerm,
                  utmParameters.utmContent,
                  utmParameters.referral,
                  utmParameters.src,
                  fbc, // Changed from fbclid to fbc
                  event_month,
                  event_day,
                  event_hour,
                  traffic_source,
                  content_ids,
                  content_type,
                  user_roles,
                  url,
                  // contents,
                  result?.data?.totalUSDAmount,
                  result?.data?.transactionId,
                );
                const route = createSearchParams(
                  {
                    type: paymentType,
                    email: userEmailFromCardDetails
                      ? userEmailFromCardDetails
                      : userDetails?.email,
                  },
                  "/donation-success",
                  randomToken, // Pass campaign ID as path parameter
                );
                if (loadingToastId) {
                  toast.dismiss(loadingToastId);
                }
                persistDonationSuccessSnapshot();
                router.push(route);
                setGoogleLoader(false);
              } else if (result.data.is3dSecureAuthenticationRequired) {
                if (window.recurly) {
                  setIs3dLoading(true);
                  window.recurly.configure(recurlyKey);
                  const risk = window.recurly.Risk();
                  setIs3d(true);
                  setIs3dError(false);
                  if (typeof window !== "undefined") {
                    scrollToTop();
                  }
                  const threeDSecure = risk.ThreeDSecure({
                    actionTokenId: result.data.token,
                  });
                  threeDSecure.attach(document.querySelector("#my-container"));
                  const toastId = toast.loading("Processing your payment...");
                  setLoadingToastId(toastId);

                  threeDSecure.on("ready", () => {
                    setIs3dLoading(false);
                    const container = document.querySelector("#my-container");
                    const iframe = container?.querySelector("iframe");

                    // If no direct iframe after ready event, it's probably using a modal
                    if (!iframe) {
                      setIs3dDisplayMode("modal");
                    }
                  });
                  threeDSecure.on("error", (err) => {
                    toast.dismiss(toastId);
                    setIs3dLoading(false);
                    setIs3d(false);
                    setIsPaymentProcessing(false); // Set when payment starts

                    threeDSecure.remove(
                      document.querySelector("#my-container"),
                    );
                    setIs3dError(true);
                    toast.error(err.message);
                    // display an error message to your user requesting they retry
                    // or use a different payment method
                  });

                  threeDSecure.on("token", (token) => {
                    setIsPaymentProcessing(true); // Set when payment starts

                    paymentPayload.tokenId =
                      paymentType === "google_pay" ||
                      paymentType === "apple_pay"
                        ? socialToken
                        : cardToken;
                    paymentPayload.paymentMethodId = token.id;
                    paymentPayload.previousTransactionId =
                      result.data.transactionId;
                    postCardPayment(
                      campaignId,
                      paymentPayload,
                      isLogin,
                      utmParameters.utmSource,
                      utmParameters.utmMedium,
                      utmParameters.utmCampaign,
                      utmParameters.utmTerm,
                      utmParameters.utmContent,
                      utmParameters.referral,
                      utmParameters.src,
                      fbc, // Changed from fbclid to fbc
                      event_month,
                      event_day,
                      event_hour,
                      traffic_source,
                      content_ids,
                      content_type,
                      user_roles,
                      url,
                      // contents,
                      purchaseEventId,
                      donateEventId,
                      fbpData,
                      externalId,
                      experimentalFeature,
                      campaignVersion,
                      experimentKey,
                      variationKey,
                      userId,
                    ).then((res) => {
                      toast.dismiss(toastId);
                      setIs3d(false);
                      const result = res?.data;
                      if (result.success) {
                        toast.success(result.message);
                        dispatch(isRecurringHandler(false));
                        paymentPayload.symbol = donationValues?.symbol;
                        paymentPayload.transactionId =
                          result?.data?.transactionId;
                        dispatch(updatePaymentPayload(paymentPayload));
                        // dispatch(resetDonationState());
                        handleDonationSuccess(
                          paymentPayload,
                          utmParameters.utmSource,
                          utmParameters.utmMedium,
                          utmParameters.utmCampaign,
                          utmParameters.utmTerm,
                          utmParameters.utmContent,
                          utmParameters.referral,
                          utmParameters.src,
                          fbc, // Changed from fbclid to fbc
                          event_month,
                          event_day,
                          event_hour,
                          traffic_source,

                          content_ids,
                          content_type,
                          user_roles,
                          url,
                          // contents,
                          result?.data?.totalUSDAmount,
                          result?.data?.transactionId,
                        );

                        const route = createSearchParams(
                          {
                            type: paymentType,
                            email: userEmailFromCardDetails
                              ? userEmailFromCardDetails
                              : userDetails?.email,
                          },
                          "/donation-success",
                          randomToken, // Pass campaign ID as path parameter
                        );

                        persistDonationSuccessSnapshot();
                        router.push(route);
                      } else {
                        threeDSecure.remove(
                          document.querySelector("#my-container"),
                        );
                        toast.error(result.message);
                      }
                    });

                    // send `token.id` to your server to retry your API request
                  });
                }
              } else {
                toast.error(result.message);
              }
            })
            .catch((error) => {
              console.error(error);
              toast.error("Something went wrong");
            })
            .finally(() => {
              setIsLoader(false);
              setGoogleLoader(false);
            });
          toast.success("Card details added successfully");
        } else if (result.data.is3dSecureAuthenticationRequired) {
          if (window.recurly) {
            setIs3dLoading(true);
            window.recurly.configure(recurlyKey);
            const risk = window.recurly.Risk();
            setIs3d(true);
            if (typeof window !== "undefined") {
              scrollToTop();
            }
            const threeDSecure = risk.ThreeDSecure({
              actionTokenId: result.data.token,
            });
            threeDSecure.attach(document.querySelector("#my-container"));
            const toastId = toast.loading("Processing your payment...");
            setLoadingToastId(toastId);

            threeDSecure.on("ready", () => {
              setIs3dLoading(false);
              const container = document.querySelector("#my-container");
              const iframe = container?.querySelector("iframe");

              // If no direct iframe after ready event, it's probably using a modal
              if (!iframe) {
                setIs3dDisplayMode("modal");
              }
            });
            threeDSecure.on("error", (err) => {
              setIsPaymentProcessing(false); // Set when payment starts

              toast.dismiss(toastId);
              setIs3dLoading(false);
              setIs3d(false);
              threeDSecure.remove(document.querySelector("#my-container"));
              toast.error(err.message);
              // display an error message to your user requesting they retry
              // or use a different payment method
            });

            threeDSecure.on("token", (newToken) => {
              payload.previousCardToken = socialToken;
              payload.cardToken = newToken.id;
              // payload.previousTransactionId = result.data.transactionId;
              setIsPaymentProcessing(true); // Set when payment starts
              postCardDetails(payload).then((res) => {
                setIs3d(false);
                const result = res?.data;
                if (result.success) {
                  toast.dismiss(toastId);
                  toast.success(result.message);
                  dispatch(successDonationHandler(successPayload));
                  postCardPayment(
                    campaignId,
                    paymentPayload,
                    isLogin,
                    utmParameters.utmSource,
                    utmParameters.utmMedium,
                    utmParameters.utmCampaign,
                    utmParameters.utmTerm,
                    utmParameters.utmContent,
                    utmParameters.referral,
                    utmParameters.src,
                    fbc, // Changed from fbclid to fbc
                    event_month,
                    event_day,
                    event_hour,
                    traffic_source,
                    content_ids,
                    content_type,
                    user_roles,
                    url,
                    // contents,
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
                      if (result.success) {
                        toast.success(result.message);
                        paymentPayload.symbol = donationValues?.symbol;
                        paymentPayload.transactionId =
                          result?.data?.transactionId;
                        dispatch(updatePaymentPayload(paymentPayload));
                        // dispatch(updateCampaignId(campaignId));
                        dispatch(isRecurringHandler(false));
                        // dispatch(resetDonationState());
                        handleDonationSuccess(
                          paymentPayload,
                          utmParameters.utmSource,
                          utmParameters.utmMedium,
                          utmParameters.utmCampaign,
                          utmParameters.utmTerm,
                          utmParameters.utmContent,
                          utmParameters.referral,
                          utmParameters.src,
                          fbc, // Changed from fbclid to fbc
                          event_month,
                          event_day,
                          event_hour,
                          traffic_source,
                          content_ids,
                          content_type,
                          user_roles,
                          url,
                          // contents,
                          result?.data?.totalUSDAmount,
                          result?.data?.transactionId,
                        );
                        const route = createSearchParams(
                          {
                            type: paymentType,
                            email: userEmailFromCardDetails
                              ? userEmailFromCardDetails
                              : userDetails?.email,
                          },
                          "/donation-success",
                          randomToken, // Pass campaign ID as path parameter
                        );
                        persistDonationSuccessSnapshot();
                        router.push(route);
                        setGoogleLoader(false);
                      } else if (result.data.is3dSecureAuthenticationRequired) {
                        if (window.recurly) {
                          setIs3dLoading(true);
                          window.recurly.configure(recurlyKey);
                          const risk = window.recurly.Risk();
                          setIs3d(true);
                          setIs3dError(false);
                          if (typeof window !== "undefined") {
                            scrollToTop();
                          }
                          const threeDSecure = risk.ThreeDSecure({
                            actionTokenId: result.data.token,
                          });
                          threeDSecure.attach(
                            document.querySelector("#my-container"),
                          );
                          const toastId = toast.loading(
                            "Processing your payment...",
                          );
                          setLoadingToastId(toastId);

                          threeDSecure.on("ready", () => {
                            toast.dismiss(toastId);
                            setIs3dLoading(false);
                            const container =
                              document.querySelector("#my-container");
                            const iframe = container?.querySelector("iframe");

                            // If no direct iframe after ready event, it's probably using a modal
                            if (!iframe) {
                              setIs3dDisplayMode("modal");
                            }
                          });
                          threeDSecure.on("error", (err) => {
                            setIsPaymentProcessing(false); // Set when payment starts
                            toast.dismiss(toastId);
                            setIs3d(false);
                            setIs3dLoading(false);
                            threeDSecure.remove(
                              document.querySelector("#my-container"),
                            );
                            setIs3dError(true);
                            toast.error(err.message);
                            // display an error message to your user requesting they retry
                            // or use a different payment method
                          });

                          threeDSecure.on("token", (token) => {
                            setIsPaymentProcessing(true); // Set when payment starts

                            paymentPayload.tokenId =
                              paymentType === "google_pay" ||
                              paymentType === "apple_pay"
                                ? socialToken
                                : cardToken;
                            paymentPayload.paymentMethodId = token.id;
                            paymentPayload.previousTransactionId =
                              result.data.transactionId;
                            postCardPayment(
                              campaignId,
                              paymentPayload,
                              isLogin,
                              utmParameters.utmSource,
                              utmParameters.utmMedium,
                              utmParameters.utmCampaign,
                              utmParameters.utmTerm,
                              utmParameters.utmContent,
                              utmParameters.referral,
                              utmParameters.src,
                              fbc, // Changed from fbclid to fbc
                              event_month,
                              event_day,
                              event_hour,
                              traffic_source,
                              content_ids,
                              content_type,
                              user_roles,
                              url,
                              // contents,
                              purchaseEventId,
                              donateEventId,
                              fbpData,
                              externalId,
                              experimentalFeature,
                              campaignVersion,
                              experimentKey,
                              variationKey,
                              userId,
                            ).then((res) => {
                              setIs3d(false);
                              const result = res?.data;
                              if (result.success) {
                                toast.dismiss(toastId);
                                toast.success(result.message);
                                dispatch(isRecurringHandler(false));
                                paymentPayload.symbol = donationValues?.symbol;
                                paymentPayload.transactionId =
                                  result?.data?.transactionId;
                                dispatch(updatePaymentPayload(paymentPayload));
                                // dispatch(resetDonationState());
                                handleDonationSuccess(
                                  paymentPayload,
                                  utmParameters.utmSource,
                                  utmParameters.utmMedium,
                                  utmParameters.utmCampaign,
                                  utmParameters.utmTerm,
                                  utmParameters.utmContent,
                                  utmParameters.referral,
                                  utmParameters.src,
                                  fbc, // Changed from fbclid to fbc
                                  event_month,
                                  event_day,
                                  event_hour,
                                  traffic_source,
                                  content_ids,
                                  content_type,
                                  user_roles,
                                  url,
                                  // contents,
                                  result?.data?.totalUSDAmount,
                                  result?.data?.transactionId,
                                );

                                const route = createSearchParams(
                                  {
                                    type: paymentType,
                                    email: userEmailFromCardDetails
                                      ? userEmailFromCardDetails
                                      : userDetails?.email,
                                  },
                                  "/donation-success",
                                  randomToken, // Pass campaign ID as path parameter
                                );

                                persistDonationSuccessSnapshot();
                                router.push(route);
                              } else {
                                threeDSecure.remove(
                                  document.querySelector("#my-container"),
                                );
                                toast.error(result.message);
                              }
                            });

                            // send `token.id` to your server to retry your API request
                          });
                        }
                      } else {
                        toast.error(result.message);
                      }
                    })
                    .catch((error) => {
                      console.error(error);
                      toast.error("Something went wrong");
                    })
                    .finally(() => {
                      setIsLoader(false);
                      setGoogleLoader(false);
                    });
                  toast.success(result.message);
                } else {
                  toast.error(result.message);
                }
              });

              // send `token.id` to your server to retry your API request
            });
          }
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoader(false);
        setGoogleLoader(false);
      });
  };

  const postPaymentApi = (userDetailsFromGooglePayment) => {
    let firstName = "";
    let lastName = "";

    if (paymentType === "google_pay") {
      const fullNameInArray = userDetailsFromGooglePayment.name?.split(" ");
      lastName = fullNameInArray[fullNameInArray.length - 1];
      firstName = fullNameInArray
        ?.slice(0, fullNameInArray.length - 1)
        ?.join(" ");
    }

    const totalAmountValue = calculateTotalAmount(
      comingFromRecurringPayment,
      donationValues,
      tipValue,
      isOrderBumpSelected && orderBump?.length > 0 ? orderBump[0]?.amount : 0,
    );

    const processingFeeValue = parseFloat(
      ((processingFee / 100) * totalAmountValue).toFixed(2),
    );

    const total = isProcessingFee
      ? (totalAmountValue + processingFeeValue).toFixed(2)
      : totalAmountValue.toFixed(2);

    const payload = {
      donationAmount:
        selectedBoxData &&
        comingFromRecurringPayment &&
        selectedBoxData.donationType !== "recurringDonation"
          ? 0
          : selectedBoxData
            ? donationValues?.totalAmount
            : comingFromRecurringPayment
              ? 0
              : isOrderBumpSelected
                ? donationValues?.totalAmount
                : donationValues?.totalAmount,
      tipAmount: tipValue,
      donationBumpId:
        isOrderBumpSelected && orderBump?.length > 0 ? orderBump[0]._id : null,
      donationBumpAmount:
        isOrderBumpSelected && orderBump?.length > 0 ? orderBump[0].amount : 0,
      recurringAmount:
        comingFromRecurringPayment &&
        selectedBoxData?.donationType !== "recurringDonation"
          ? donationValues.recurringDonation
          : 0,
      totalAmount: total,
      paymentProcessingFees: processingFeeValue,
      isPaymentProcessingFeesIncluded: isProcessingFee ? true : false,
      currency:
        currency?.currency === undefined
          ? donationValues.units
          : currency.currency.code,
      currencyConversionId:
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? donationValues?.currencyConversionId
          : currency?.currencyConversionId,
      givingLevelId: comingFromRecurringPayment
        ? selectedBoxData?.donationType === "recurringDonation"
          ? selectedBoxData._id
          : null
        : selectedBoxData
          ? selectedBoxData._id
          : null,
      hidePublicVisibility: notDisplayName,
      sharePersonalInfo: provideNameAndEmail,
      isAllowedToSharePhoneNumber: provideNumber,
      isRecurring: comingFromRecurringPayment,
      announcementToken: announcementToken,
      isSavedCard:
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? false
          : isCardSave,
      paymentMethodId:
        paymentType === "credit_card"
          ? cardToken
          : userDetailsFromGooglePayment.token,
      paymentMethodType: paymentType,
      firstName:
        paymentType === "google_pay"
          ? firstName
          : paymentType === "apple_pay"
            ? userDetailsFromGooglePayment.name.firstName
            : userDetails?.firstName,
      lastName:
        paymentType === "google_pay"
          ? lastName
          : paymentType === "apple_pay"
            ? userDetailsFromGooglePayment.name.lastName
            : userDetails?.lastName,
      email:
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? userDetailsFromGooglePayment.email
          : userDetails?.email,
      phoneNumber: userPhoneFromCardDetails,
      postalCode:
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? userDetailsFromGooglePayment.postalCode
          : creditCardDetails?.postalCode,
      country:
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? userDetailsFromGooglePayment.countryCode
          : creditCardDetails?.country,
    };
    // setGooglePayload(payload);

    if (!isLogin) {
      payload.firstName =
        paymentType === "google_pay"
          ? firstName
          : paymentType === "apple_pay"
            ? userDetailsFromGooglePayment.name.firstName
            : cardHolderName.firstName;
      payload.lastName =
        paymentType === "google_pay"
          ? lastName
          : paymentType === "apple_pay"
            ? userDetailsFromGooglePayment.name.lastName
            : cardHolderName.lastName;
      payload.email =
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? userDetailsFromGooglePayment.email
          : cardHolderName.email;
      payload.phoneNumber = userPhoneFromCardDetails;
    }

    if (
      paymentType === "credit_card" ||
      paymentType === "google_pay" ||
      paymentType === "apple_pay"
    ) {
      const successPayload = {
        donationValue: donationValues,
        campaignDetails: campaignDetails,
        announcementToken: announcementToken,
        tip: selectedTip,
        customTipValue: customTipValue,
        isRecurringPaymentSelected: comingFromRecurringPayment,
        isOrderBumpSelected: isOrderBumpSelected,
        processingFeePercentage: isProcessingFee
          ? campaignDetails?.paymentProcessingFeesPercentage
          : 0,
        isProcessingFee: isProcessingFee ? true : false,
      };
      if (paymentType === "google_pay" || paymentType === "apple_pay") {
        if (isLogin && isSaveCard) {
          delete payload.postalCode;
          postCreditCard(
            userDetailsFromGooglePayment.token,
            successPayload,
            payload,
            // userDetailsFromGooglePayment.postalCode,
          );
        } else if (isLogin && !isSaveCard && isCardSave) {
          delete payload.postalCode;
          postCreditCard(
            userDetailsFromGooglePayment.token,
            successPayload,
            payload,
            // userDetailsFromGooglePayment.postalCode,
          );
        } else {
          dispatch(successDonationHandler(successPayload));
          postCardPayment(
            campaignId,
            payload,
            isLogin,
            utmParameters.utmSource,
            utmParameters.utmMedium,
            utmParameters.utmCampaign,
            utmParameters.utmTerm,
            utmParameters.utmContent,
            utmParameters.referral,
            utmParameters.src,
            fbc, // Changed from fbclid to fbc
            event_month,
            event_day,
            event_hour,
            traffic_source,
            content_ids,
            content_type,
            user_roles,
            url,
            // contents,
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
              if (result.success) {
                toast.success(result.message);
                payload.symbol = donationValues?.symbol;
                payload.transactionId = result?.data?.transactionId;
                dispatch(updatePaymentPayload(payload));
                // dispatch(updateCampaignId(campaignId));
                dispatch(isRecurringHandler(false));
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
                  fbc, // Changed from fbclid to fbc
                  event_month,
                  event_day,
                  event_hour,
                  traffic_source,
                  content_ids,
                  content_type,
                  user_roles,
                  // contents,
                  url,
                  result?.data?.totalUSDAmount,
                  result?.data?.transactionId,
                );
                const route = createSearchParams(
                  {
                    type: paymentType,
                    email: userEmailFromCardDetails
                      ? userEmailFromCardDetails
                      : userDetails?.email,
                  },
                  "/donation-success",
                  randomToken, // Pass campaign ID as path parameter
                );
                persistDonationSuccessSnapshot();
                router.push(route);
                setGoogleLoader(false);
              } else if (result.data.is3dSecureAuthenticationRequired) {
                if (window.recurly) {
                  setIs3dLoading(true);
                  window.recurly.configure(recurlyKey);
                  const risk = window.recurly.Risk();
                  setIs3d(true);
                  setIs3dError(false);
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
                    setIs3dLoading(false);
                    const container = document.querySelector("#my-container");
                    const iframe = container?.querySelector("iframe");

                    // If no direct iframe after ready event, it's probably using a modal
                    if (!iframe) {
                      setIs3dDisplayMode("modal");
                    }
                  });
                  threeDSecure.on("error", (err) => {
                    setIsPaymentProcessing(false); // Set when payment starts

                    toast.dismiss(loadingToast);
                    setIs3dLoading(false);
                    setIs3d(false);
                    threeDSecure.remove(
                      document.querySelector("#my-container"),
                    );
                    setIs3dError(true);
                    toast.error(err.message);
                    // display an error message to your user requesting they retry
                    // or use a different payment method
                  });

                  threeDSecure.on("token", (token) => {
                    setIsPaymentProcessing(true); // Set when payment starts

                    payload.tokenId =
                      paymentType === "google_pay" ||
                      paymentType === "apple_pay"
                        ? userDetailsFromGooglePayment?.token
                        : cardToken;
                    payload.paymentMethodId = token.id;
                    payload.previousTransactionId = result.data.transactionId;
                    postCardPayment(
                      campaignId,
                      payload,
                      isLogin,
                      utmParameters.utmSource,
                      utmParameters.utmMedium,
                      utmParameters.utmCampaign,
                      utmParameters.utmTerm,
                      utmParameters.utmContent,
                      utmParameters.referral,
                      utmParameters.src,
                      fbc, // Changed from fbclid to fbc
                      event_month,
                      event_day,
                      event_hour,
                      traffic_source,
                      content_ids,
                      content_type,
                      user_roles,
                      url,
                      // contents,
                      purchaseEventId,
                      donateEventId,
                      fbpData,
                      externalId,
                      experimentalFeature,
                      campaignVersion,
                      experimentKey,
                      variationKey,
                      userId,
                    ).then((res) => {
                      setIs3d(false);
                      const result = res?.data;
                      if (result.success) {
                        toast.dismiss(loadingToast);
                        toast.success(result.message);
                        payload.symbol = donationValues?.symbol;
                        payload.transactionId = result?.data?.transactionId;
                        dispatch(updatePaymentPayload(payload));
                        dispatch(isRecurringHandler(false));
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
                          fbc, // Changed from fbclid to fbc
                          event_month,
                          event_day,
                          event_hour,
                          traffic_source,
                          content_ids,
                          content_type,
                          user_roles,
                          url,
                          // contents,
                          result?.data?.totalUSDAmount,
                          result?.data?.transactionId,
                        );

                        const route = createSearchParams(
                          {
                            id: randomToken,
                            type: paymentType,
                            email: userEmailFromCardDetails
                              ? userEmailFromCardDetails
                              : userDetails?.email,
                          },
                          "/donation-success",
                        );

                        persistDonationSuccessSnapshot();
                        router.push(route);
                      } else {
                        threeDSecure.remove(
                          document.querySelector("#my-container"),
                        );
                        toast.error(result.message);
                      }
                    });

                    // send `token.id` to your server to retry your API request
                  });
                }
              } else {
                toast.error(result.message);
              }
            })
            .catch((error) => {
              console.error(error);
              toast.error("Something went wrong");
            })
            .finally(() => {
              setIsLoader(false);
              setGoogleLoader(false);
            });
        }
      } else {
        dispatch(successDonationHandler(successPayload));
        postCardPayment(
          campaignId,
          payload,
          isLogin,
          utmParameters.utmSource,
          utmParameters.utmMedium,
          utmParameters.utmCampaign,
          utmParameters.utmTerm,
          utmParameters.utmContent,
          utmParameters.referral,
          utmParameters.src,
          fbc, // Changed from fbclid to fbc
          event_month,
          event_day,
          event_hour,
          traffic_source,
          content_ids,
          content_type,
          user_roles,
          url,
          // contents,
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
            if (result.success) {
              toast.success(result.message);
              payload.symbol = donationValues?.symbol;
              payload.transactionId = result?.data?.transactionId;
              dispatch(updatePaymentPayload(payload));
              // dispatch(updateCampaignId(campaignId));
              dispatch(isRecurringHandler(false));
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
                fbc, // Changed from fbclid to fbc
                event_month,
                event_day,
                event_hour,
                traffic_source,
                content_ids,
                content_type,
                user_roles,
                url,
                // contents,
                result?.data?.totalUSDAmount,
                result?.data?.transactionId,
              );
              const route = createSearchParams(
                {
                  type: paymentType,
                  email: userEmailFromCardDetails
                    ? userEmailFromCardDetails
                    : userDetails?.email,
                },
                "/donation-success",
                randomToken, // Pass campaign ID as path parameter
              );
              persistDonationSuccessSnapshot();
              router.push(route);
              setGoogleLoader(false);
            } else if (result.data.is3dSecureAuthenticationRequired) {
              if (window.recurly) {
                setIs3dLoading(true);
                window.recurly.configure(recurlyKey);
                const risk = window.recurly.Risk();
                setIs3d(true);
                setIs3dError(false);
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
                  setIs3dLoading(false);

                  const container = document.querySelector("#my-container");
                  const iframe = container?.querySelector("iframe");

                  // If no direct iframe after ready event, it's probably using a modal
                  if (!iframe) {
                    setIs3dDisplayMode("modal");
                  }
                });
                threeDSecure.on("error", (err) => {
                  setIsPaymentProcessing(false); // Set when payment starts

                  toast.dismiss(loadingToast);
                  setIs3dLoading(false);
                  setIs3d(false);
                  threeDSecure.remove(document.querySelector("#my-container"));
                  setIs3dError(true);
                  toast.error(err.message);
                  // display an error message to your user requesting they retry
                  // or use a different payment method
                });

                threeDSecure.on("token", (token) => {
                  setIsPaymentProcessing(true); // Set when payment starts

                  payload.tokenId =
                    paymentType === "google_pay" || paymentType === "apple_pay"
                      ? userDetailsFromGooglePayment?.token
                      : cardToken;
                  payload.paymentMethodId = token.id;
                  payload.previousTransactionId = result.data.transactionId;
                  postCardPayment(
                    campaignId,
                    payload,
                    isLogin,
                    utmParameters.utmSource,
                    utmParameters.utmMedium,
                    utmParameters.utmCampaign,
                    utmParameters.utmTerm,
                    utmParameters.utmContent,
                    utmParameters.referral,
                    utmParameters.src,
                    fbc, // Changed from fbclid to fbc
                    event_month,
                    event_day,
                    event_hour,
                    traffic_source,
                    content_ids,
                    content_type,
                    user_roles,
                    url,
                    // contents,
                    purchaseEventId,
                    donateEventId,
                    fbpData,
                    externalId,
                    experimentalFeature,
                    campaignVersion,
                    experimentKey,
                    variationKey,
                    userId,
                  ).then((res) => {
                    setIs3d(false);
                    const result = res?.data;
                    if (result.success) {
                      toast.dismiss(loadingToast);
                      toast.success(result.message);
                      dispatch(isRecurringHandler(false));
                      payload.symbol = donationValues?.symbol;
                      payload.transactionId = result?.data?.transactionId;
                      dispatch(updatePaymentPayload(payload));

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
                        fbc, // Changed from fbclid to fbc
                        event_month,
                        event_day,
                        event_hour,
                        traffic_source,
                        content_ids,
                        content_type,
                        user_roles,
                        url,
                        // contents,
                        result?.data?.totalUSDAmount,
                        result?.data?.transactionId,
                      );

                      const route = createSearchParams(
                        {
                          type: paymentType,
                          email: userEmailFromCardDetails
                            ? userEmailFromCardDetails
                            : userDetails?.email,
                        },
                        "/donation-success",
                        randomToken, // Pass campaign ID as path parameter
                      );

                      persistDonationSuccessSnapshot();
                      router.push(route);
                    } else {
                      threeDSecure.remove(
                        document.querySelector("#my-container"),
                      );
                      toast.error(result.message);
                    }
                  });

                  // send `token.id` to your server to retry your API request
                });
              }
            } else {
              toast.error(result.message);
            }
          })
          .catch((error) => {
            console.error(error);
            toast.error("Something went wrong");
          })
          .finally(() => {
            setIsLoader(false);
            setGoogleLoader(false);
          });
      }
    }
  };

  useEffect(() => {
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
        event_hour: dayjs().format("H-") + (parseInt(dayjs().format("H")) + 1),
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
      // window.fbq("track", "AddToCart", fbqData);
      // window.fbq("track", "InitiateCheckout", fbqData);
      window.fbq("track", "AddPaymentInfo", fbqData, {
        URL: window.location.href,
        eventID: eventId,
        fbp: fbpData,
        external_id: externalId,
      });

      const payload = {
        campaignId: campaignDetails?._id,
        totalAmount: fbqData.value,
        currency: "USD",
        givingLevelTitle: fbqData.givingLevel,
        utmSource: fbqData?.utmSource,
        utmMedium: fbqData?.utmMedium,
        utmCampaign: fbqData?.utmCampaign,
        utmTerm: fbqData?.utmTerm,
        utmContent: fbqData?.utmContent,
        referral: fbqData?.referral,
        src: fbqData?.src,
        fbc: fbc, // Changed from fbclid to fbc
        event_month,
        event_day,
        event_hour,
        traffic_source,
        content_ids,
        content_type,
        user_roles,
        url,
        // contents,
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
        currency: "USD",
        givingLevelTitle: fbqData.givingLevel,
        utmSource: fbqData?.utmSource,
        utmMedium: fbqData?.utmMedium,
        utmCampaign: fbqData?.utmCampaign,
        utmTerm: fbqData?.utmTerm,
        utmContent: fbqData?.utmContent,
        referral: fbqData?.referral,
        src: fbqData?.src,
        fbc: fbc, // Changed from fbclid to fbc
        event_month,
        event_day,
        event_hour,
        traffic_source,
        content_ids,
        content_type,
        user_roles,
        url,
        // contents,
        eventId: eventId,
        fbp: fbpData,
        externalId: externalId,
        eventName: "AddPaymentInfo",
      };

      // getAddToCartFbTags(payload).catch((err) =>
      //   console.error(err, "Add to card script did not work"),
      // );<
      savePixelLogs(pixelPayload, campaignId);
      getPaymentInfoFbTags(payload).catch((err) =>
        console.error(err, "Payment info script did not work"),
      );
    }
  }, []);

  useEffect(() => {
    if (is3dError) {
      onError(true);
    }
  }, [is3dError, onError]);

  const orderBump = sellConfigs?.filter((item) => item.type === "orderBump");

  return (
    <>
      <ThreeDSecureAuthentication isLoading={is3dLoading}>
        <div
          style={{
            height: is3d && is3dDisplayMode === "inline" ? "400px" : 0,
          }}
          id="my-container"
        />
      </ThreeDSecureAuthentication>
      <SelectAbleLevel
        isActive={true}
        heading={donationValues.title}
        title={donationValues.description}
        amount={
          comingFromRecurringPayment
            ? formatNumberWithCommas(
                donationValues.recurringDonation?.toFixed(2),
              )
            : formatNumberWithCommas(donationValues?.totalAmount?.toFixed(2))
        }
        currencySymbol={donationValues.symbol}
        currencyUnit={donationValues.units}
        isIcon={false}
        height={{ xs: "100%", sm: "100px" }}
      />
      <BoxComponent sx={{ mt: 3 }}>
        <SubHeading>Tip Madinah services</SubHeading>
        <Paragraph>
          Madinah has a 0% platform fee for organizers. Madinah will continue
          offering its services thanks to donors who will leave an optional
          amount here.
        </Paragraph>
        <AddTip
          amount={
            comingFromRecurringPayment
              ? donationValues.recurringDonation
              : donationValues?.totalAmount
          }
          selectedTip={selectedTip}
          setSelectedTip={setSelectedTip}
          customTipValue={customTipValue}
          setCustomTipValue={setCustomTipValue}
          currencySymbol={donationValues.symbol}
        />
        <BoxComponent sx={{ marginTop: "-2px" }}>
          <CheckBoxComp
            ml={isSmallScreen ? -2 : -2}
            mt={isSmallScreen ? 0.3 : 0.3}
            specialIcon={true}
            customCheckbox={true}
            specialIconColor={"#0CAB72"}
            label="Include payment processing fee"
            checked={isProcessingFee}
            onChange={(e) => {
              setIsProcessingFee(e.target.checked);
            }}
          />
        </BoxComponent>
        <CheckBoxComp
          ml={-2}
          mt={0.3}
          sx={{ marginTop: "-2px" }}
          specialIcon={true}
          customCheckbox={true}
          specialIconColor={"#0CAB72"}
          label="Receive email updates"
          checked={provideNameAndEmail}
          onChange={(e) => {
            setProvideNameAndEmail(e.target.checked);
            dispatch(provideNameAndEmailHandler(e.target.checked));
          }}
        />
        <CheckBoxComp
          ml={-2}
          mt={0.3}
          sx={{ marginTop: "-2px" }}
          specialIcon={true}
          customCheckbox={true}
          specialIconColor={"#0CAB72"}
          label="Receive SMS updates"
          checked={provideNumber}
          onChange={(e) => {
            setProvideNumber(e.target.checked);
            dispatch(provideNumberHandler(e.target.checked));
          }}
        />
        <CheckBoxComp
          ml={-2}
          mt={0.3}
          specialIcon={true}
          customCheckbox={true}
          specialIconColor={"#0CAB72"}
          label="Don't display my name publicly on the fundraiser"
          checked={notDisplayName}
          onChange={(e) => setNotDisplayName(e.target.checked)}
        />
        {orderBump && orderBump.length > 0 ? (
          <DonationBump
            orderBump={orderBump?.length > 0 ? orderBump[0] : ""}
            toggleOrderBump={toggleOrderBump}
            isOrderBumpSelected={isOrderBumpSelected}
            currency={donationValues?.symbol}
          />
        ) : null}
      </BoxComponent>
      <YourDonation
        donationValue={donationValues}
        tip={selectedTip}
        customTipValue={customTipValue}
        isRecurringPaymentSelected={comingFromRecurringPayment}
        isOrderBumpSelected={isOrderBumpSelected ? isOrderBumpSelected : false}
        processingFeePercentage={
          isProcessingFee ? campaignDetails?.paymentProcessingFeesPercentage : 0
        }
        isProcessingFee={isProcessingFee ? isProcessingFee : false}
      />
      <StackComponent direction={"row"} justifyContent="flex-end">
        {paymentType === "apple_pay" ? (
          googleLoader || is3d || is3dError ? (
            <ButtonComp
              padding="12px "
              size="normal"
              sx={{ width: { xs: "100%", sm: "135px" } }}
              disabled={is3d || is3dError || googleLoader}
            >
              Donating...
            </ButtonComp>
          ) : (
            <ApplePay
              tipValue={tipValue}
              donationValues={donationValues}
              onClickHandler={paymentButtonHandler}
              setGoogleLoader={setGoogleLoader}
              orderBump={
                orderBump && orderBump.length > 0 && isOrderBumpSelected
                  ? orderBump[0].amount
                  : 0
              }
              processingFee={isProcessingFee ? processingFee : 0}
            />
          )
        ) : paymentType === "google_pay" ? (
          googleLoader || is3d || is3dError ? (
            <ButtonComp
              padding="12px "
              size="normal"
              sx={{ width: { xs: "100%", sm: "135px" } }}
              disabled={is3d || is3dError || googleLoader}
            >
              Donating...
            </ButtonComp>
          ) : (
            <GooglePay
              onClickHandler={paymentButtonHandler}
              tipValue={tipValue}
              donationValues={donationValues}
              setGoogleLoader={setGoogleLoader}
              orderBump={
                orderBump && orderBump.length > 0 && isOrderBumpSelected
                  ? orderBump[0].amount
                  : 0
              }
              processingFee={isProcessingFee ? processingFee : 0}
            />
          )
        ) : (
          <ButtonComp
            padding="12px "
            size="normal"
            sx={{ width: { xs: "100%", sm: "135px" } }}
            onClick={paymentButtonHandler}
            disabled={is3d || is3dError || isLoader}
          >
            {isLoader ? "Loading...." : "Pay Now"}
          </ButtonComp>
        )}
      </StackComponent>
    </>
  );
};

PaymentSummary.propTypes = {
  cardToken: PropTypes.string,
};

export default memo(PaymentSummary);
