"use client";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import DonationTemplate from "@/components/templates/donationTemplate/DonationTemplate";
import { useSelector } from "react-redux";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import Image from "next/image";
import GooglePay from "./googlePay/GooglePay";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
// import Slider from "@mui/material/Slider"; // added import
import { useDispatch } from "react-redux";
import {
  cardTokenHandler,
  creditCardDetailsHandler,
  donationCommentHandler,
  donorUserDetailsHandler,
  isCustomAmountReduxHandler,
  isRecurringHandler,
  isSavedCardContinueHandler,
  provideNameAndEmailHandler,
  provideNumberHandler,
  resetDonationState,
  saveCardHolderNameHandler,
  tipAmountHandler,
  tipSliderValueReduxHandler,
} from "@/store/slices/donationSlice";
import {
  calculateTotalAmount,
  createSearchParams,
  formatNumberWithCommas,
  generateRandomToken,
  getUTMParams,
  isUserFromEuropeOrUK,
  scrollToTop,
} from "@/utils/helpers";
import { ASSET_PATHS } from "@/utils/assets";
const blackCard = ASSET_PATHS.svg.blackCard;
const addTipGif = ASSET_PATHS.donations.donateGif;
import {
  cardHolderValuesHandler,
  feedbackTokensHandler,
  isSaveCardContinueSellHandler,
  successDonationHandler,
  thankYouPageDataHandler,
  yourDonationDataHandler,
} from "@/store/slices/successDonationSlice";
import {
  postCardPayment,
  useGetCountriesList,
  useGetCreditCardList,
} from "@/api";
import dayjs from "dayjs";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import { updatePaymentPayload } from "@/store/slices/sellConfigSlice";
import ThreeDSecureAuthentication from "@/components/advance/ThreeDSecureAuthentication";
import ApplePay from "./applePay/ApplePay";
import {
  // googleTagLogs,
  // googleTagServer,
  handlePosthog,
  postCardDetails,
  savePixelLogs,
} from "@/api/post-api-services";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  AUTOMATIC_DONATION_DAYS,
  CONSENT_COOKIE_NAME,
  getCardIcon,
} from "@/config/constant";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
import AuthModelForm from "@/components/advance/AuthModelForm/AuthModelForm";
import GridComp from "@/components/atoms/GridComp/GridComp";
import {
  AddressOneField,
  AddressTwoField,
  CityField,
  DonateAnon,
  // EmailField,
  FullNameField,
  StateField,
} from "../personalInfoDonation/FormFields";
import PhoneInputField from "@/components/atoms/inputFields/PhoneInputField";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";
import { useFormik } from "formik";
import { SignUpSchema } from "../personalInfoDonation/FormFields/validation";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { InputAdornment, Slider } from "@mui/material";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import {
  CardNumberField,
  CVVField,
  ExpiryDateField,
} from "../donationCardInfo/FormFields";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import axios from "axios";
import SelectAbleIconField from "@/components/atoms/selectAbleField/SelectAbleIconField";
import {
  getInitiateCheckoutFbTags,
  getPaymentInfoFbTags,
} from "@/api/get-api-services";

