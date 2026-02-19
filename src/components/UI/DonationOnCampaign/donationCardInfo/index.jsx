"use client";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import DonationTemplate from "@/components/templates/donationTemplate/DonationTemplate";
import MemoizedDonationCardInfoForm from "./DonationCardInfoForm";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { useDispatch } from "react-redux";
import {
  cardTokenHandler,
  creditCardDetailsHandler,
  isRecurringHandler,
  isSavedCardContinueHandler,
  resetDonationState,
  saveCardHolderNameHandler,
} from "@/store/slices/donationSlice";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { SignUpSchema } from "./FormFields/validation";
import axios from "axios";
import {
  calculateTotalAmount,
  formatNumberWithCommas,
  generateRandomToken,
  getUTMParams,
  scrollToTop,
} from "@/utils/helpers";
import {
  cardHolderValuesHandler,
  feedbackTokensHandler,
  isSaveCardContinueSellHandler,
  successDonationHandler,
  yourDonationDataHandler,
} from "@/store/slices/successDonationSlice";
import {
  getPaymentInfoFbTags,
  postCardPayment,
  useGetCreditCardList,
} from "@/api";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { updatePaymentPayload } from "@/store/slices/sellConfigSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import ThreeDSecureAuthentication from "@/components/advance/ThreeDSecureAuthentication";
import {
  googleTagLogs,
  googleTagServer,
  handlePosthog,
  postCardDetails,
  savePixelLogs,
} from "@/api/post-api-services";
import GridComp from "@/components/atoms/GridComp/GridComp";
import { fbqWithConsent } from "@/utils/trackingPreventionUtils";
import SelectAbleIconField from "@/components/atoms/selectAbleField/SelectAbleIconField";
import {
  getCardIcon,
  AUTOMATIC_DONATION_DAYS,
  CONSENT_COOKIE_NAME,
} from "@/config/constant";
import { usePathname } from "next/navigation";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// import posthog from "posthog-js";