const NewPaymentMethod = ({ activeStep, setActiveStep, setCurrentIndex }) => {
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const router = useRouter();
  const { isSmallScreen } = useResponsiveScreen();
  const dispatch = useDispatch();

  // Prefetch donation-success page for faster navigation
  useEffect(() => {
    router.prefetch("/donation-success");
  }, [router]);
  const isCardSave = useSelector((state) => state.donation.isSaveCardContinue);
  const userId = localStorage.getItem("gb_visitor_id");
  const donation = useSelector((state) => state.donation);
  const isRecurring = useSelector((state) => state?.donation?.isRecurring);
  const comingFromRecurringPayment = useSelector(
    (state) => state.donation.isRecurring,
  );
  const searchParams = useSearchParams();
  const randomToken = useSelector((state) => state.donation.randomToken);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [googleLoader, setGoogleLoader] = useState(false);
  const comment = useSelector((state) => state.donation.donationComment);
  const donationValues = useSelector((state) => state.donation.donationValues);
  const tipValue = useSelector((state) => state.donation.tipAmount);
  const recurringType = useSelector((state) => state.donation.recurringType);
  const selectedBoxData = useSelector(
    (state) => state.donation.selectedBoxData,
  );
  const currency = useSelector((state) => state.donation.currencySymbol);
  const announcementToken = useSelector(
    (state) => state.donation.announcementToken,
  );
  const campaignDetails = useSelector(
    (state) => state.donation?.campaignDetails,
  );
  const isEuropeanUser = isUserFromEuropeOrUK();
  const defaultEmailUpdates = !isEuropeanUser;
  const defaultSMSUpdates = !isEuropeanUser;
  const [provideNameAndEmail, setProvideNameAndEmail] =
    useState(defaultEmailUpdates);
  const saveCardHolderName = useSelector(
    (state) => state?.donation?.saveCardHolderName,
  );

  const provideNumber = useSelector((state) => state?.donation?.provideNumber);

  // App Router hooks
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);
  const hasUrlChanged = useRef(false);
  const authFormRef = useRef(null);
  const [saveCardToken, setSaveCardToken] = useState(null);
  const recurlyKey = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;
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
  const isSaveCardForFuture = useSelector(
    (state) => state.donation?.isSaveCardForFuture,
  );
  const content_ids = [campaignId];
  const content_type = "product";
  // const campaignPixelId = useSelector(
  //   (state) => state?.campaign?.campaignerId?.pixelId
  // );
  const user_roles = "guest";
  const url = window?.location?.href;
  const purchaseEventId = generateRandomToken("a", 5) + dayjs().unix();
  const donateEventId = generateRandomToken("a", 5) + dayjs().unix();
  const fbpData = getCookie("_fbp");
  const externalId = getCookie("externalId");
  const [is3dLoading, setIs3dLoading] = useState(false);
  const [is3d, setIs3d] = useState(false);
  const [is3dDisplayMode, setIs3dDisplayMode] = useState("inline"); // 'inline' or 'modal'
  const [isLoader, setIsLoader] = useState(false);

  const experimentalFeature = getCookie("abtesting");
  const campaignVersion = getCookie("campaign_testing");
  const experimentKey = localStorage.getItem("experimentKey");
  const variationKey = localStorage.getItem("variationKey");
  const isLogin = !!getCookie("token");
  const { data: creditCardList } = useGetCreditCardList({
    enabled: isLogin,
  });
  const getCardDetails = creditCardList?.data.data.cards;
  const isSaveCard = getCardDetails?.length > 0 ? true : false;
  const { data: countriesListResponse } = useGetCountriesList();
  const countriesData = countriesListResponse?.data?.data.countries;

  const countryList = countriesData?.map((item) =>
    item?.isoAlpha2.toLowerCase(),
  );

  const newDonation = true;
  const isHelpUmmahChecked = useState(
    useSelector((state) => state.donation?.isHelpUmmahCheckedRedux),
  );
  const [sliderValue, setSliderValue] = useState(
    useSelector((state) => state.donation?.tipSliderValueRedux),
  );
  const [isCustomAmount, setIsCustomAmount] = useState(
    useSelector((state) => state.donation?.isCustomAmountRedux),
  );
  const tipAmount = useSelector((state) => state.donation?.tipAmount);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const cardFirstName = useSelector(
    (state) => state.donation?.cardHolderName?.firstName,
  );
  const paymentType = "credit_card";
  const cardLastName = useSelector(
    (state) => state.donation?.cardHolderName?.lastName,
  );
  const cardEmail = useSelector(
    (state) => state.donation?.cardHolderName?.email,
  );

  const userFullName = useSelector(
    (state) => state?.donation?.donorUserDetails?.fullName || "",
  );

  const userPhone = useSelector(
    (state) => state?.donation?.donorUserDetails?.phone || "",
  );

  const userAddressOne = useSelector(
    (state) => state?.donation?.donorUserDetails?.addressOne || "",
  );

  const userAddressTwo = useSelector(
    (state) => state?.donation?.donorUserDetails?.addressTwo || "",
  );

  const userCity = useSelector(
    (state) => state?.donation?.donorUserDetails?.city || "",
  );

  const userState = useSelector(
    (state) => state?.donation?.donorUserDetails?.state || "",
  );
  const cardPhone = useSelector(
    (state) => state.donation?.cardHolderName?.phoneNumber,
  );
  const cardNumberRedux = useSelector(
    (state) => state.donation?.creditCardDetails?.number,
  );
  const expiryDateRexux = useSelector(
    (state) => state.donation?.creditCardDetails?.expiryDate,
  );
  const cvv = useSelector((state) => state.donation?.creditCardDetails?.cvv);
  const nameOnCard = useSelector(
    (state) => state.donation?.creditCardDetails?.nameOnCard,
  );
  const [donationComment, setDonationComment] = useState(
    useSelector((state) => state.donation.donationComment),
  );
  const isSaveCardContinue = useSelector(
    (state) => state.donation?.isSaveCardContinue,
  );
  const [isStoredCardSelected, setIsStoredCardSelected] = useState(
    isSaveCardContinue ? 0 : null,
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: isLogin
        ? `${userDetails?.firstName || ""} ${userDetails?.lastName || ""}`.trim()
        : `${cardFirstName || userFullName || ""} ${cardLastName || ""}`.trim(),
      email: isLogin ? userDetails?.email || "" : cardEmail || "",
      phone: isLogin ? userDetails?.phoneNumber : cardPhone || userPhone,
      donateAnon: donation?.publicVisibility
        ? donation?.publicVisibility
        : false,
      cardNumber: cardNumberRedux || "",
      expiryDate: expiryDateRexux || "",
      cvv: cvv || "",
      nameOnCard: nameOnCard || "",
      addressOne: userAddressOne || "",
      addressTwo: userAddressTwo || "",
      city: userCity || "",
      state: userState || "",
    },
    validationSchema: SignUpSchema,
  });

  // Initialize displayTipAmount with formatted value (2 decimal places) if coming from slider
  const [displayTipAmount, setDisplayTipAmount] = useState(() => {
    // Handle null, undefined, and NaN values
    if (tipAmount === null || tipAmount === undefined || isNaN(tipAmount)) {
      return "";
    }
    return isCustomAmount ? tipAmount : Number(tipAmount).toFixed(2);
  });
  const lastZeroTipEventTime = useRef(0);
  const lastCustomZeroTipEventTime = useRef(0);
  const DEBOUNCE_TIME = 1000; // 1 second debounce
  useEffect(() => {
    const baseAmount = isRecurring
      ? donation?.donationValues?.recurringDonation
      : donation?.donationValues?.totalAmount;
    if (!isCustomAmount) {
      const calculatedAmount = (baseAmount * sliderValue) / 100;
      dispatch(tipAmountHandler(calculatedAmount));
      // Format to 2 decimal places for display
      setDisplayTipAmount(calculatedAmount.toFixed(2));
    }
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

      // window.fbq("track", "AddToCart", fbqData);
      window.fbq("track", "InitiateCheckout", fbqData, {
        eventID: eventId,
        fbp: fbpData,
        external_id: externalId,
      });
      // window.fbq("track", "AddPaymentInfo", fbqData);

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
        eventName: "InitiateCheckout",
      };

      savePixelLogs(pixelPayload, campaignDetails?._id);
      getInitiateCheckoutFbTags(payload).catch((err) =>
        console.error(err, "Initiate checkout script did not work"),
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      setIsLoader(false);
    };
  }, []);

  useEffect(() => {}, [
    isHelpUmmahChecked,
    tipAmount,
    donation?.donationValues?.totalAmount,
    donation?.donationValues?.recurringDonation,
    isRecurring,
  ]);
  const handleSliderChange = (e, newValue) => {
    if (newValue === 0) {
      const currentTime = Date.now();
      if (currentTime - lastZeroTipEventTime.current > DEBOUNCE_TIME) {
        lastZeroTipEventTime.current = currentTime;
      }
    }

    setSliderValue(newValue);
    dispatch(tipSliderValueReduxHandler(newValue));
    const baseAmount = isRecurring
      ? donation?.donationValues?.recurringDonation || 0
      : donation?.donationValues?.totalAmount || 0;
    const calculatedAmount = (baseAmount * newValue) / 100;
    dispatch(tipAmountHandler(calculatedAmount));
    // Format to 2 decimal places when setting display amount from slider
    setDisplayTipAmount(calculatedAmount.toFixed(2));
  };

  // new function to format slider tooltip showing the computed donation amount
  const formatSliderValue = (value) => {
    const baseAmount = donation?.donationValues?.totalAmount || 0;
    return `${
      donation?.currencySymbol?.symbol || donation?.donationValues?.symbol
    }${((baseAmount * value) / 100).toFixed(2)} (${value}%)`;
  };
  const handleCustomAmountClick = () => {
    setIsCustomAmount(!isCustomAmount);
    dispatch(isCustomAmountReduxHandler(!isCustomAmount));
    const baseAmount = isRecurring
      ? donation?.donationValues?.recurringDonation || 0
      : donation?.donationValues?.totalAmount || 0;
    const calculatedAmount = (baseAmount * sliderValue) / 100;
    dispatch(tipAmountHandler(calculatedAmount));

    // Format to 2 decimal places when setting display amount from slider
    if (isCustomAmount) {
      // Going back to slider - show formatted value
      setDisplayTipAmount(calculatedAmount.toFixed(2));
    } else {
      // Going to custom input - show formatted value initially
      setDisplayTipAmount(calculatedAmount.toFixed(2));
    }

    if (!isCustomAmount) {
      setSliderValue(sliderValue);
    }
  };

  const customTipHandler = (e) => {
    const value = parseFloat(e.target.value);
    const currentTime = Date.now();

    // Handle zero value input or empty value (both considered zero)
    if (
      (e.target.value === "0" || e.target.value === "") &&
      currentTime - lastCustomZeroTipEventTime.current > DEBOUNCE_TIME
    ) {
      lastCustomZeroTipEventTime.current = currentTime;
    }

    // Handle empty value
    if (e.target.value === "") {
      dispatch(tipAmountHandler(0));
      setDisplayTipAmount("");
    } else if (!isNaN(value) && value >= 0) {
      // For manual input, store the exact value in Redux
      dispatch(tipAmountHandler(value));
      // For display, use the input value as is without formatting
      // This allows users to type any number of decimal places
      setDisplayTipAmount(e.target.value);
    }
  };

  // const nextButtonHandler = () => {
  //   setActiveStep((prevActiveStep) => {
  //     const userId = getCookie("distinctId");
  //     const utmParams = getUTMParams(window.location.href);
  //     if (tipAmount) {
  //       const posthogPayloadTip = {
  //         distinctId: userId,
  //         event: isCustomAmount ? "Custom Tip Added" : "Presets Tip Added",
  //         properties: {
  //           $current_url: window?.location?.href,
  //           // ...posthog?.persistence?.props,
  //           ...utmParams,
  //         },
  //       };
  //       if (parsedConsent && parsedConsent?.analytics) {
  //         enhancedHandlePosthog(
  //           handlePosthog,
  //           posthogPayloadTip,
  //           campaignDetails?.title || "Campaign Page"
  //         );
  //       }
  //     } else {
  //       const zeroPayloadTip = {
  //         distinctId: userId,
  //         event: "Zero Tip Added",
  //         properties: {
  //           $current_url: window?.location?.href,
  //           // ...posthog?.persistence?.props,
  //           ...utmParams,
  //         },
  //       };
  //       if (parsedConsent && parsedConsent?.analytics) {
  //         enhancedHandlePosthog(
  //           handlePosthog,
  //           zeroPayloadTip,
  //           campaignDetails?.title || "Campaign Page"
  //         );
  //       }
  //     }
  //     const posthogPayload = {
  //       distinctId: userId,
  //       event: "Selected Credit/Debit Card Payment Method",
  //       properties: {
  //         $current_url: window?.location?.href,
  //         // ...posthog?.persistence?.props,
  //         ...utmParams,
  //       },
  //     };
  //     if (parsedConsent && parsedConsent?.analytics) {
  //       enhancedHandlePosthog(
  //         handlePosthog,
  //         posthogPayload,
  //         campaignDetails?.title || "Campaign Page"
  //       );
  //     }
  //     setCurrentIndex(prevActiveStep);
  //     return prevActiveStep + 1;
  //   });
  // };

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
      dispatch(
        donorUserDetailsHandler({
          fullName: formik?.values?.fullName,
          email: formik?.values?.email,
          phone: formik?.values?.phone,
          addressOne: formik?.values?.addressOne,
          addressTwo: formik?.values?.addressTwo,
          city: formik?.values?.city,
          state: formik?.values?.state,
        }),
      );
      const parts = formik?.values?.expiryDate?.split("/");
      const month = parts[0];
      const year = parts[1];
      const publicApi = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;

      // Split full name into first and last name
      const fullName = formik?.values?.fullName || "";
      const nameParts = fullName.trim().split(/\s+/);
      const cardFirstName =
        nameParts.length > 1
          ? nameParts.slice(0, nameParts.length - 1).join(" ")
          : nameParts[0] || "";
      const cardLastName =
        nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

      const data = new URLSearchParams({
        first_name: cardFirstName,
        last_name: cardLastName,
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
          postCreditCardNew(token);
        } else if (isLogin && !isSaveCard && isSaveCardForFuture) {
          postCreditCardNew(token);
        } else if (isLogin && !isSaveCard && !isSaveCardForFuture) {
          postPaymentNewApi(null, token);
          // setIsLoader(false);
        } else {
          postPaymentNewApi(null, token);
          // setIsLoader(false);
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
      postPaymentNewApi(null, donation?.saveCardHolderName?.cardToken);
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

  const handlePhoneChange = (value) => {
    formik.setFieldValue("phone", value);
  };

  const getDonationAmount = () => {
    if (recurringType === "oneTime") {
      return donationValues?.totalAmount || 0;
    }
    if (
      selectedBoxData &&
      comingFromRecurringPayment &&
      selectedBoxData.donationType !== "recurringDonation"
    ) {
      return 0;
    }
    if (selectedBoxData) {
      return donationValues?.totalAmount || 0;
    }
    if (comingFromRecurringPayment) {
      return 0;
    }
    return donationValues?.totalAmount || 0;
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

  const getRecurringType = () => {
    if (recurringType === "oneTime" || recurringType === "") {
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

  const postPaymentApi = (userDetailsFromGooglePayment, paymentType) => {
    const cfCountry =
      typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;

    // Helper function to split full name
    const splitFullName = (fullName) => {
      if (!fullName) return { firstName: "", lastName: "" };
      const nameParts = fullName.trim().split(/\s+/);
      if (nameParts.length === 1) {
        return { firstName: nameParts[0], lastName: "" };
      }
      const lastName = nameParts[nameParts.length - 1];
      const firstName = nameParts.slice(0, nameParts.length - 1).join(" ");
      return { firstName, lastName };
    };

    let firstName;
    let lastName;

    if (paymentType === "google_pay") {
      const fullNameInArray = userDetailsFromGooglePayment.name?.split(" ");
      lastName = fullNameInArray[fullNameInArray.length - 1];
      firstName = fullNameInArray
        ?.slice(0, fullNameInArray.length - 1)
        ?.join(" ");
    } else {
      // For regular credit card payment, split the full name from formik
      const nameParts = splitFullName(formik.values.fullName);
      firstName = nameParts.firstName;
      lastName = nameParts.lastName;
    }
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
          : currency?.currency?.code,
      currencyConversionId:
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? donationValues?.currencyConversionId
          : currency?.currencyConversionId,
      givingLevelId: comingFromRecurringPayment
        ? selectedBoxData?.donationType === "recurringDonation"
          ? selectedBoxData?._id
          : null
        : selectedBoxData
          ? selectedBoxData?._id
          : null,
      hidePublicVisibility: donation?.publicVisibility,
      sharePersonalInfo: provideNameAndEmail,
      isAllowedToSharePhoneNumber: provideNumber,
      isRecurring:
        recurringType === "oneTime" ? false : comingFromRecurringPayment,
      announcementToken: announcementToken,
      isSavedCard: false,
      paymentMethodId: userDetailsFromGooglePayment?.token,
      paymentMethodType: "credit_card",
      firstName:
        paymentType === "google_pay"
          ? firstName
          : paymentType === "apple_pay"
            ? userDetailsFromGooglePayment?.name?.firstName
            : firstName,
      lastName:
        paymentType === "google_pay"
          ? lastName
          : paymentType === "apple_pay"
            ? userDetailsFromGooglePayment?.name?.lastName
            : lastName,
      email:
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? userDetailsFromGooglePayment?.email
          : formik.values.email,
      phoneNumber: formik.values.phone,
      postalCode:
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? userDetailsFromGooglePayment?.postalCode
          : "",
      country:
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? userDetailsFromGooglePayment.countryCode
          : "",
      comment: comment,
      isConsentForFbEvents: parsedConsent?.marketing || false,
      addressOne: formik.values.addressOne || "",
      addressTwo: formik.values.addressTwo || "",
      city: formik.values.city || "",
      state: formik.values.state || "",
    };
    if (!isLogin) {
      payload.firstName =
        paymentType === "google_pay"
          ? firstName
          : paymentType === "apple_pay"
            ? userDetailsFromGooglePayment.name.firstName
            : firstName;
      payload.lastName =
        paymentType === "google_pay"
          ? lastName
          : paymentType === "apple_pay"
            ? userDetailsFromGooglePayment.name.lastName
            : lastName;
      payload.email =
        paymentType === "google_pay" || paymentType === "apple_pay"
          ? userDetailsFromGooglePayment.email
          : formik.values.email;
      payload.phoneNumber = formik.values.phone;
    }
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
        postCreditCard(
          userDetailsFromGooglePayment.token,
          successPayload,
          payload,
        );
      } else if (isLogin && !isSaveCard) {
        delete payload.postalCode;
        postCreditCard(
          userDetailsFromGooglePayment.token,
          successPayload,
          payload,
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
          fbc, // Changed from utmParameters.fbclid to fbc
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
              const existingParams = Object.fromEntries(searchParams.entries());
              const route = createSearchParams(
                {
                  type: paymentType,
                  email: donation?.cardHolderName?.email,
                  ...existingParams, // Spread all existing parameters
                },
                "/donation-success",
                randomToken, // Pass campaign ID as path parameter
              );
              startTransition(() => {
                router.push(route);
              });
              // setActiveStep((prevActiveStep) => {
              //   setCurrentIndex(prevActiveStep + 1);
              //   return prevActiveStep + 2;
              // });
              // setGoogleLoader(false);
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
                  threeDSecure.remove(document.querySelector("#my-container"));
                  toast.error(err.message);
                  // display an error message to your user requesting they retry
                  // or use a different payment method
                });

                threeDSecure.on("token", (token) => {
                  payload.tokenId =
                    paymentType === "google_pay" || paymentType === "apple_pay"
                      ? userDetailsFromGooglePayment?.token
                      : donation?.cardToken;
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
                        donateEventId?.currencySymbol?.symbol ||
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
                      const existingParams = Object.fromEntries(
                        searchParams.entries(),
                      );
                      const route = createSearchParams(
                        {
                          type: paymentType,
                          email: donation?.cardHolderName?.email,
                          ...existingParams, // Spread all existing parameters
                        },
                        "/donation-success",
                        randomToken, // Pass campaign ID as path parameter
                      );
                      startTransition(() => {
                        router.push(route);
                      });
                      // setActiveStep((prevActiveStep) => {
                      //   setCurrentIndex(prevActiveStep + 1);
                      //   return prevActiveStep + 2;
                      // });
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
        fbc, // Changed from utmParameters.fbclid to fbc
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
            const existingParams = Object.fromEntries(searchParams.entries());

            const route = createSearchParams(
              {
                type: paymentType,
                email: donation?.cardHolderName?.email,
                ...existingParams, // Spread all existing parameters
              },
              "/donation-success",
              randomToken, // Pass campaign ID as path parameter
            );
            startTransition(() => {
              router.push(route);
            });
            // setActiveStep((prevActiveStep) => {
            //   setCurrentIndex(prevActiveStep + 1);
            //   return prevActiveStep + 2;
            // });
            // setGoogleLoader(false);
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
                threeDSecure.remove(document.querySelector("#my-container"));
                toast.error(err.message);
                // display an error message to your user requesting they retry
                // or use a different payment method
              });

              threeDSecure.on("token", (token) => {
                payload.tokenId =
                  paymentType === "google_pay" || paymentType === "apple_pay"
                    ? userDetailsFromGooglePayment?.token
                    : donation?.cardToken;
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
                    const existingParams = Object.fromEntries(
                      searchParams.entries(),
                    );

                    const route = createSearchParams(
                      {
                        type: paymentType,
                        email: donation?.cardHolderName?.email,
                        ...existingParams, // Spread all existing parameters
                      },
                      "/donation-success",
                      randomToken, // Pass campaign ID as path parameter
                    );
                    startTransition(() => {
                      router.push(route);
                    });
                    // setActiveStep((prevActiveStep) => {
                    //   setCurrentIndex(prevActiveStep + 1);
                    //   return prevActiveStep + 2;
                    // });
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
          setGoogleLoader(false);
        });
    }
  };

  const postPaymentNewApi = (
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
    const fullName = formik?.values?.fullName || "";
    const nameParts = fullName.trim().split(/\s+/);
    const cardFirstName =
      nameParts.length > 1
        ? nameParts.slice(0, nameParts.length - 1).join(" ")
        : nameParts[0] || "";
    const cardLastName =
      nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

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
      firstName: isCardSave ? saveCardHolderName?.firstName : cardFirstName,
      lastName: isCardSave ? saveCardHolderName?.lastName : cardLastName,
      email: formik?.values?.email,
      phoneNumber: formik?.values?.phone,
      comment: comment,
      isConsentForFbEvents: parsedConsent?.marketing || false,
      addressOne: formik?.values?.addressOne || "",
      addressTwo: formik?.values?.addressTwo || "",
      city: formik?.values?.city || "",
      state: formik?.values?.state || "",
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
        // setNewLoader(true);
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
              // setNewLoader(false);
              if (parsedConsent && parsedConsent?.analytics) {
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
              const existingParams = Object.fromEntries(searchParams.entries());

              const route = createSearchParams(
                {
                  type: paymentType,
                  email: donation?.cardHolderName?.email,
                  ...existingParams, // Spread all existing parameters
                },
                "/donation-success",
                randomToken, // Pass campaign ID as path parameter
              );
              startTransition(() => {
                router.push(route);
              });
              // setActiveStep((prevActiveStep) => {
              //   setCurrentIndex(prevActiveStep);
              //   return prevActiveStep + 1;
              // });
            } else if (result.data.is3dSecureAuthenticationRequired) {
              if (window.recurly) {
                setIs3dLoading(true);
                // setNewLoader(true);
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
                  // setNewLoader(false);
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
                  // setNewLoader(true);
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
                      // setNewLoader(false);
                      if (parsedConsent && parsedConsent?.analytics) {
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
                      const existingParams = Object.fromEntries(
                        searchParams.entries(),
                      );

                      const route = createSearchParams(
                        {
                          type: paymentType,
                          email: donation?.cardHolderName?.email,
                          ...existingParams, // Spread all existing parameters
                        },
                        "/donation-success",
                        randomToken, // Pass campaign ID as path parameter
                      );
                      startTransition(() => {
                        router.push(route);
                      });
                      // setActiveStep((prevActiveStep) => {
                      //   setCurrentIndex(prevActiveStep);
                      //   return prevActiveStep + 1;
                      // });
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
              setIsLoader(false);
              toast.error(result.message);
            }
          })
          .catch((error) => {
            setIsLoader(false);
            console.error(error);
            toast.error("Something went wrong");
          })
          .finally(() => {
            // setIsLoader(false);
          });
      }
    } else {
      dispatch(successDonationHandler(successPayload));
      // setNewLoader(true);
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
            // setNewLoader(false);
            if (parsedConsent && parsedConsent?.analytics) {
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
            const existingParams = Object.fromEntries(searchParams.entries());
            const route = createSearchParams(
              {
                type: paymentType,
                email: donation?.cardHolderName?.email,
                ...existingParams, // Spread all existing parameters
              },
              "/donation-success",
              randomToken, // Pass campaign ID as path parameter
            );
            startTransition(() => {
              router.push(route);
            });
            // setActiveStep((prevActiveStep) => {
            //   setCurrentIndex(prevActiveStep);
            //   return prevActiveStep + 1;
            // });
          } else if (result.data.is3dSecureAuthenticationRequired) {
            if (window.recurly) {
              setIs3dLoading(true);
              // setNewLoader(true);
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
                // setNewLoader(false);
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
                // setNewLoader(true);
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
                    // setNewLoader(false);
                    if (parsedConsent && parsedConsent?.analytics) {
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
                    const existingParams = Object.fromEntries(
                      searchParams.entries(),
                    );
                    const route = createSearchParams(
                      {
                        type: paymentType,
                        email: donation?.cardHolderName?.email,
                        ...existingParams, // Spread all existing parameters
                      },
                      "/donation-success",
                      randomToken, // Pass campaign ID as path parameter
                    );
                    startTransition(() => {
                      router.push(route);
                    });
                    // setActiveStep((prevActiveStep) => {
                    //   setCurrentIndex(prevActiveStep);
                    //   return prevActiveStep + 1;
                    // });
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
            setIsLoader(false);
            toast.error(result.message);
          }
        })
        .catch((error) => {
          setIsLoader(false);
          console.error(error);
          toast.error("Something went wrong");
        })
        .finally(() => {
          // setIsLoader(false);
        });
    }
  };

  const postCreditCardNew = (token, postalCode) => {
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
          postPaymentNewApi(null, token);
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
            const loadingToast = toast.loading("Processing your payment...");
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
              toast.dismiss(loadingToast);
              threeDSecure.remove(document.querySelector("#my-container"));
              // payload.previousTransactionId = result.data.transactionId;
              postCardDetails(payload).then((res) => {
                setIs3d(false);
                const result = res?.data;
                if (result.success) {
                  toast.success(result.message);
                  postPaymentNewApi(null, newToken.id, true);
                } else {
                  toast.error(result.message);
                }
              });

              // send `token.id` to your server to retry your API request
            });
          }
        } else {
          setIsLoader(false);
          toast.error(result.message);
        }
      })
      .catch((error) => {
        setIsLoader(false);
        console.error(error);
        toast.error("Something went wrong");
      })
      .finally(() => {
        // setIsLoader(false);
      });
  };

  const postCreditCard = (socialToken, successPayload, paymentPayload) => {
    const payload = {
      cardToken: socialToken,
    };
    postCardDetails(payload)
      .then((res) => {
        const result = res?.data;

        if (result.success) {
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
            fbc, // Changed from utmParameters.fbclid to fbc
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
                paymentPayload.symbol =
                  donation?.currencySymbol?.symbol ||
                  donation?.donationValues?.symbol;
                paymentPayload.transactionId = result?.data?.transactionId;
                dispatch(updatePaymentPayload(paymentPayload));
                dispatch(isRecurringHandler(false));
                handleDonationSuccess(
                  paymentPayload,
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
                const existingParams = Object.fromEntries(
                  searchParams.entries(),
                );
                const route = createSearchParams(
                  {
                    type: paymentType,
                    email: donation?.cardHolderName?.email,
                    ...existingParams, // Spread all existing parameters
                  },
                  "/donation-success",
                  randomToken, // Pass campaign ID as path parameter
                );
                startTransition(() => {
                  router.push(route);
                });
                // setActiveStep((prevActiveStep) => {
                //   setCurrentIndex(prevActiveStep + 1);
                //   return prevActiveStep + 2;
                // });
                // setGoogleLoader(false);
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
                    threeDSecure.remove(
                      document.querySelector("#my-container"),
                    );
                    toast.error(err.message);
                    // display an error message to your user requesting they retry
                    // or use a different payment method
                  });

                  threeDSecure.on("token", (token) => {
                    paymentPayload.tokenId = socialToken;
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
                      toast.dismiss(toastId);
                      setIs3d(false);
                      const result = res?.data;
                      if (result.success) {
                        toast.success(result.message, { duration: 10000 });
                        dispatch(isRecurringHandler(false));
                        paymentPayload.symbol =
                          donation?.currencySymbol?.symbol ||
                          donation?.donationValues?.symbol;
                        paymentPayload.transactionId =
                          result?.data?.transactionId;
                        dispatch(updatePaymentPayload(paymentPayload));
                        handleDonationSuccess(
                          paymentPayload,
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
                        const existingParams = Object.fromEntries(
                          searchParams.entries(),
                        );
                        const route = createSearchParams(
                          {
                            type: paymentType,
                            email: donation?.cardHolderName?.email,
                            ...existingParams, // Spread all existing parameters
                          },
                          "/donation-success",
                          randomToken, // Pass campaign ID as path parameter
                        );
                        startTransition(() => {
                          router.push(route);
                        });
                        // setActiveStep((prevActiveStep) => {
                        //   setCurrentIndex(prevActiveStep + 1);
                        //   return prevActiveStep + 2;
                        // });
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
              threeDSecure.remove(document.querySelector("#my-container"));
              toast.error(err.message);
              // display an error message to your user requesting they retry
              // or use a different payment method
            });

            threeDSecure.on("token", (newToken) => {
              payload.previousCardToken = socialToken;
              payload.cardToken = newToken.id;
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
                        paymentPayload.symbol =
                          donation?.currencySymbol?.symbol ||
                          donation?.donationValues?.symbol;
                        paymentPayload.transactionId =
                          result?.data?.transactionId;
                        dispatch(updatePaymentPayload(paymentPayload));
                        dispatch(isRecurringHandler(false));
                        handleDonationSuccess(
                          paymentPayload,
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
                        const existingParams = Object.fromEntries(
                          searchParams.entries(),
                        );
                        const route = createSearchParams(
                          {
                            type: paymentType,
                            email: donation?.cardHolderName?.email,
                            ...existingParams, // Spread all existing parameters
                          },
                          "/donation-success",
                          randomToken, // Pass campaign ID as path parameter
                        );
                        startTransition(() => {
                          router.push(route);
                        });
                        // setActiveStep((prevActiveStep) => {
                        //   setCurrentIndex(prevActiveStep + 1);
                        //   return prevActiveStep + 2;
                        // });
                        // setGoogleLoader(false);
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
                          threeDSecure.attach(
                            document.querySelector("#my-container"),
                          );
                          const toastId = toast.loading(
                            "Processing your payment...",
                          );

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
                            toast.dismiss(toastId);
                            setIs3d(false);
                            setIs3dLoading(false);
                            threeDSecure.remove(
                              document.querySelector("#my-container"),
                            );
                            toast.error(err.message);
                            // display an error message to your user requesting they retry
                            // or use a different payment method
                          });

                          threeDSecure.on("token", (token) => {
                            paymentPayload.tokenId = socialToken;
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
                                toast.dismiss(toastId);
                                toast.success(result.message, {
                                  duration: 10000,
                                });
                                dispatch(isRecurringHandler(false));
                                paymentPayload.symbol =
                                  donation?.currencySymbol?.symbol ||
                                  donation?.donationValues?.symbol;
                                paymentPayload.transactionId =
                                  result?.data?.transactionId;
                                dispatch(updatePaymentPayload(paymentPayload));
                                handleDonationSuccess(
                                  paymentPayload,
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
                                  totalPayments:
                                    result?.data?.totalBillingCycles,
                                  startDate: result?.data?.startDate,
                                  endDate: result?.data?.endDate,
                                  nextInvoice:
                                    result?.data?.currentPeriodEndsAt,
                                  units:
                                    donation?.currencySymbol?.units ||
                                    donation?.donationValues?.units ||
                                    currency.currency.code,
                                  symbol:
                                    donation?.currencySymbol?.symbol ||
                                    donation?.donationValues?.symbol,
                                };
                                dispatch(
                                  yourDonationDataHandler(yourDonationPayload),
                                );
                                dispatch(feedbackTokensHandler(tokenPayload));
                                const userId = getCookie("distinctId");
                                const utmParams = getUTMParams(
                                  window.location.href,
                                );
                                const posthogPayload = {
                                  distinctId: userId,
                                  event: "Donation Made Successfully",
                                  properties: {
                                    $current_url: window?.location?.href,
                                    // ...posthog?.persistence?.props,
                                    ...utmParams,
                                  },
                                };
                                if (
                                  parsedConsent?.analytics ||
                                  !consentCookie
                                ) {
                                  enhancedHandlePosthog(
                                    handlePosthog,
                                    posthogPayload,
                                    campaignDetails?.title || "Campaign Page",
                                  );
                                }
                                const existingParams = Object.fromEntries(
                                  searchParams.entries(),
                                );
                                const route = createSearchParams(
                                  {
                                    type: paymentType,
                                    email: donation?.cardHolderName?.email,
                                    ...existingParams, // Spread all existing parameters
                                  },
                                  "/donation-success",
                                  randomToken, // Pass campaign ID as path parameter
                                );
                                startTransition(() => {
                                  router.push(route);
                                });
                                // setActiveStep((prevActiveStep) => {
                                //   setCurrentIndex(prevActiveStep + 1);
                                //   return prevActiveStep + 2;
                                // });
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
        setGoogleLoader(false);
      });
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
    fbc, // Changed parameter name from fbclid to fbc
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
    const updatedPayload = { ...payload, totalUSDAmount, transactionId };
    dispatch(thankYouPageDataHandler(updatedPayload));

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
    const userId = getCookie("distinctId");
    const utmParamsPosthog = getUTMParams(window.location.href);
    const payloadPostHog = {
      distinctId: userId,
      event: "Personal Info Added in Donation Flow",
      properties: {
        $current_url: window?.location?.href,
        // ...posthog?.persistence?.props,
        utmParams: {
          ...utmParamsPosthog,
        },
      },
    };
    if (parsedConsent?.analytics || !consentCookie) {
      enhancedHandlePosthog(
        handlePosthog,
        payloadPostHog,
        campaignDetails?.title || "Campaign Page",
      );
    }
    if (showAuthForm) {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payloadPostHogCredit = {
        distinctId: userId,
        event: "Selected Credit/Debit Card Payment Method",
        properties: {
          $current_url: window?.location?.href,
          // ...posthog?.persistence?.props,
          ...utmParams,
        },
      };
      if (parsedConsent?.analytics || !consentCookie) {
        enhancedHandlePosthog(
          handlePosthog,
          payloadPostHogCredit,
          campaignDetails?.title || "Campaign Page",
        );
      }
    }
    if (tipAmount) {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const posthogPayloadTip = {
        distinctId: userId,
        event: isCustomAmount ? "Custom Tip Added" : "Presets Tip Added",
        properties: {
          $current_url: window?.location?.href,
          // ...posthog?.persistence?.props,
          ...utmParams,
        },
      };
      if (parsedConsent?.analytics || !consentCookie) {
        enhancedHandlePosthog(
          handlePosthog,
          posthogPayloadTip,
          campaignDetails?.title || "Campaign Page",
        );
      }
    }
  };

  const paymentButtonHandler = (userDetailsFromGooglePayment, type) => {
    if (type === "google_pay") {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const posthogPayloadNew = {
        distinctId: userId,
        event: "Selected Google Pay Payment Method",
        properties: {
          $current_url: window?.location?.href,
          // ...posthog?.persistence?.props,
          ...utmParams,
        },
      };
      if (parsedConsent?.analytics || !consentCookie) {
        enhancedHandlePosthog(
          handlePosthog,
          posthogPayloadNew,
          campaignDetails?.title || "Campaign Page",
        );
      }
    }
    if (type === "apple_pay") {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const posthogPayload = {
        distinctId: userId,
        event: "Selected Apple Pay Payment Method",
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
    }
    setGoogleLoader(true);
    postPaymentApi(userDetailsFromGooglePayment, type);
  };

  // Function to get the recurring type title from constants
  const getRecurringTypeTitle = (recurringType) => {
    const recurringOption = AUTOMATIC_DONATION_DAYS.find(
      (option) => option.value === recurringType,
    );

    if (!recurringOption) return "";

    // Return the full label from constants
    return recurringOption.label;
  };

  const getRecurringText = () => {
    if (isRecurring && (selectedBoxData?.recurringType || recurringType)) {
      return (
        <div style={{ fontSize: "16px", fontWeight: 500 }}>
          {getRecurringTypeTitle(
            selectedBoxData?.recurringType || recurringType,
          )}
        </div>
      );
    }
  };

  const handleCommentChange = (e) => {
    const value = e.target.value; // This ensures text is trimmed at MAX_CHARS
    setDonationComment(value);
    dispatch(donationCommentHandler(value));
  };

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

  // Check if required fields are filled for enabling the donate button
  const isDisable =
    !formik.values.fullName?.trim() ||
    (!isSaveCardContinue &&
      (!formik.values.cardNumber?.trim() ||
        !formik.values.expiryDate?.trim() ||
        !formik.values.cvv?.trim()));

  return (
    <>
      <DonationTemplate
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        setCurrentIndex={setCurrentIndex}
        heading={
          <div style={{ whiteSpace: "pre-line" }}>
            {`You donate
${donation?.currencySymbol?.symbol || donation?.donationValues?.symbol}${
              isRecurring
                ? formatNumberWithCommas(
                    (
                      (donation.donationValues?.recurringDonation || 0) +
                      (tipAmount || 0)
                    ).toFixed(2),
                  )
                : formatNumberWithCommas(
                    (
                      (donation.donationValues?.totalAmount || 0) +
                      (tipAmount || 0)
                    ).toFixed(2),
                  )
            } ${
              donation?.currencySymbol?.units || donation?.donationValues?.units
            }`}
            {getRecurringText()}
          </div>
        }
        isSubmitButton={false}
        newDonation
      >
        <ThreeDSecureAuthentication isLoading={is3dLoading}>
          <div
            style={{
              height: is3d && is3dDisplayMode === "inline" ? "400px" : 0,
            }}
            id="my-container"
          />
        </ThreeDSecureAuthentication>
        <BoxComponent
          sx={{
            width: "100%",
            mx: "auto",
            mt: 2,
            // bgcolor: "#f3f4fa",
            // borderRadius: "16px",
            // p: 2,
            height: isSmallScreen ? "auto" : "auto", // Dynamic height based on checkbox state
            position: "relative",
            overflow: "visible",
            transition: "height 0.3s ease-in-out", // Add this line
          }}
        >
          <BoxComponent sx={{ marginBottom: "15px", marginTop: "15px" }}>
            <div>
              {isHelpUmmahChecked && ( // render slider and computed amount within the same container as checkbox
                <>
                  <BoxComponent
                    sx={{
                      bgcolor: "#fff",
                      padding: "10px",
                      borderRadius: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <TypographyComp>
                      <a
                        href="https://www.madinah.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#6363e6", textDecoration: "none" }}
                      >
                        Madinah
                      </a>{" "}
                      is 100% fee-free, ensuring every dollar you give directly
                      supports those in need.
                    </TypographyComp>
                    {/* </BoxComponent> */}
                    {!isCustomAmount ? (
                      <Slider
                        value={sliderValue}
                        marks
                        step={1}
                        size="small"
                        min={0}
                        max={30}
                        onChange={handleSliderChange}
                        valueLabelDisplay="on"
                        valueLabelFormat={formatSliderValue}
                        sx={{
                          mt: 4,
                          mb: 0,
                          "& .MuiSlider-valueLabel": {
                            backgroundColor: "white !important",
                            color: "black",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            height: "27px",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                            fontSize: "14px",
                            fontWeight: 500,
                            top: -20,
                            right:
                              sliderValue === 30 || sliderValue === 29
                                ? 0
                                : "default",
                            left:
                              sliderValue === 0 || sliderValue === 1
                                ? 0
                                : "default",
                            "&:before": {
                              display: "none",
                            },
                          },
                          "& .MuiSlider-thumb": {
                            width: 0,
                            height: 0,
                            borderRadius: 0,
                            backgroundColor: "transparent",
                            border: "none",
                            position: "relative",
                            "&:before": {
                              content: '""',
                              position: "absolute",
                              left: "50%",
                              top: "-15px",
                              transform: "translateX(-50%)",
                              width: 0,
                              height: 0,
                              borderLeft: "8px solid transparent",
                              borderRight: "8px solid transparent",
                              borderTop: "12px solid #6363e6",
                            },
                            "&:hover, &.Mui-focusVisible": {
                              boxShadow: "none",
                            },
                            "&.Mui-active": {
                              boxShadow: "none",
                            },
                          },
                        }}
                      />
                    ) : null}
                    {isCustomAmount ? (
                      <TextFieldComp
                        onChange={customTipHandler}
                        value={displayTipAmount}
                        placeholder={"Enter custom tip"}
                        type="number"
                        inputProps={{ min: 0 }}
                        onWheel={(e) => e.target.blur()}
                        customHelperText={""}
                        name="customTip"
                        onBlur={""}
                        sx={{ borderRadius: "10px", mt: 1 }}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {donation?.currencySymbol?.symbol ||
                                donation?.donationValues?.symbol}
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : null}
                    <TypographyComp
                      onClick={handleCustomAmountClick}
                      sx={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: isCustomAmount ? "#697484" : "#697484",
                        width: "fit-content",
                      }}
                    >
                      {isCustomAmount ? "Back to presets" : "Custom amount"}
                    </TypographyComp>
                  </BoxComponent>
                </>
              )}
            </div>
          </BoxComponent>
        </BoxComponent>
        {tipAmount === 0 ? (
          <BoxComponent
            sx={{
              width: "100%",
              mx: "auto",
              mt: 2,
              borderRadius: "16px",
              p: 2,
              position: "relative",
              overflow: "visible",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <BoxComponent>
              <Image
                src={addTipGif}
                alt="Add tip"
                width={60}
                height={60}
                style={{
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </BoxComponent>
            <BoxComponent sx={{ flex: 1 }}>
              <TypographyComp>
                Your tip helps cover essential costs like servers, security, and
                platform maintenance ensuring{" "}
                <a
                  href="https://www.madinah.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#6363e6", textDecoration: "none" }}
                >
                  Madinah
                </a>{" "}
                remains fee-free for everyone.
              </TypographyComp>
            </BoxComponent>
          </BoxComponent>
        ) : null}
        <GridComp sx={{ marginTop: "15px" }} item xs={12} sm={12}>
          {donation?.campaignDetails?.isCommentAllowed ? (
            <>
              <TextFieldComp
                id="comment"
                name="comment"
                placeholder={
                  donation?.campaignDetails?.commentboxHeading ||
                  "Enter comment"
                }
                sx={{ borderRadius: "10px" }}
                value={donationComment}
                onChange={(e) => {
                  if (e.target.value.length <= 5000) {
                    handleCommentChange(e);
                  }
                }}
                fullWidth
                multiline
                rows={4}
                required
                helperText={
                  donationComment?.length > 5000
                    ? "Comment is too long, maximum 5000 characters"
                    : `${donationComment?.length || 0}/5000 characters`
                }
                inputProps={{
                  maxLength: 5000,
                }}
                error={donationComment?.length > 5000}
              />
            </>
          ) : null}
        </GridComp>
        <GridComp item xs={12} sm={12}>
          <DonateAnon formik={formik} />
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
              // setProvideNumber(e.target.checked);
              dispatch(provideNumberHandler(e.target.checked));
            }}
          />
        </GridComp>
        <BoxComponent
          sx={{
            marginTop: "20px",
            gap: "10px",
            display: "flex",
            flexDirection: "column",
            marginBottom: "20px",
          }}
        >
          {googleLoader || is3d ? (
            <ButtonComp
              padding="12px "
              size="normal"
              sx={{ width: { xs: "100%", sm: "100%", borderRadius: "5px" } }}
              disabled={is3d || googleLoader}
            >
              Donating...
            </ButtonComp>
          ) : (
            <>
              <ButtonComp
                variant="outlined"
                disableRipple
                disableElevation
                sx={{
                  width: "100%",
                  borderRadius: "10px",
                  padding: "10px 16px 8px 16px",
                  border: showAuthForm
                    ? "2px solid transparent"
                    : "2px solid #E9E9EB",
                  background: showAuthForm
                    ? "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box"
                    : "White",
                  backgroundColor: showAuthForm ? "transparent" : "White",
                  color: showAuthForm ? "#6363E6" : "#000",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: showAuthForm
                      ? "transparent"
                      : "rgba(0, 0, 0, 0.04)",
                    border: showAuthForm
                      ? "2px solid transparent"
                      : "2px solid #E9E9EB",
                    background: showAuthForm
                      ? "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box"
                      : "rgba(0, 0, 0, 0.04)",
                  },
                }}
                onClick={() => {
                  const newState = !showAuthForm;
                  setShowAuthForm(newState);
                  if (newState) {
                    setTimeout(() => {
                      authFormRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 100);
                  } else {
                    scrollToTop("smooth");
                  }
                }}
                // variant="outlined"
                startIcon={
                  <Image
                    src={blackCard}
                    alt="credit card"
                    width={20}
                    height={20}
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                }
              >
                Credit/Debit card
              </ButtonComp>
              <GooglePay
                onClickHandler={(details) =>
                  paymentButtonHandler(details, "google_pay")
                }
                tipValue={donation.tipAmount}
                donationValues={donation.donationValues}
                setGoogleLoader={setGoogleLoader}
              />

              <ApplePay
                tipValue={donation.tipAmount}
                donationValues={donation.donationValues}
                onClickHandler={(details) =>
                  paymentButtonHandler(details, "apple_pay")
                }
                setGoogleLoader={setGoogleLoader}
                newDonation
              />
            </>
          )}
        </BoxComponent>
        {showAuthForm ? (
          <div ref={authFormRef}>
            {getCardDetails?.map((item, index) => (
              <GridComp
                item
                xs={12}
                sm={12}
                lg={12}
                key={index}
                // sx={{ marginTop: "10px" }}
              >
                <SelectAbleIconField
                  isStoredCard={true}
                  height={"41px"}
                  isActive={isStoredCardSelected === index}
                  onClick={() => storedCardHandler(item, index)}
                  heading={`Use card ending with ***${item.lastFour}`}
                  icon={getCardIcon(item.brand)}
                  newPayment
                />
              </GridComp>
            ))}
            <AuthModelForm dense mt="25px" formAction={formik.handleSubmit}>
              <GridComp
                container
                sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                <GridComp item xs={12} sm={12}>
                  <FullNameField formik={formik} fieldsDisabled={false} />
                </GridComp>
                {/* <GridComp item xs={12} sm={12}>
                  <EmailField formik={formik} />
                </GridComp> */}
                <GridComp item xs={12} sm={12} sx={{ paddingBottom: "1px" }}>
                  <PhoneInputField
                    // label="Phone Number"
                    value={formik.values.phone}
                    onInputChange={handlePhoneChange}
                    countriesData={countryList}
                    borderRadius="10px"
                    height="40px"
                  />
                </GridComp>
                <GridComp item xs={12} sm={12}>
                  <CardNumberField
                    formik={formik}
                    isStoredCardSelected={isStoredCardSelected === 0}
                    fieldsDisabled={false}
                    newDonation
                  />
                </GridComp>
                <GridComp container spacing={2}>
                  <GridComp item xs={6}>
                    <ExpiryDateField
                      formik={formik}
                      isStoredCardSelected={isStoredCardSelected === 0}
                      newDonation
                    />
                  </GridComp>
                  <GridComp item xs={6}>
                    <CVVField
                      formik={formik}
                      isStoredCardSelected={isStoredCardSelected === 0}
                      newDonation
                    />
                  </GridComp>
                </GridComp>
                <GridComp item xs={12} sm={12}>
                  <AddressOneField
                    formik={formik}
                    // isStoredCardSelected={isStoredCardSelected}
                    fieldsDisabled={false}
                    newDonation
                  />
                </GridComp>
                <GridComp item xs={12} sm={12}>
                  <AddressTwoField
                    formik={formik}
                    // isStoredCardSelected={isStoredCardSelected}
                    fieldsDisabled={false}
                    newDonation
                  />
                </GridComp>
                <GridComp container spacing={2}>
                  <GridComp item xs={6}>
                    <CityField
                      formik={formik}
                      // isStoredCardSelected={isStoredCardSelected}
                      newDonation
                    />
                  </GridComp>
                  <GridComp item xs={6}>
                    <StateField
                      formik={formik}
                      // isStoredCardSelected={isStoredCardSelected}
                      newDonation
                    />
                  </GridComp>
                </GridComp>
                <SubmitButton
                  sx={{
                    mt: { xs: 2, sm: 0 },
                    width: { sm: newDonation ? "100%" : "auto" },
                    maxWidth: newDonation && isSmallScreen ? "600px" : "none",
                    margin: newDonation && isSmallScreen ? "0 auto" : "0 auto",
                  }}
                  isContinueButtonDisabled={isDisable || isLoader}
                  onClick={nextButtonHandler}
                  borderRadius={newDonation ? "10px" : "48px"}
                  newDonation={newDonation}
                >
                  Donate
                </SubmitButton>
              </GridComp>
            </AuthModelForm>
          </div>
        ) : null}
      </DonationTemplate>
    </>
  );
};

export default NewPaymentMethod;