const DonationCardInfo = ({ activeStep, setActiveStep, setCurrentIndex }) => {
  // Function to get the recurring type title from constants
  const getRecurringTypeTitle = (recurringType) => {
    const recurringOption = AUTOMATIC_DONATION_DAYS.find(
      (option) => option.value === recurringType,
    );

    if (!recurringOption) return "";

    // Return the full label from constants
    return recurringOption.label;
  };
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const experimentKey = localStorage.getItem("experimentKey");
  const variationKey = localStorage.getItem("variationKey");
  const userId = localStorage.getItem("gb_visitor_id");
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const isLogin = getCookie("token");
  const cardNumberRedux = useSelector(
    (state) => state.donation?.creditCardDetails?.number,
  );
  const recurringType = useSelector((state) => state.donation.recurringType);
  const comment = useSelector((state) => state.donation?.donationComment);
  const expiryDateRexux = useSelector(
    (state) => state.donation?.creditCardDetails?.expiryDate,
  );
  const saveCardHolderName = useSelector(
    (state) => state?.donation?.saveCardHolderName,
  );
  const [saveCardToken, setSaveCardToken] = useState(null);
  const isSaveCardForFuture = useSelector(
    (state) => state.donation?.isSaveCardForFuture,
  );
  const isRecurring = useSelector((state) => state?.donation?.isRecurring);
  const tipAmount = useSelector((state) => state.donation?.tipAmount);
  const processingFeeAmount = useSelector(
    (state) => state.donation.processingFee,
  );
  const nameOnCard = useSelector(
    (state) =>
      `${state?.donation?.cardHolderName?.firstName} ${state?.donation?.cardHolderName?.lastName}`,
  );
  const isCardSave = useSelector((state) => state.donation.isSaveCardContinue);
  const donation = useSelector((state) => state.donation);
  const cvv = useSelector((state) => state.donation?.creditCardDetails?.cvv);
  const comingFromRecurringPayment = useSelector(
    (state) => state.donation.isRecurring,
  );
  // const [is3dError, setIs3dError] = useState(false);

  const {
    data: creditCardList,
    // isLoading,
    // isError,
    // error,
  } = useGetCreditCardList({ enabled: isLogin ? true : false });

  const [newLoader, setNewLoader] = useState(false);

  const donationValues = useSelector((state) => state.donation.donationValues);
  const tipValue = useSelector((state) => state.donation.tipAmount);
  const selectedBoxData = useSelector(
    (state) => state.donation.selectedBoxData,
  );
  const campaignId = useSelector((state) => state.donation.campaignId);

  const provideNameAndEmail = useSelector(
    (state) => state?.donation?.provideNameAndEmail,
  );

  const provideNumber = useSelector((state) => state?.donation?.provideNumber);

  const currency = useSelector((state) => state.donation.currencySymbol);
  const announcementToken = useSelector(
    (state) => state.donation.announcementToken,
  );
  const isSaveCardContinue = useSelector(
    (state) => state.donation?.isSaveCardContinue,
  );
  const campaignDetails = useSelector(
    (state) => state.donation?.campaignDetails,
  );
  const fbpData = getCookie("_fbp");
  const externalId = getCookie("externalId");
  const experimentalFeature = getCookie("abtesting");
  const campaignVersion = getCookie("campaign_testing");
  const campaignPixelId = useSelector(
    (state) => state?.campaign?.campaignerId?.pixelId,
  );
  const campaignGtmId = useSelector(
    (state) => state?.campaign?.campaignerId?.gtmId,
  );
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
  // const contents = [
  //   { name: campaignName, category: categoryName, id: campaignId, quantity: 1, item_price: donationValues?.totalAmount },
  // ];
  const hasUrlChanged = useRef(false);
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);

  const purchaseEventId = generateRandomToken("a", 5) + dayjs().unix();
  const donateEventId = generateRandomToken("a", 5) + dayjs().unix();
  // const router = useRouter();
  const recurlyKey = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;
  const [is3dLoading, setIs3dLoading] = useState(false);
  const [is3d, setIs3d] = useState(false);
  const [is3dDisplayMode, setIs3dDisplayMode] = useState("inline"); // 'inline' or 'modal'
  const [isStoredCardSelected, setIsStoredCardSelected] = useState(
    isSaveCardContinue ? 0 : null,
  );

  const getCardDetails = creditCardList?.data.data.cards;

  const paymentType = "credit_card";
  const isSaveCard = getCardDetails?.length > 0 ? true : false;
  const formik = useFormik({
    initialValues: {
      cardNumber: cardNumberRedux || "",
      expiryDate: expiryDateRexux || "",
      cvv: cvv || "",
    },
    validationSchema: SignUpSchema,
    // onSubmit: (values) => {
    //   onClick(values);
    // },
  });

  const nextButtonHandler = async () => {
    setIsLoader(true);
    if (!isSaveCardContinue) {
      dispatch(
        creditCardDetailsHandler({
          number: formik?.values?.cardNumber,
          cvv: formik?.values?.cvv,
          expiryDate: formik?.values?.expiryDate,
          nameOnCard: nameOnCard,
        }),
      );
      const parts = formik?.values?.expiryDate?.split("/");
      const month = parts[0];
      const year = parts[1];
      const publicApi = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;
      const data = new URLSearchParams({
        first_name: donation?.cardHolderName?.firstName,
        last_name: donation?.cardHolderName?.lastName,
        number: formik?.values?.cardNumber,
        month: month,
        year: year,
        cvv: formik?.values?.cvv,
        version: "3.1.0",
        key: publicApi,
      }).toString();

      const queryString = data.toString();
      const tokenData = await axios({
        method: "get",
        url: `https://api.recurly.com/js/v1/token?${queryString}`,
      });
      dispatch(cardHolderValuesHandler(queryString));
      if (tokenData.status === 200 && tokenData.data.type) {
        const token = tokenData.data.id;
        dispatch(cardTokenHandler(token));
        // Moved setActiveStep after dispatching cardTokenHandler
        if (isLogin && isSaveCard) {
          postCreditCard(token);
        } else if (isLogin && !isSaveCard && isSaveCardForFuture) {
          postCreditCard(token);
        } else if (isLogin && !isSaveCard && !isSaveCardForFuture) {
          postPaymentApi(null, token);
          setIsLoader(false);
        } else {
          postPaymentApi(null, token);
          setIsLoader(false);
        }
        // setTimeout(() => {
        //   setActiveStep((prevActiveStep) => {
        //     setCurrentIndex(prevActiveStep);
        //     return prevActiveStep + 1;
        //   });
        // }, 0);
      } else {
        toast.error(tokenData.data.error.message);
        setIsLoader(false);
      }
    } else {
      dispatch(isSaveCardContinueSellHandler(true));
      dispatch(cardTokenHandler(donation?.saveCardHolderName?.cardToken));
      postPaymentApi(null, donation?.saveCardHolderName?.cardToken);
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

  const postCreditCard = (token, postalCode) => {
    const payload = {
      cardToken: token,
      postalCode: postalCode,
    };
    postCardDetails(payload)
      .then((res) => {
        const result = res?.data;

        if (result.success) {
          // toast.success(result.message);

          toast.success("Card details added successfully");
          postPaymentApi(null, token);
        } else if (result.data.is3dSecureAuthenticationRequired) {
          if (window.recurly) {
            window.recurly.configure(recurlyKey);
            const risk = window.recurly.Risk();
            setIs3d(true);
            // if (typeof window !== "undefined") {
            //   scrollToComponent();
            // }
            const threeDSecure = risk.ThreeDSecure({
              actionTokenId: result.data.token,
            });
            threeDSecure.attach(document.querySelector("#my-container"));
            threeDSecure.on("error", (err) => {
              setIs3d(false);
              threeDSecure.remove(document.querySelector("#my-container"));
              toast.error(err.message);
              // display an error message to your user requesting they retry
              // or use a different payment method
            });

            threeDSecure.on("token", (newToken) => {
              payload.previousCardToken = token;
              payload.cardToken = newToken.id;
              threeDSecure.remove(document.querySelector("#my-container"));
              // payload.previousTransactionId = result.data.transactionId;
              postCardDetails(payload).then((res) => {
                setIs3d(false);
                const result = res?.data;
                if (result.success) {
                  toast.success(result.message);
                  postPaymentApi(null, newToken.id, true);
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
      });
  };

  console.log("cardtoken", saveCardToken);

  const getRecurringType = () => {
    if (recurringType === "oneTime") {
      return null;
    }
    if (recurringType === "monthly") {
      return "monthly";
    }
    if (selectedBoxData) {
      return selectedBoxData?.recurringType;
    }
    return recurringType;
  };

  const getDonationAmount = () => {
    if (recurringType === "oneTime") {
      return donationValues?.totalAmount;
    }
    if (
      selectedBoxData &&
      comingFromRecurringPayment &&
      selectedBoxData.donationType !== "recurringDonation"
    ) {
      return 0;
    }
    if (selectedBoxData) {
      return donationValues?.totalAmount;
    }
    if (comingFromRecurringPayment) {
      return 0;
    }
    return donationValues?.totalAmount;
  };

  const getRecurringAmount = () => {
    if (recurringType === "oneTime") {
      return 0;
    }
    if (
      comingFromRecurringPayment &&
      selectedBoxData?.donationType !== "recurringDonation"
    ) {
      return donationValues?.recurringDonation;
    }
    return 0;
  };

  const postPaymentApi = (
    userDetailsFromGooglePayment,
    cardToken,
    savedCard = false,
  ) => {
    const cfCountry =
      typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;

    const totalAmountValue = calculateTotalAmount(
      comingFromRecurringPayment,
      donationValues,
      tipValue,
    );
    const processingFeeValue = donation.processingFee;
    const total = processingFeeValue
      ? (totalAmountValue + processingFeeValue).toFixed(2)
      : totalAmountValue.toFixed(2);

    const payload = {
      donationAmount: getDonationAmount(),
      tipAmount: tipValue,
      countryCode: cfCountry,
      recurringType: getRecurringType(),
      recurringAmount: getRecurringAmount(),
      totalAmount: total,
      paymentProcessingFees: processingFeeValue,
      isPaymentProcessingFeesIncluded: processingFeeValue ? true : false,
      currency:
        currency?.currency === undefined
          ? donation?.currencySymbol?.units || donation?.donationValues?.units
          : currency.currency.code,
      currencyConversionId: currency?.currencyConversionId,
      givingLevelId: comingFromRecurringPayment
        ? selectedBoxData?.donationType === "recurringDonation"
          ? selectedBoxData._id
          : null
        : selectedBoxData
          ? selectedBoxData._id
          : null,
      hidePublicVisibility: donation.publicVisibility,
      sharePersonalInfo: provideNameAndEmail,
      isAllowedToSharePhoneNumber: provideNumber,
      isRecurring:
        recurringType === "oneTime" ? false : comingFromRecurringPayment,
      announcementToken: announcementToken,
      isSavedCard: savedCard ? true : isCardSave,
      paymentMethodId: cardToken,
      paymentMethodType: "credit_card",
      firstName: isCardSave
        ? saveCardHolderName?.firstName
        : donation?.cardHolderName?.firstName,
      lastName: isCardSave
        ? saveCardHolderName?.lastName
        : donation?.cardHolderName?.lastName,
      email: donation?.cardHolderName?.email,
      phoneNumber: donation?.cardHolderName?.phoneNumber,
      comment: comment,
      isConsentForFbEvents: parsedConsent?.marketing || false,
    };

    const successPayload = {
      donationValue: donationValues,
      campaignDetails: campaignDetails,
      announcementToken: announcementToken,
      tip: tipValue ? true : false,
      customTipValue: tipValue,
      isRecurringPaymentSelected: comingFromRecurringPayment,
      processingFeePercentage: processingFeeValue
        ? campaignDetails?.paymentProcessingFeesPercentage
        : 0,
      isProcessingFee: processingFeeValue ? true : false,
    };
    if (paymentType === "google_pay" || paymentType === "apple_pay") {
      if (isLogin && isSaveCard) {
        delete payload.postalCode;
      } else if (isLogin && !isSaveCard) {
        delete payload.postalCode;
      } else {
        dispatch(successDonationHandler(successPayload));
        setNewLoader(true);
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
            if (result.success) {
              toast.success(result.message, { duration: 10000 });
              payload.symbol =
                donation?.currencySymbol?.symbol ||
                donation?.donationValues?.symbol;
              payload.transactionId = result?.data?.transactionId;
              dispatch(updatePaymentPayload(payload));
              dispatch(isRecurringHandler(false));
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
              const tokenPayload = {
                paymentId: result?.data?.transactionId,
                feedbackToken: result?.data?.feedbackToken,
              };
              const yourDonationPayload = {
                recurringType: result?.data?.recurringType,
                totalAmount: result?.data?.unitAmount,
                totalPayments: result?.data?.totalBillingCycles,
                startDate: result?.data?.startDate,
                endDate: result?.data?.endDate,
                nextInvoice: result?.data?.currentPeriodEndsAt,
                units:
                  donation?.currencySymbol?.units ||
                  donation?.donationValues?.units ||
                  currency.currency.code,
                symbol:
                  donation?.currencySymbol?.symbol ||
                  donation?.donationValues?.symbol,
              };
              dispatch(yourDonationDataHandler(yourDonationPayload));
              dispatch(feedbackTokensHandler(tokenPayload));
              setNewLoader(false);
              if (parsedConsent?.analytics || !consentCookie) {
                const userId = getCookie("distinctId");
                const utmParams = getUTMParams(window.location.href);
                const posthogPayload = {
                  distinctId: userId,
                  event: "Donation Made Successfully",
                  properties: {
                    $current_url: window?.location?.href,
                    ...utmParams,
                  },
                };
                enhancedHandlePosthog(
                  handlePosthog,
                  posthogPayload,
                  campaignDetails?.title || "Campaign Page",
                );
              }
              setActiveStep((prevActiveStep) => {
                setCurrentIndex(prevActiveStep);
                return prevActiveStep + 1;
              });
            } else if (result.data.is3dSecureAuthenticationRequired) {
              if (window.recurly) {
                setIs3dLoading(true);
                setNewLoader(true);
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
                  toast.dismiss(loadingToast);
                  setIs3dLoading(false);
                  setIs3d(false);
                  setNewLoader(false);
                  threeDSecure.remove(document.querySelector("#my-container"));
                  // setIs3dError(true);
                  toast.error(err.message);
                  // display an error message to your user requesting they retry
                  // or use a different payment method
                });

                threeDSecure.on("token", (token) => {
                  threeDSecure.remove(document.querySelector("#my-container"));

                  payload.tokenId =
                    paymentType === "google_pay" || paymentType === "apple_pay"
                      ? userDetailsFromGooglePayment?.token
                      : cardToken;
                  payload.paymentMethodId = token.id;
                  payload.previousTransactionId = result.data.transactionId;
                  setNewLoader(true);
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
                  ).then((res) => {
                    setIs3d(false);
                    const result = res?.data;
                    if (result.success) {
                      toast.dismiss(loadingToast);
                      toast.success(result.message, { duration: 10000 });
                      payload.symbol =
                        donation?.currencySymbol?.symbol ||
                        donation?.donationValues?.symbol;
                      payload.transactionId = result?.data?.transactionId;

                      dispatch(updatePaymentPayload(payload));
                      dispatch(isRecurringHandler(false));
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
                      const tokenPayload = {
                        paymentId: result?.data?.transactionId,
                        feedbackToken: result?.data?.feedbackToken,
                      };
                      const yourDonationPayload = {
                        recurringType: result?.data?.recurringType,
                        totalAmount: result?.data?.unitAmount,
                        totalPayments: result?.data?.totalBillingCycles,
                        startDate: result?.data?.startDate,
                        endDate: result?.data?.endDate,
                        nextInvoice: result?.data?.currentPeriodEndsAt,
                        units:
                          donation?.currencySymbol?.units ||
                          donation?.donationValues?.units ||
                          currency.currency.code,
                        symbol:
                          donation?.currencySymbol?.symbol ||
                          donation?.donationValues?.symbol,
                      };
                      dispatch(yourDonationDataHandler(yourDonationPayload));
                      dispatch(feedbackTokensHandler(tokenPayload));
                      setNewLoader(false);
                      if (parsedConsent?.analytics || !consentCookie) {
                        const userId = getCookie("distinctId");
                        const utmParams = getUTMParams(window.location.href);
                        const posthogPayload = {
                          distinctId: userId,
                          event: "Donation Made Successfully",
                          properties: {
                            $current_url: window?.location?.href,
                            ...utmParams,
                          },
                        };
                        enhancedHandlePosthog(
                          handlePosthog,
                          posthogPayload,
                          campaignDetails?.title || "Campaign Page",
                        );
                      }
                      setActiveStep((prevActiveStep) => {
                        setCurrentIndex(prevActiveStep);
                        return prevActiveStep + 1;
                      });
                    } else {
                      threeDSecure.remove(
                        document.querySelector("#my-container"),
                      );
                      toast.error(result.message);
                    }
                  });
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
          });
      }
    } else {
      dispatch(successDonationHandler(successPayload));
      setNewLoader(true);
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
          if (result.success) {
            toast.success(result.message, { duration: 10000 });
            payload.symbol =
              donation?.currencySymbol?.symbol ||
              donation?.donationValues?.symbol;
            payload.transactionId = result?.data?.transactionId;
            dispatch(updatePaymentPayload(payload));
            dispatch(isRecurringHandler(false));
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
            const tokenPayload = {
              paymentId: result?.data?.transactionId,
              feedbackToken: result?.data?.feedbackToken,
            };
            const yourDonationPayload = {
              recurringType: result?.data?.recurringType,
              totalAmount: result?.data?.unitAmount,
              totalPayments: result?.data?.totalBillingCycles,
              startDate: result?.data?.startDate,
              endDate: result?.data?.endDate,
              nextInvoice: result?.data?.currentPeriodEndsAt,
              units:
                donation?.currencySymbol?.units ||
                donation?.donationValues?.units ||
                currency.currency.code,
              symbol:
                donation?.currencySymbol?.symbol ||
                donation?.donationValues?.symbol,
            };
            dispatch(yourDonationDataHandler(yourDonationPayload));
            dispatch(feedbackTokensHandler(tokenPayload));
            setNewLoader(false);
            if (parsedConsent?.analytics || !consentCookie) {
              const userId = getCookie("distinctId");
              const utmParams = getUTMParams(window.location.href);
              const posthogPayload = {
                distinctId: userId,
                event: "Donation Made Successfully",
                properties: {
                  $current_url: window?.location?.href,
                  ...utmParams,
                },
              };
              enhancedHandlePosthog(
                handlePosthog,
                posthogPayload,
                campaignDetails?.title || "Campaign Page",
              );
            }
            setActiveStep((prevActiveStep) => {
              setCurrentIndex(prevActiveStep);
              return prevActiveStep + 1;
            });
          } else if (result.data.is3dSecureAuthenticationRequired) {
            if (window.recurly) {
              setIs3dLoading(true);
              setNewLoader(true);
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
              const loadingToast = toast.loading("Processing your payment...");

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
                toast.dismiss(loadingToast);
                setIs3dLoading(false);
                setIs3d(false);
                setNewLoader(false);
                threeDSecure.remove(document.querySelector("#my-container"));
                toast.error(err.message);
                // display an error message to your user requesting they retry
                // or use a different payment method
              });

              threeDSecure.on("token", (token) => {
                threeDSecure.remove(document.querySelector("#my-container"));
                payload.tokenId =
                  paymentType === "google_pay" || paymentType === "apple_pay"
                    ? userDetailsFromGooglePayment?.token
                    : cardToken;

                payload.paymentMethodId = token.id;
                payload.previousTransactionId = result.data.transactionId;
                setNewLoader(true);
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
                ).then((res) => {
                  setIs3d(false);
                  const result = res?.data;
                  if (result.success) {
                    toast.dismiss(loadingToast);
                    toast.success(result.message, { duration: 10000 });
                    dispatch(isRecurringHandler(false));
                    payload.symbol =
                      donation?.currencySymbol?.symbol ||
                      donation?.donationValues?.symbol;
                    payload.transactionId = result?.data?.transactionId;
                    dispatch(updatePaymentPayload(payload));
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
                    const tokenPayload = {
                      paymentId: result?.data?.transactionId,
                      feedbackToken: result?.data?.feedbackToken,
                    };
                    const yourDonationPayload = {
                      recurringType: result?.data?.recurringType,
                      totalAmount: result?.data?.unitAmount,
                      totalPayments: result?.data?.totalBillingCycles,
                      startDate: result?.data?.startDate,
                      endDate: result?.data?.endDate,
                      nextInvoice: result?.data?.currentPeriodEndsAt,
                      units:
                        donation?.currencySymbol?.units ||
                        donation?.donationValues?.units ||
                        currency.currency.code,
                      symbol:
                        donation?.currencySymbol?.symbol ||
                        donation?.donationValues?.symbol,
                    };
                    dispatch(yourDonationDataHandler(yourDonationPayload));
                    dispatch(feedbackTokensHandler(tokenPayload));
                    setNewLoader(false);
                    if (parsedConsent?.analytics || !consentCookie) {
                      const userId = getCookie("distinctId");
                      const utmParams = getUTMParams(window.location.href);
                      const posthogPayload = {
                        distinctId: userId,
                        event: "Donation Made Successfully",
                        properties: {
                          $current_url: window?.location?.href,
                          ...utmParams,
                        },
                      };
                      enhancedHandlePosthog(
                        handlePosthog,
                        posthogPayload,
                        campaignDetails?.title || "Campaign Page",
                      );
                    }
                    setActiveStep((prevActiveStep) => {
                      setCurrentIndex(prevActiveStep);
                      return prevActiveStep + 1;
                    });
                  } else {
                    threeDSecure.remove(
                      document.querySelector("#my-container"),
                    );
                    toast.error(result.message);
                  }
                });
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
    totalUSDAmount,
    transactionId,
  ) => {
    // setIsPaymentProcessing(true); // Set when payment starts
    console.log("TOTAL USD", totalUSDAmount);
    // const orderBumpConfig = campaignDetails?.sellConfigs?.find(
    //   (config) => config.type === "orderBump"
    // );
    // const transactionId = payload?.transactionId || randomToken;

    // if (window && window.gtag) {
    // Prepare the base event data
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
        // orderBump:
        //   orderBumpConfig && isOrderBumpSelected ? orderBumpConfig?.title : "",
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

        fbqWithConsent("track", "Donate", fbqData, {
          eventID: donateEventId,
          fbp: fbpData,
          external_id: externalId,
        });
        fbqWithConsent("track", "Purchase", fbqData, {
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
        // orderBump:
        //   orderBumpConfig && isOrderBumpSelected ? orderBumpConfig?.title : "",
        givingLevel: selectedBoxData?.title,
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
        value: totalUSDAmount,
        currency: "USD",
        campaignName: campaignDetails?.title,
        campaignCreator:
          campaignDetails?.campaignerId?.firstName +
          " " +
          campaignDetails?.campaignerId?.lastName,
        category: campaignDetails?.categoryId?.name,
        // orderBump:
        //   orderBumpConfig && isOrderBumpSelected ? orderBumpConfig?.title : "",
        givingLevel: selectedBoxData?.title,
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
      if (pixelPayloadPurchase.utmSource) {
        savePixelLogs(pixelPayloadPurchase, campaignId);
        savePixelLogs(pixelPayloadDonate, campaignId);
      }
    } else {
      console.error("Facebook Pixel not loaded.");
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
      fbqWithConsent("track", "AddPaymentInfo", fbqData, {
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
        fbc: fbc,
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
        campaignVersion: campaignVersion,
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
        fbc: fbc,
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

  const storedCardHandler = useCallback(
    (item, index) => {
      setIsStoredCardSelected((previousSelected) => {
        const isSelected = previousSelected !== index;
        dispatch(isSavedCardContinueHandler(isSelected));
        if (isSelected) {
          setSaveCardToken(item._id);
          const cardHolder = {
            firstName: item?.firstName,
            lastName: item?.lastName,
            cardToken: item._id,
          };
          dispatch(saveCardHolderNameHandler(cardHolder));
        } else {
          setSaveCardToken(null); // or any default state
        }
        return isSelected ? index : null;
      });
    },
    [(dispatch, setSaveCardToken)],
  );

  return (
    <DonationTemplate
      setActiveStep={setActiveStep}
      activeStep={activeStep}
      setCurrentIndex={setCurrentIndex}
      heading="Credit/Debit card"
      newDonation
      isSubmitButton={false}
    >
      <ThreeDSecureAuthentication isLoading={is3dLoading}>
        <div
          style={{
            height: is3d && is3dDisplayMode === "inline" ? "400px" : 0,
          }}
          id="my-container"
        />
      </ThreeDSecureAuthentication>
      <BoxComponent>
        <TypographyComp>
          Please provide your card details to continue with your donation.
        </TypographyComp>
      </BoxComponent>
      {getCardDetails?.map((item, index) => (
        <GridComp
          item
          xs={12}
          sm={12}
          lg={12}
          key={index}
          sx={{ marginTop: "10px" }}
        >
          <SelectAbleIconField
            isStoredCard={true}
            height={"41px"}
            isActive={isStoredCardSelected === index}
            onClick={() => storedCardHandler(item, index)}
            heading={`Use card ending with ***${item.lastFour}`}
            icon={getCardIcon(item.brand)}
          />
        </GridComp>
      ))}
      <BoxComponent>
        <MemoizedDonationCardInfoForm
          formik={formik}
          cardType={2}
          isStoredCardSelected={donation?.isSaveCardContinue}
          isSaveCard={isSaveCard}
          isLogin={isLogin}
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
          disabled={
            donation?.isSaveCardContinue
              ? isLoader || is3dLoading || newLoader
              : !formik.values.cardNumber ||
                !formik.values.cvv ||
                !formik.values.expiryDate ||
                isLoader ||
                is3dLoading ||
                newLoader
          }
        >
          {isLoader || is3dLoading || newLoader ? (
            "Donating..."
          ) : (
            <>
              {`Donate ${
                donation?.currencySymbol?.symbol ||
                donation?.donationValues?.symbol
              }${
                isRecurring
                  ? formatNumberWithCommas(
                      (
                        donation.donationValues.recurringDonation +
                        tipAmount +
                        processingFeeAmount
                      ).toFixed(2),
                    )
                  : formatNumberWithCommas(
                      (
                        donation.donationValues.totalAmount +
                        tipAmount +
                        processingFeeAmount
                      ).toFixed(2),
                    )
              }`}
            </>
          )}
        </ButtonComp>
        <BoxComponent sx={{ textAlign: "center" }}>
          {isRecurring && (selectedBoxData?.recurringType || recurringType) && (
            <>
              <TypographyComp
                sx={{
                  display: "contents",
                  fontWeight: 400,
                  fontSize: "16px",
                }}
              >
                {getRecurringTypeTitle(
                  selectedBoxData?.recurringType || recurringType,
                )}
              </TypographyComp>
            </>
          )}
        </BoxComponent>
      </BoxComponent>
    </DonationTemplate>
  );
};

export default DonationCardInfo;
