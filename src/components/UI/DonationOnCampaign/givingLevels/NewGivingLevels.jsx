"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import toast from "react-hot-toast";
import { ASSET_PATHS } from "@/utils/assets";
const heartIcon = ASSET_PATHS.svg.heartIcon;
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAddToCartFbTags, getSingleCampaignData } from "@/api";

import {
  campaignIdHandler,
  cardHolderNameHandler,
  currencySymbolHandler,
  desktopLevelIndexHandler,
  donateCurrencyHandler,
  donationBackHandler,
  donationHandler,
  isLevelHandler,
  isRecurringHandler,
  isSelectedRecurringPageHandler,
  monthlyDonationHandler,
  oneTimeDonationHandler,
  packageValuesHandler,
  randomTokenHandler,
  recurringTypeHandler,
  resetDonationState,
  selectedBoxDataHandler,
  updateCampaignDetails,
  updateCustomDonation,
  updateDonationType,
  updateDOnationValueBlock,
} from "@/store/slices/donationSlice";

import Head from "next/head";
import RecurringModal from "./RecurringModal";
import { titleHandler } from "@/store/slices/authSlice";
import GridComp from "@/components/atoms/GridComp/GridComp";
import StackComponent from "@/components/atoms/StackComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import GivingLevelSkeleton from "../paymentSkeleton/GivingLevelSkeleton";
import DonationTemplate from "@/components/templates/donationTemplate/DonationTemplate";

import {
  updateAmountCurrency,
  updateCampaignId,
  updateSellConfigs,
} from "@/store/slices/sellConfigSlice";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import {
  formatNumberWithCommas,
  generateRandomToken,
  getUTMParams,
} from "@/utils/helpers";
import { getCookie } from "cookies-next";
import { handlePosthog, savePixelLogs } from "@/api/post-api-services";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import NewSelectAbleLevel from "@/components/atoms/selectAbleField/NewSelectAbleLevel";
import NewCustomInputField from "@/components/atoms/inputFields/NewCustomInputField";
// import posthog from "posthog-js";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
import { EmailField } from "../personalInfoDonation/FormFields";
import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { getSingleCampaignDataGivingLevels } from "@/api/get-api-services";

const NewGivingLevels = ({
  activeStep,
  setActiveStep,
  setCurrentIndex,
  randomToken,
  levelIndex,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef(pathname);
  const { isSmallScreen } = useResponsiveScreen();

  // Build query object from searchParams for compatibility
  const query = useMemo(() => {
    const obj = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  const newDonation = true;

  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const abTestingCookie = getCookie("abtesting");
  const campaignVersion = getCookie("campaign_testing");
  const experimentKey = localStorage.getItem("experimentKey");
  const variationKey = localStorage.getItem("variationKey");
  const campaignId = useSelector((state) => state.donation.campaignId);
  const desktopLevelIndex = useSelector(
    (state) => state.donation.desktopLevelIndex,
  );
  const hasUrlChanged = useRef(false); // Track if the URL has changed
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

  const donation = useSelector((state) => state.donation);
  const { monthlyDonation } = useSelector((state) => state.donation);
  const countriesList = useSelector((state) => state.meta.countries);
  const { selectedBoxData } = useSelector((state) => state.donation);
  const reduxCurrency = useSelector((state) => state.donation?.currency);
  const externalId = getCookie("externalId");
  const donationValue = useSelector(
    (state) => state.donation.donationValues?.totalAmount,
  );
  const isOneTimeDonations = useSelector(
    (state) => state.donation.oneTimeDonation,
  );

  const selectedCurrency = useSelector(
    (state) => state.donation?.currencySymbol,
  );

  const [selectedCountry, setSelectedCountry] = useState(reduxCurrency || null);
  const [donationAmount, setDonationAmount] = useState(
    donationValue ? donationValue : "",
  );
  const recurringType = useSelector((state) => state.donation.recurringType);
  const initialDonationOption = useSelector(
    (state) => state?.donation?.customDonationCheckbox,
  );

  const fbpData = getCookie("_fbp");

  const [isCustomDonationAllow, setIsCustomDonationAllow] = useState({
    isCustomDonation: true,
    minimumCustomDonation: 0,
  });

  const [isCustomFieldHighlighted, setIsCustomFieldHighlighted] =
    useState(false);

  const [isManualCustomFieldSelection, setIsManualCustomFieldSelection] =
    useState(false);

  const [isOneTimeDonationForLabel, setIsOneTimeDonationForLabel] =
    useState(false);

  const userDetails = useSelector((state) => state.auth.userDetails);
  const cardEmail = useSelector(
    (state) => state.donation?.cardHolderName?.email,
  );

  const [donationOption] = useState(initialDonationOption);

  const [levelAmount, setLevelAmount] = useState(donationValue || null);
  const donateBack = useSelector((state) => state?.donation?.donationBack);
  const [givingLevelsValues, setGivingLevelsValues] = useState(null);
  const [currencyConversion, setCurrencyConversion] = useState(null);
  const [recurringDonation, setRecurringDonation] = useState(false);
  const [oneTimeDonation, setOneTimeDonation] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [packageValues, setPackageValues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(false);
  const [isLevel, setIsLevel] = useState(null);
  const [open, setOpen] = useState(false);
  const [donationTypeLevel, setDonationTypeLevel] = useState(null);
  const [dropdownChanged, setDropDownChanged] = useState(false);
  const userHasChangedDonationTypeRef = useRef(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [boxClickUpdated, setBoxClickUpdated] = useState(false);
  const [selectedDonationType, setSelectedDonationType] = useState(() => {
    // First check campaign details for donation type availability
    const campaignDetails = donation?.campaignDetails;

    // If only recurring donations are allowed (one-time is disabled)
    if (
      campaignDetails?.isRecurringDonation &&
      !campaignDetails?.isOneTimeDonation
    ) {
      dispatch(updateDonationType("monthly"));
      return "monthly";
    }

    // If only one-time donations are allowed (recurring is disabled)
    if (
      campaignDetails?.isOneTimeDonation &&
      !campaignDetails?.isRecurringDonation
    ) {
      dispatch(updateDonationType("giveOnce"));
      return "once";
    }

    // If no giving levels exist and one-time donation is disabled, default to recurring
    if (
      (!campaignDetails?.givingLevels ||
        campaignDetails.givingLevels.length === 0) &&
      !campaignDetails?.isOneTimeDonation &&
      campaignDetails?.isRecurringDonation
    ) {
      dispatch(updateDonationType("monthly"));
      return "monthly";
    }

    // If both are available, check if all giving levels are recurring donations
    if (campaignDetails?.givingLevels?.length > 0) {
      const allRecurring = campaignDetails.givingLevels.every(
        (level) => level.donationType === "recurringDonation",
      );
      if (allRecurring) {
        dispatch(updateDonationType("monthly"));
        return "monthly";
      }
    }

    dispatch(updateDonationType("giveOnce"));
    // Default to "once" if not all recurring or no giving levels
    return "once";
  });

  // Add a ref to store previous giving levels for comparison
  const previousGivingLevelsRef = useRef(null);

  const isLogin = getCookie("token");

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address.")
      .required("Please enter your email address."),
  });

  const formik = useFormik({
    initialValues: {
      email: isLogin ? userDetails?.email || "" : cardEmail || "",
    },
    validationSchema: emailValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
  });

  useEffect(() => {
    // Get giving levels from donation object
    const givingLevels = donation?.campaignDetails?.givingLevels;
    if (givingLevels?.length > 0 && !dropdownChanged) {
      // Convert current giving levels to JSON for comparison
      const currentGivingLevelsJSON = JSON.stringify(givingLevels);

      // Only update if the giving levels have actually changed in content
      if (currentGivingLevelsJSON !== previousGivingLevelsRef.current) {
        // Update the reference of previous giving levels
        previousGivingLevelsRef.current = currentGivingLevelsJSON;

        // Check if all levels are recurring
        const allRecurring = givingLevels.every(
          (level) => level.donationType === "recurringDonation",
        );

        if (allRecurring) {
          dispatch(updateDonationType("monthly"));
          setSelectedDonationType("monthly");
        } else {
          dispatch(updateDonationType("giveOnce"));
          setSelectedDonationType("once");
        }
        if (donation?.monthlyDonation && !donation?.oneTimeDonation) {
          dispatch(updateDonationType("monthly"));
          setSelectedDonationType("monthly");
        }
        if (donation?.selectedBoxData?.donationType === "recurringDonation") {
          dispatch(updateDonationType("monthly"));
          setSelectedDonationType("monthly");
        }
      }
    } else if (
      // Handle case when there are no giving levels
      (!givingLevels || givingLevels.length === 0) &&
      !dropdownChanged &&
      !donation?.oneTimeDonation &&
      donation?.monthlyDonation
    ) {
      // No giving levels, one-time disabled, only recurring allowed
      dispatch(updateDonationType("monthly"));
      setSelectedDonationType("monthly");
    }
  }, [donation?.campaignDetails?.givingLevels]);

  const [autoProgressTriggered, setAutoProgressTriggered] = useState(true);

  // Update the handler function
  const handleDonationTypeClick = (type) => {
    setSelectedDonationType(type);
    // Mark that user has manually changed donation type
    userHasChangedDonationTypeRef.current = true;
    // Reset values when switching donation types
    setSelectedBox(null);
    setLevelAmount(null);
    setDonationAmount("");
    setIsCustomFieldHighlighted(false);
    setIsManualCustomFieldSelection(false);
    dispatch(selectedBoxDataHandler(null));
    dispatch(isLevelHandler(false));
    dispatch(updateDOnationValueBlock(""));
    // Clear donation values in Redux by explicitly setting them
    dispatch(
      donationHandler({
        title: "",
        description: "",
        totalAmount: 0,
        recurringDonation: 0,
      }),
    );

    if (type === "monthly") {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Recurring Selected on Donation Flow",
        properties: {
          $current_url: window?.location?.href,
          // ...posthog?.persistence?.props,
          ...utmParams,
        },
      };
      dispatch(updateDonationType("monthly"));
      if (parsedConsent?.analytics || !consentCookie) {
        enhancedHandlePosthog(
          handlePosthog,
          payload,
          campaignDetails?.title || "Campaign Page",
        );
      }
      dispatch(isRecurringHandler(true));
      dispatch(recurringTypeHandler("monthly"));
      dispatch(isSelectedRecurringPageHandler(false));
      dispatch(updateCustomDonation("recurringDonation"));
      setRecurringDonation(true);
    } else {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Give Once Selected on Donation Flow",
        properties: {
          $current_url: window?.location?.href,
          // ...posthog?.persistence?.props,
          ...utmParams,
        },
      };
      dispatch(updateDonationType("giveOnce"));
      if (parsedConsent?.analytics || !consentCookie) {
        enhancedHandlePosthog(
          handlePosthog,
          payload,
          campaignDetails?.title || "Campaign Page",
        );
      }
      dispatch(isRecurringHandler(false));
      dispatch(updateCustomDonation("oneTimeDonation"));
      setRecurringDonation(false);
    }
  };

  // Populate local state from Redux campaign data without making an API call
  const populateFromReduxData = (data) => {
    setIsCustomDonationAllow({
      isCustomDonation: data?.isCustomDonationsAllowed,
      minimumCustomDonation: data?.minimumDonationAmount,
    });
    const donationType =
      data.isRecurringDonation === true && data.isOneTimeDonation === true
        ? false
        : data.isRecurringDonation === false && data.isOneTimeDonation === true
          ? false
          : true;
    setIsOneTimeDonationForLabel(donationType);
    setOneTimeDonation(data?.isOneTimeDonation);
    setRecurringDonation(data?.isRecurringDonation);
    dispatch(monthlyDonationHandler(data?.isRecurringDonation));
    dispatch(oneTimeDonationHandler(data?.isOneTimeDonation));

    const convertedData = {
      symbol: data.currencySymbol,
      units: data.amountCurrency,
      currencyConversionId: data.currencyConversionId,
      isoAlpha2: data.countryId?.isoAlpha2,
      country: data.countryId?.name,
      currencyCountry: data.currencyCountry,
    };
    setCurrencyConversion(convertedData);
    const updatedGivingLevels = (data.givingLevels || []).map((level, idx) => ({
      ...level,
      index: idx,
    }));
    setGivingLevelsValues(updatedGivingLevels);
    dispatch(titleHandler(data.title));
    setCampaignDetails(data);
    dispatch(updateSellConfigs(data?.sellConfigs));
    dispatch(updateAmountCurrency(data?.amountCurrency));
    if (data?.currencyConversionId) {
      dispatch(
        currencySymbolHandler({
          currencyConversionId: data?.currencyConversionId,
        }),
      );
    }
    setIsLoading(false);
  };

  const getCampaignData = (isDropDown = false, selectedCurrency) => {
    // Only show skeleton on initial load, not on currency change
    if (!isDropDown) {
      setIsLoading(true);
    } else {
      setIsCurrencyLoading(true);
    }

    // Get cfCountry from localStorage
    const cfCountry =
      typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;
    getSingleCampaignDataGivingLevels(
      randomToken,
      selectedCurrency,
      "",
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral,
      null, // ip parameter
      null, // serverSideToken parameter
      cfCountry, // cfCountry parameter - retrieved from localStorage
    )
      .then((res) => {
        const result = res?.data;
        if (!result.success) {
          toast.error(result.message);
          return;
        }

        const data = result.data.campaignDetails;
        setIsCustomDonationAllow({
          isCustomDonation: data?.isCustomDonationsAllowed,
          minimumCustomDonation: data?.minimumDonationAmount,
        });
        const donationType =
          data.isRecurringDonation === true && data.isOneTimeDonation === true
            ? false
            : data.isRecurringDonation === false &&
                data.isOneTimeDonation === true
              ? false
              : true;
        setIsOneTimeDonationForLabel(donationType);
        dispatch(updateCampaignDetails(data));
        dispatch(updateSellConfigs(result.data?.campaignDetails?.sellConfigs));
        setOneTimeDonation(data?.isOneTimeDonation);
        setRecurringDonation(data?.isRecurringDonation);
        dispatch(monthlyDonationHandler(data?.isRecurringDonation));
        dispatch(oneTimeDonationHandler(data?.isOneTimeDonation));

        let conversionId;
        if (isDropDown === true) {
          conversionId = data?.currencyConversionId;
        }
        const convertedData = {
          symbol: data.currencySymbol,
          units: data.amountCurrency,
          currencyConversionId: isDropDown
            ? conversionId
            : data.currencyConversionId,
          isoAlpha2: data.countryId?.isoAlpha2,
          country: data.countryId?.name,
          currencyCountry: data.currencyCountry,
        };
        setCurrencyConversion(convertedData);
        const updatedGivingLevels = data.givingLevels.map((level, idx) => ({
          ...level,
          index: idx,
        }));
        setGivingLevelsValues(updatedGivingLevels);
        dispatch(titleHandler(data.title));

        if (isDropDown === true) {
          const selectedLevelAmount = data.givingLevels[selectedBox]?.amount;
          setLevelAmount(selectedLevelAmount);
          setDonationAmount("");
          dispatch(currencySymbolHandler(convertedData));
        }

        if (isDropDown === false) {
          setCampaignDetails(data);
          dispatch(
            updateSellConfigs(result.data?.campaignDetails?.sellConfigs),
          );
          dispatch(
            updateAmountCurrency(result.data?.campaignDetails?.amountCurrency),
          );
          if (data?.currencyConversionId) {
            dispatch(
              currencySymbolHandler({
                currencyConversionId: data?.currencyConversionId,
              }),
            );
          }
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (reduxCurrency && !isDropDown) {
          setSelectedCountry(reduxCurrency);
          getCampaignDetails(reduxCurrency?.unit, isDropDown);
        }
        setIsLoading(false);
        setIsCurrencyLoading(false);
      });
  };
  const getCampaignDetails = (selectedCurrency, isDropDown) => {
    // Get cfCountry from localStorage
    const cfCountry =
      typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;

    getSingleCampaignDataGivingLevels(
      randomToken,
      selectedCurrency,
      null, // screenType parameter
      null, // utmSource parameter
      null, // utmMedium parameter
      null, // utmCampaign parameter
      null, // utmTerm parameter
      null, // utmContent parameter
      null, // referral parameter
      null, // ip parameter
      null, // serverSideToken parameter
      cfCountry, // cfCountry parameter - retrieved from localStorage
    )
      .then((res) => {
        const result = res?.data;
        if (result.success) {
          const data = result.data.campaignDetails;
          const selectedLevel =
            data.givingLevels[
              pathname !== "/donate-now" ? desktopLevelIndex : levelIndex
            ];
          const donationPayload = {
            title: selectedLevel?.title,
            description: selectedLevel?.description,
            totalAmount: +selectedLevel?.amount,
            recurringDonation: +selectedLevel?.amount,
            symbol: currencyConversion?.symbol,
            units: currencyConversion?.units,
            isoAlpha2: currencyConversion?.isoAlpha2,
            country: currencyConversion?.country,
            zipCode: currencyConversion?.zipCode,
            currencyConversionId: currencyConversion?.currencyConversionId,
          };
          dispatch(donationHandler(donationPayload));
          dispatch(updateCampaignDetails(data));
          setOneTimeDonation(data?.isOneTimeDonation);
          setRecurringDonation(data.isRecurringDonation);
          dispatch(monthlyDonationHandler(data.isRecurringDonation));
          dispatch(oneTimeDonationHandler(data.isOneTimeDonation));
          const conversionId = data?.currencyConversionId;

          const convertedData = {
            symbol: data.currencySymbol,
            units: data.amountCurrency,
            currencyConversionId: conversionId,
            isoAlpha2: data.countryId?.isoAlpha2,
            country: data.countryId?.name,
            currencyCountry: data.currencyCountry,
          };
          setCurrencyConversion(convertedData);
          const updatedGivingLevels = data.givingLevels.map((level, idx) => ({
            ...level,
            index: idx,
          }));
          setGivingLevelsValues(updatedGivingLevels);
          dispatch(currencySymbolHandler(convertedData)); //changeable
          dispatch(titleHandler(data.title));
          const donationType =
            data.isRecurringDonation === true && data.isOneTimeDonation === true
              ? false
              : data.isRecurringDonation === false &&
                  data.isOneTimeDonation === true
                ? false
                : true;
          setIsOneTimeDonationForLabel(donationType);
          if (donationValue) {
            setLevelAmount(donationValue);
            setDonationAmount(donationValue);
          } else if (selectedBox !== null && data.givingLevels[selectedBox]) {
            // If a giving level is selected, use its amount
            setLevelAmount(data.givingLevels[selectedBox].amount);
            setDonationAmount(data.givingLevels[selectedBox].amount);
          } else if (
            levelIndex !== null &&
            levelIndex !== undefined &&
            data.givingLevels[levelIndex]
          ) {
            // If levelIndex is provided, use that level's amount
            setLevelAmount(data.givingLevels[levelIndex].amount);
            setDonationAmount(data.givingLevels[levelIndex].amount);
          } else if (donationAmount && donationAmount !== "") {
            // Keep existing custom donation amount
            setLevelAmount(donationAmount);
          }
          if (isDropDown) {
            setDonationAmount("");
          }
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message || "An error occurred");
      });
  };

  // Track previous randomToken to detect campaign changes on mobile
  const previousRandomTokenRef = useRef(randomToken);

  // App Router: Track route changes via pathname instead of router.events
  useEffect(() => {
    // Check if we're navigating within the donation flow
    // Don't reset state if navigating to/from recurring or payment pages
    const isDonationFlowPath = (path) => {
      return (
        path.includes("/recurringdonationpage") ||
        path.includes("/newpaymentmethod") ||
        path.includes("/paymentmethod") ||
        path.includes("/donate")
      );
    };

    const previousWasDonationFlow = isDonationFlowPath(previousPathRef.current);
    const currentIsDonationFlow = isDonationFlowPath(pathname);

    // Only reset if we're navigating away from donation flow completely
    if (
      previousPathRef.current !== pathname &&
      !previousWasDonationFlow &&
      !currentIsDonationFlow
    ) {
      hasUrlChanged.current = true;
      // Preserve currency before reset
      const preservedCurrency = reduxCurrency;
      const preservedCurrencySymbol = selectedCurrency;

      dispatch(resetDonationState());

      // Restore preserved currency after reset
      if (preservedCurrency) {
        dispatch(donateCurrencyHandler(preservedCurrency));
      }
      if (preservedCurrencySymbol) {
        dispatch(currencySymbolHandler(preservedCurrencySymbol));
      }
    }

    previousPathRef.current = pathname;

    return () => {
      // Only reset if we're leaving the app completely
      if (hasUrlChanged.current && !isDonationFlowPath(pathname)) {
        dispatch(resetDonationState());
      }
    };
  }, [pathname, dispatch, reduxCurrency, selectedCurrency]);

  // Reset state when campaign changes (randomToken changes) - handles mobile navigation
  useEffect(() => {
    if (
      previousRandomTokenRef.current !== null &&
      previousRandomTokenRef.current !== randomToken
    ) {
      // Preserve currency before reset
      const preservedCurrency = reduxCurrency;
      const preservedCurrencySymbol = selectedCurrency;

      // Reset all local state
      setSelectedBox(null);
      setLevelAmount(null);
      setDonationAmount("");
      setIsCustomFieldHighlighted(false);
      setIsManualCustomFieldSelection(false);
      setAutoProgressTriggered(true); // Reset to prevent auto-progression
      setBoxClickUpdated(false);
      setDropDownChanged(false);
      userHasChangedDonationTypeRef.current = false;
      previousGivingLevelsRef.current = null;

      // Reset redux donation state
      dispatch(resetDonationState());

      // Restore preserved currency after reset
      if (preservedCurrency) {
        dispatch(donateCurrencyHandler(preservedCurrency));
      }
      if (preservedCurrencySymbol) {
        dispatch(currencySymbolHandler(preservedCurrencySymbol));
      }
    }
    previousRandomTokenRef.current = randomToken;
  }, [randomToken, dispatch, reduxCurrency, selectedCurrency]);

  useEffect(() => {
    if (!randomToken) return;

    // With Activity component, the component stays mounted when hidden
    // Check if this is a fresh entry from campaign page (not navigating back)
    const isFreshEntry = !donateBack && activeStep === 0;

    const reduxData = donation?.campaignDetails;

    if (isFreshEntry) {
      // Use Redux data if already available (from campaign view page)
      // This avoids a redundant API call since the campaign page already fetched the data
      if (reduxData && reduxData?.title) {
        populateFromReduxData(reduxData);
        return;
      }
      // Fallback to API call if Redux data is not available
      getCampaignData(false, reduxCurrency?.unit);
      return;
    }

    // For navigation within donation flow, only fetch if we don't have data
    if (donation?.campaignDetails?.givingLevels?.length > 0) {
      // Data already exists, just ensure loading is false
      setIsLoading(false);
      return;
    }

    // Fetch data for the first time
    getCampaignData(false, reduxCurrency?.unit);
  }, [randomToken, donateBack, activeStep]);

  // Track when component becomes visible again from other donation steps
  // Force a rerender by updating local state from Redux
  const previousActiveStepRef = useRef(activeStep);
  useEffect(() => {
    // Check if we just became visible from another donation step (not from campaign page)
    if (previousActiveStepRef.current !== 0 && activeStep === 0 && donateBack) {
      // Component is becoming visible from donation flow, trigger rerender by updating state
      // This ensures the UI reflects any changes made in other steps
      if (donation?.campaignDetails) {
        const data = donation.campaignDetails;
        setCampaignDetails(data);
        setOneTimeDonation(data?.isOneTimeDonation);
        setRecurringDonation(data?.isRecurringDonation);

        const updatedGivingLevels = data.givingLevels.map((level, idx) => ({
          ...level,
          index: idx,
        }));
        setGivingLevelsValues(updatedGivingLevels);
      }
    }
    previousActiveStepRef.current = activeStep;
  }, [activeStep, donation?.campaignDetails, donateBack]);

  // Memoized handler to prevent unnecessary re-renders of CurrencySelector
  const handleDropDownChange = useCallback(
    (value) => {
      setSelectedCountry(value);
      const isDropDownEnabled = true;
      dispatch(donateCurrencyHandler(value));
      // Reset giving level selection when currency changes
      setSelectedBox(null);
      dispatch(selectedBoxDataHandler(null));
      setLevelAmount(null);
      setDonationAmount("");
      setIsLevel(false);
      dispatch(isLevelHandler(false));

      getCampaignData(isDropDownEnabled, value.unit);
      setDropDownChanged(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [dispatch],
  );

  const uniqueCountries = countriesList?.reduce(
    (acc, current) => {
      if (!acc.unique[current.currencyUnit]) {
        acc.unique[current.currencyUnit] = true; // Mark this currencyUnit as seen
        acc.result.push(current); // Add current country to result array
      }
      return acc;
    },
    { unique: {}, result: [] },
  ).result;

  useEffect(() => {
    // Don't auto-select if user has manually chosen custom field
    if (isManualCustomFieldSelection) return;

    if (levelIndex !== null && levelIndex !== undefined) {
      setSelectedBox(levelIndex === 0 ? 0 : Number(levelIndex));
      const selectedLevel = campaignDetails?.givingLevels[levelIndex];
      if (selectedLevel) {
        setLevelAmount(selectedLevel.amount);
        // Only auto-set donation type if user hasn't manually changed it
        if (
          selectedLevel.donationType === "recurringDonation" &&
          !userHasChangedDonationTypeRef.current
        ) {
          setSelectedDonationType("monthly");
          dispatch(updateDonationType("monthly"));
          dispatch(isRecurringHandler(true));
          dispatch(isSelectedRecurringPageHandler(false));
          dispatch(updateCustomDonation("recurringDonation"));
          setRecurringDonation(true);
        }
      }
      dispatch(
        selectedBoxDataHandler(campaignDetails?.givingLevels[levelIndex]),
      );
    }
    if (desktopLevelIndex !== null && desktopLevelIndex !== undefined) {
      setSelectedBox(desktopLevelIndex === 0 ? 0 : Number(desktopLevelIndex));
      const selectedLevel = campaignDetails?.givingLevels[desktopLevelIndex];
      if (selectedLevel) {
        setLevelAmount(selectedLevel.amount);
        // Only auto-set donation type if user hasn't manually changed it
        if (
          selectedLevel.donationType === "recurringDonation" &&
          !userHasChangedDonationTypeRef.current
        ) {
          setSelectedDonationType("monthly");
          dispatch(updateDonationType("monthly"));
          dispatch(isRecurringHandler(true));
          dispatch(isSelectedRecurringPageHandler(false));
          dispatch(updateCustomDonation("recurringDonation"));
          setRecurringDonation(true);
        }
      }
      dispatch(
        selectedBoxDataHandler(
          campaignDetails?.givingLevels[desktopLevelIndex],
        ),
      );
    }
  }, [
    levelIndex,
    desktopLevelIndex,
    campaignDetails?.givingLevels,
    currencyConversion,
    desktopLevelIndex,
    isManualCustomFieldSelection,
  ]);

  useEffect(() => {
    // Don't auto-select if user has manually chosen custom field
    if (isManualCustomFieldSelection) return;

    // Then set new values if levelIndex exists
    if (
      levelIndex !== null &&
      levelIndex !== undefined &&
      campaignDetails?.givingLevels
    ) {
      const selectedLevel = campaignDetails.givingLevels[levelIndex];
      if (selectedLevel) {
        setSelectedBox(Number(levelIndex));
        setLevelAmount(selectedLevel.amount);
        dispatch(selectedBoxDataHandler(selectedLevel));
      }
    }
    if (
      desktopLevelIndex !== null &&
      desktopLevelIndex !== undefined &&
      campaignDetails?.givingLevels
    ) {
      const selectedLevel = campaignDetails.givingLevels[desktopLevelIndex];
      if (selectedLevel) {
        setSelectedBox(Number(desktopLevelIndex));
        setLevelAmount(selectedLevel.amount);
        dispatch(selectedBoxDataHandler(selectedLevel));
      }
    }
  }, [randomToken, isManualCustomFieldSelection]); // Only run when randomToken (campaign) changes

  // Add this new helper function
  const findFilteredIndex = (originalIndex) => {
    if (originalIndex === null) return null;

    const filteredLevels = getFilteredGivingLevels();
    return filteredLevels.findIndex((level) => level.index === originalIndex);
  };

  useEffect(() => {
    // Only auto-select if user hasn't manually selected custom field
    if (!isManualCustomFieldSelection) {
      // Then set it based on levelIndex or selectedBoxData if they exist
      if (levelIndex !== null && levelIndex !== undefined) {
        const filteredIndex = findFilteredIndex(Number(levelIndex));
        setSelectedBox(filteredIndex);
      } else if (
        desktopLevelIndex !== null &&
        desktopLevelIndex !== undefined
      ) {
        const filteredIndex = findFilteredIndex(Number(desktopLevelIndex));
        setSelectedBox(filteredIndex);
      } else if (
        selectedBoxData &&
        (selectedBoxData.index === 0 || selectedBoxData.index)
      ) {
        const filteredIndex = findFilteredIndex(selectedBoxData.index);
        setSelectedBox(filteredIndex);
      }
    }
  }, [
    randomToken,
    levelIndex,
    desktopLevelIndex,
    selectedBoxData,
    selectedDonationType,
    givingLevelsValues,
    isManualCustomFieldSelection,
    findFilteredIndex,
  ]); // Added selectedDonationType as dependency

  const transformedCountriesList = uniqueCountries?.map((country) => ({
    name: country.currencyUnit,
    unit: country.currencyUnit,
    symbol: country.currency.symbol,
    id: country._id,
    isActive: country.currency.isActive,
  }));

  const activeCurrencies = transformedCountriesList?.filter(
    (currency) => currency.isActive === true,
  );

  useEffect(() => {}, [campaignDetails]);

  const getGivingLevelEventName = (item) => {
    switch (item?.recurringType) {
      case "dailyLast10NightsRamadan":
        return "Giving Level Clicked - Daily Last 10 Nights Ramadan";
      case "daily30DaysRamadan":
        return "Giving Level Clicked - Daily 30 Days Ramadan";
      case "dailyFirst10DaysDhulHijjah":
        return "Giving Level Clicked - Daily First 10 Days Dhul Hijjah";
      case "everyFriday":
        return "Giving Level Clicked - Every Friday";
      case "monthly":
        return "Giving Level Clicked - Monthly";
      default:
        return "Giving Level Clicked";
    }
  };

  const handleBoxClick = (item, index) => {
    const userId = getCookie("distinctId");
    const utmParams = getUTMParams(window.location.href);
    const payload = {
      distinctId: userId,
      event: getGivingLevelEventName(item),
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
    dispatch(desktopLevelIndexHandler(null));
    dispatch(
      recurringTypeHandler(
        item.donationType === "recurringDonation" ? item?.recurringType : "",
      ),
    );
    dispatch(isLevelHandler(true));
    const donationType =
      item.donationType === "recurringDonation" ? true : false;
    setDonationTypeLevel(donationType);
    setRecurringDonation(donationType);
    setIsLevel(true);
    setSelectedBox((prevSelected) => (prevSelected === index ? null : index));
    setLevelAmount(item?.amount);
    dispatch(
      isRecurringHandler(selectedDonationType === "once" ? false : true),
    );
    // Store the original index from the item instead of the filtered index
    dispatch(selectedBoxDataHandler({ ...item }));
    setPackageValues(item.recurringPackageValues);
    setIsCustomFieldHighlighted(false);
    setIsManualCustomFieldSelection(false); // Reset manual selection flag
    dispatch(packageValuesHandler(item?.recurringPackageValues));
    setBoxClickUpdated(true);
  };

  // Memoized handler to prevent unnecessary re-renders of NewCustomInputField
  const handleDonationChange = useCallback(
    (e) => {
      const value = e.target.value;
      dispatch(selectedBoxDataHandler(null));
      const isValidInput = /^\d*\.?\d*$/.test(value);

      if (!isValidInput) {
        setDonationAmount("");
        setLevelAmount(null);
      } else {
        dispatch(updateDOnationValueBlock(value));
        setDonationAmount(value);
        setLevelAmount(value);
      }
    },
    [dispatch],
  );

  // Memoized handler to prevent unnecessary re-renders of NewCustomInputField
  const customFieldClickHandler = useCallback(() => {
    setSelectedBox(null);
    setIsLevel(false);
    dispatch(isLevelHandler(false));
    // Only set levelAmount if donationAmount has a valid value
    // Otherwise clear it to force user to enter a custom amount
    if (donationAmount && donationAmount !== "" && donationAmount !== "0") {
      setLevelAmount(donationAmount);
    } else {
      setLevelAmount(null);
      setDonationAmount("");
    }
    dispatch(selectedBoxDataHandler(null));
    // Set flag to indicate manual custom field selection
    setIsManualCustomFieldSelection(true);

    // Toggle custom field highlighting state
    // If already highlighted, toggle it off; if not highlighted, turn it on
    setIsCustomFieldHighlighted((prev) => !prev);

    // Check if only recurring options are available and promote recurring is false
    const campaignDetails = donation?.campaignDetails;
    const onlyRecurringAvailable = recurringDonation && !oneTimeDonation;
    const promoteRecurringFalse = !campaignDetails?.isPromoteRecurringDonations;

    // If only recurring options exist and promote recurring is false, set recurring type to monthly
    if (onlyRecurringAvailable && promoteRecurringFalse) {
      dispatch(isRecurringHandler(true));
      dispatch(recurringTypeHandler("monthly"));
    } else if (
      recurringDonation &&
      oneTimeDonation &&
      selectedDonationType !== "once" &&
      promoteRecurringFalse
    ) {
      // When both recurring and one-time are available, recurring tab is selected,
      // and promote recurring is false, set recurring type to monthly for custom donation
      dispatch(isRecurringHandler(true));
      dispatch(recurringTypeHandler("monthly"));
    } else if (
      recurringDonation &&
      oneTimeDonation &&
      donationOption !== "recurringDonation"
    ) {
      dispatch(
        isRecurringHandler(selectedDonationType === "once" ? false : true),
      );
    } else if (
      recurringDonation &&
      oneTimeDonation &&
      donationOption === "recurringDonation"
    ) {
      dispatch(
        isRecurringHandler(selectedDonationType === "once" ? false : true),
      );
    } else if (recurringDonation) {
      dispatch(
        isRecurringHandler(selectedDonationType === "once" ? false : true),
      );
    } else {
      dispatch(
        isRecurringHandler(selectedDonationType === "once" ? false : true),
      );
    }
  }, [
    dispatch,
    donationAmount,
    donationOption,
    oneTimeDonation,
    recurringDonation,
    selectedDonationType,
    donation?.campaignDetails,
  ]);

  const donateModalButtonHandler = (donateValue) => {
    sendDonateDataToRedux(campaignDetails?.isOneTimeDonation, donateValue);
    setOpen(false);
  };

  const sendDonateDataToRedux = (isOneTimeDonation, donateValue) => {
    // Determine the amount to use based on what's selected
    // Priority: giving level (if selectedBox is not null) > custom donation (levelAmount)
    const amountToUse =
      selectedBox !== null && selectedBoxData
        ? selectedBoxData.amount
        : levelAmount;

    const donationPayload = {
      title:
        selectedBox !== null && selectedBoxData
          ? selectedBoxData.title
          : "Custom Donation",
      description:
        selectedBox !== null && selectedBoxData
          ? selectedBoxData.description
          : null,
      totalAmount: +amountToUse,
      recurringDonation: +amountToUse,
      symbol:
        selectedCurrency && selectedCurrency.symbol
          ? selectedCurrency.symbol
          : currencyConversion.symbol,
      units:
        selectedCurrency && selectedCurrency.units
          ? selectedCurrency.units
          : currencyConversion.units,
      isoAlpha2: currencyConversion.isoAlpha2,
      country: currencyConversion.country,
      zipCode: currencyConversion.zipCode,
      currencyConversionId: currencyConversion.currencyConversionId,
    };
    if (monthlyDonation) {
      donationPayload.recurringDonation = donateValue
        ? +donateValue
        : +amountToUse;
    }
    if (isOneTimeDonation) {
      donationPayload.recurringDonation = donateValue
        ? +donateValue
        : +amountToUse;
    }
    if (isOneTimeDonation && monthlyDonation) {
      donationPayload.recurringDonation = donateValue
        ? +donateValue
        : +amountToUse;
    }
    dispatch(donationHandler(donationPayload));
    next(donateValue);
  };
  const recurringPercentage = campaignDetails?.recurringSubscriptionPercentages;
  const nextButtonHandler = () => {
    const currentEmail = formik.values.email;
    // Store email in redux before progressing
    dispatch(cardHolderNameHandler({ email: currentEmail }));
    if (selectedBox === null) {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Custom Amount Clicked on Donation Flow",
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
    }
    dispatch(donateCurrencyHandler(selectedCountry));
    dispatch(campaignIdHandler(campaignDetails._id));
    dispatch(updateCampaignId(campaignDetails._id));
    dispatch(randomTokenHandler(randomToken));
    if (selectedCurrency === "") {
      dispatch(
        currencySymbolHandler({
          currencyConversionId: campaignDetails?.currencyConversionId,
        }),
      );
    }

    // Check if we should show the recurring modal based on A/B testing
    if (
      campaignDetails?.isOneTimeDonation === true &&
      campaignDetails?.isRecurringDonation === true &&
      !donationTypeLevel &&
      selectedBoxData?.donationType !== "recurringDonation" &&
      donationOption !== "recurringDonation" &&
      abTestingCookie !== "recurring_modal_version_1" &&
      abTestingCookie !== "donation_version_1"
    ) {
      sendDonateDataToRedux(campaignDetails?.isOneTimeDonation);
    } else {
      sendDonateDataToRedux(campaignDetails?.isOneTimeDonation);
    }
  };

  const next = (donateValue) => {
    if (!donateValue) {
      // Check if a giving level is selected (either from URL or manual selection)
      if (selectedBoxData) {
        // Check the actual giving level's donationType to determine isRecurring
        if (selectedBoxData?.donationType === "recurringDonation") {
          // If the giving level itself is recurring, always set to true
          dispatch(isRecurringHandler(true));
        } else {
          // If the giving level is one-time, check the selected donation type toggle
          dispatch(
            isRecurringHandler(selectedDonationType === "once" ? false : true),
          );
        }
      } else {
        // No giving level selected (custom donation)
        // Use the selected donation type toggle
        dispatch(
          isRecurringHandler(selectedDonationType === "once" ? false : true),
        );
      }
    }
    dispatch(donationBackHandler(true));
    if (selectedBox === null) {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Donate Button Clicked on Donation Flow",
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
    }

    setActiveStep((prevActiveStep) => {
      const nextStep =
        (donation.isRecurring && selectedBoxData) ||
        !donation?.campaignDetails?.isRecurringDonation ||
        !donation?.campaignDetails?.isPromoteRecurringDonations
          ? prevActiveStep + 2
          : prevActiveStep + 1;

      setCurrentIndex(prevActiveStep);
      return nextStep;
    });
  };

  useEffect(() => {
    if (boxClickUpdated) {
      // Only auto-progress if email is filled and valid
      const currentEmail = formik.values.email;
      // Validate the email field to show errors if invalid
      formik.validateField("email");
      formik.setFieldTouched("email", true);

      if (
        currentEmail &&
        currentEmail.trim() !== "" &&
        !formik.errors.email &&
        formik.isValid
      ) {
        nextButtonHandler();
      }
      setBoxClickUpdated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxClickUpdated, formik.values.email, dispatch]);

  const isDisable = (() => {
    // Disable if currency is loading
    if (isCurrencyLoading) {
      return true;
    }

    const currentEmail = formik.values.email;

    if (!currentEmail || currentEmail.trim() === "") {
      return true;
    }

    // Check if email has validation errors
    if (formik.errors.email || !formik.isValid) {
      return true;
    }

    // If a giving level is selected, button should be enabled
    // Check for null, -1, and undefined
    if (
      selectedBox !== null &&
      selectedBox !== -1 &&
      selectedBox !== undefined &&
      selectedBox >= 0
    ) {
      return false;
    }

    // If no giving level is selected, check custom field validation
    if (
      donationAmount === "" ||
      donationAmount === "0" ||
      donationAmount === undefined ||
      levelAmount === null ||
      levelAmount === 0 ||
      levelAmount === ""
    ) {
      return true;
    }

    // If custom donations are allowed and amount is below minimum, always disable
    if (
      isCustomDonationAllow.isCustomDonation &&
      parseFloat(donationAmount) <
        parseFloat(isCustomDonationAllow.minimumCustomDonation).toFixed(2)
    ) {
      return true;
    }

    return false;
  })();

  useEffect(() => {
    if (initialDonationOption === "recurringDonation") {
      setRecurringDonation(true);
      dispatch(isRecurringHandler(true));
    } else {
      // setRecurringDonation(false);
      // dispatch(isRecurringHandler(false));
    }
    dispatch(updateCustomDonation(initialDonationOption));
  }, [initialDonationOption, dispatch, campaignDetails]);

  useEffect(() => {
    const eventId = generateRandomToken("a", 5) + dayjs().unix();
    if (window?.fbq && campaignDetails) {
      const fbqData = {
        value: "",
        currency: "",
        campaignName: campaignDetails?.title || "",
        category: campaignDetails?.categoryId?.name || "",
        givingLevel: "",
      };

      // Add UTM parameters only if they are valid
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

      // Filter out invalid UTM parameters
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

      window?.fbq("track", "AddToCart", fbqData, {
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
        version: abTestingCookie,
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
        eventName: "AddToCart",
      };

      savePixelLogs(pixelPayload, campaignDetails?._id);

      getAddToCartFbTags(payload).catch((err) =>
        console.error(err, "Add to card script did not work"),
      );
    }
  }, [campaignDetails]);

  // Add this function to filter giving levels
  const getFilteredGivingLevels = () => {
    if (!givingLevelsValues) return [];
    return givingLevelsValues.filter((item) => {
      if (selectedDonationType === "once") {
        return item.donationType === "oneTimeDonation";
      } else if (selectedDonationType === "monthly") {
        return item.donationType === "recurringDonation";
      }
      return true;
    });
  };

  // Calculate if there are giving levels available for the current type
  const hasGivingLevelsForCurrentType = () => {
    const filteredLevels = getFilteredGivingLevels();
    return filteredLevels.length > 0;
  };

  // Extract the recurring modal condition check to a reusable function
  const shouldShowRecurringModal = (selectedLevel) => {
    return (
      campaignDetails?.isOneTimeDonation === true &&
      campaignDetails?.isRecurringDonation === true &&
      !donationTypeLevel &&
      selectedLevel?.donationType !== "recurringDonation" &&
      donationOption !== "recurringDonation" &&
      abTestingCookie !== "recurring_modal_version_1" &&
      abTestingCookie !== "donation_version_1"
    );
  };

  // Enhanced function for updating URL without refreshing
  const updateUrlWithoutRefresh = (newQuery) => {
    // Update the URL in the browser history
    const url =
      window?.location?.pathname +
      (Object.keys(newQuery).length
        ? "?" + new URLSearchParams(newQuery).toString()
        : "");

    window?.history?.replaceState(
      { ...window.history.state, as: url, url: url },
      "",
      url,
    );
  };

  // Add a new useEffect to handle automatic progression when levelIndex is provided
  useEffect(() => {
    const noBack = query.noBack;

    if (
      pathname !== "donate-now" &&
      desktopLevelIndex !== null &&
      desktopLevelIndex !== undefined &&
      campaignDetails &&
      !isLoading &&
      !autoProgressTriggered &&
      !donateBack &&
      currencyConversion // Make sure currency conversion is available
    ) {
      setAutoProgressTriggered(true);

      // Make sure all necessary data is set up, similar to what happens
      // when a box is clicked and the continue button is pressed
      dispatch(donateCurrencyHandler(selectedCountry));
      dispatch(campaignIdHandler(campaignDetails._id));
      dispatch(updateCampaignId(campaignDetails._id));
      dispatch(randomTokenHandler(randomToken));

      if (selectedCurrency === "") {
        dispatch(
          currencySymbolHandler({
            currencyConversionId: campaignDetails?.currencyConversionId,
          }),
        );
      }

      // Get the selected level data
      const selectedLevel = campaignDetails.givingLevels[desktopLevelIndex];
      if (selectedLevel) {
        // Set the level data in redux
        dispatch(selectedBoxDataHandler(selectedLevel));

        // Handle donation type (recurring vs one-time)
        const donationType = selectedLevel.donationType === "recurringDonation";
        dispatch(isRecurringHandler(donationType));

        // Update selected donation type based on level
        if (donationType) {
          setSelectedDonationType("monthly");
          dispatch(updateDonationType("monthly"));
        } else {
          setSelectedDonationType("once");
          dispatch(updateDonationType("giveOnce"));
        }

        // Prepare the donation payload
        const donationPayload = {
          title: selectedLevel.title,
          description: selectedLevel.description,
          totalAmount: +selectedLevel.amount,
          recurringDonation: +selectedLevel.amount,
          symbol: currencyConversion?.symbol,
          units: currencyConversion?.units,
          isoAlpha2: currencyConversion?.isoAlpha2,
          country: currencyConversion?.country,
          zipCode: currencyConversion?.zipCode,
          currencyConversionId: currencyConversion?.currencyConversionId,
        };
        dispatch(donationHandler(donationPayload));

        // Check if we should show the recurring modal
        if (shouldShowRecurringModal(selectedLevel)) {
          // Show the modal without removing noBack yet
          setOpen(true);
        } else {
          // Remove noBack from URL
          if (query.noBack) {
            const newQuery = {};
            // Copy all query params except noBack
            Object.keys(query).forEach((key) => {
              if (key !== "noBack") {
                newQuery[key] = query[key];
              }
            });

            // Update URL
            updateUrlWithoutRefresh(newQuery);
          }

          dispatch(donationBackHandler(true));
          if (selectedBox === null) {
            const userId = getCookie("distinctId");
            const utmParams = getUTMParams(window.location.href);
            const payload = {
              distinctId: userId,
              event: "Donate Button Clicked on Donation Flow",
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
          }
          setActiveStep((prevActiveStep) => {
            const nextStep =
              (donationType && (selectedBoxData || recurringType)) ||
              !donation?.campaignDetails?.isRecurringDonation ||
              !donation?.campaignDetails?.isPromoteRecurringDonations
                ? prevActiveStep + 2
                : prevActiveStep + 1;
            setCurrentIndex(prevActiveStep);
            return nextStep;
          });
        }
      }
    } else if (
      levelIndex !== null &&
      levelIndex !== undefined &&
      noBack === "true" &&
      campaignDetails &&
      !isLoading &&
      !autoProgressTriggered &&
      currencyConversion // Make sure currency conversion is available
    ) {
      // Set the flag to prevent multiple triggers
      setAutoProgressTriggered(true);

      // Make sure all necessary data is set up, similar to what happens
      // when a box is clicked and the continue button is pressed
      dispatch(donateCurrencyHandler(selectedCountry));
      dispatch(campaignIdHandler(campaignDetails._id));
      dispatch(updateCampaignId(campaignDetails._id));
      dispatch(randomTokenHandler(randomToken));

      if (selectedCurrency === "") {
        dispatch(
          currencySymbolHandler({
            currencyConversionId: campaignDetails?.currencyConversionId,
          }),
        );
      }

      // Get the selected level data
      const selectedLevel = donation?.campaignDetails.givingLevels[levelIndex];
      if (selectedLevel) {
        // Set the level data in redux
        dispatch(selectedBoxDataHandler(selectedLevel));

        // Handle donation type (recurring vs one-time)
        const donationType = selectedLevel.donationType === "recurringDonation";
        dispatch(isRecurringHandler(donationType));

        // Update selected donation type based on level
        if (donationType) {
          setSelectedDonationType("monthly");
          dispatch(updateDonationType("monthly"));
        } else {
          setSelectedDonationType("once");
          dispatch(updateDonationType("giveOnce"));
        }

        // Prepare the donation payload
        const donationPayload = {
          title: selectedLevel.title,
          description: selectedLevel.description,
          totalAmount: +selectedLevel.amount,
          recurringDonation: +selectedLevel.amount,
          symbol: currencyConversion?.symbol,
          units: currencyConversion?.units,
          isoAlpha2: currencyConversion?.isoAlpha2,
          country: currencyConversion?.country,
          zipCode: currencyConversion?.zipCode,
          currencyConversionId: currencyConversion?.currencyConversionId,
        };
        dispatch(donationHandler(donationPayload));

        // Check if we should show the recurring modal
        if (shouldShowRecurringModal(selectedLevel)) {
          // Show the modal without removing noBack yet
          setOpen(true);
        } else {
          // Remove noBack from URL
          if (query.noBack) {
            const newQuery = {};
            // Copy all query params except noBack
            Object.keys(query).forEach((key) => {
              if (key !== "noBack") {
                newQuery[key] = query[key];
              }
            });

            // Update URL
            updateUrlWithoutRefresh(newQuery);
          }

          dispatch(donationBackHandler(true));
          if (selectedBox === null) {
            const userId = getCookie("distinctId");
            const utmParams = getUTMParams(window.location.href);
            const payload = {
              distinctId: userId,
              event: "Donate Button Clicked on Donation Flow",
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
          }

          setActiveStep((prevActiveStep) => {
            const nextStep =
              (donationType && (selectedBoxData || recurringType)) ||
              !donation?.campaignDetails?.isRecurringDonation ||
              !donation?.campaignDetails?.isPromoteRecurringDonations
                ? prevActiveStep + 2
                : prevActiveStep + 1;
            setCurrentIndex(prevActiveStep);
            return nextStep;
          });
        }
      }
    }
  }, [
    levelIndex,
    desktopLevelIndex,
    campaignDetails,
    isLoading,
    autoProgressTriggered,
    currencyConversion,
    dispatch,
    randomToken,
    selectedCountry,
    selectedCurrency,
    setActiveStep,
    setCurrentIndex,
    donationOption,
    donationTypeLevel,
    abTestingCookie,
    campaignVersion,
    router,
    donation.campaignDetails,
    donateBack,
  ]);

  useEffect(() => {
    const userId = getCookie("distinctId");
    const utmParams = getUTMParams(window.location.href);
    const payload = {
      distinctId: userId,
      event: "Giving Levels on Donation Page Loaded",
      properties: {
        $current_url: window?.location?.href || "",
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
  }, []);

  // Also add a handler for modal close that keeps noBack parameter
  const handleModalClose = () => {
    // Don't remove noBack when modal is closed without selection
    setOpen(false);
  };

  // Create a component for the custom input field to pass to DonationTemplate
  const customInputFieldElement = isCustomDonationAllow?.isCustomDonation && (
    <>
      <NewCustomInputField
        value={donationAmount}
        onChange={handleDonationChange}
        onClick={customFieldClickHandler}
        min={0}
        recurringDonation={recurringDonation}
        oneTimeDonation={oneTimeDonation}
        monthlyDonation={monthlyDonation}
        isOneTimeDonations={isOneTimeDonations}
        isHighlighted={isCustomFieldHighlighted}
        isOneTimeDonationForLabel={isOneTimeDonationForLabel}
        currencyData={activeCurrencies}
        selectedCurrency={selectedCountry}
        onCurrencyChange={handleDropDownChange}
        activeCurrencies={activeCurrencies}
        currencyConversion={currencyConversion}
        selectedCountry={selectedCountry}
        isLoading={isCurrencyLoading}
      />
      {donationAmount !== "" &&
        donationAmount <
          isCustomDonationAllow.minimumCustomDonation.toFixed(2) && (
          <TypographyComp
            sx={{
              ml: 1,
              marginTop:
                monthlyDonation && isOneTimeDonations
                  ? { xs: "15px", sm: "25px" }
                  : "0px",
              color: "red",
              fontSize: "14px",
              opacity: 0.7,
            }}
          >
            Amount should be greater than or equal to{" "}
            {currencyConversion?.units}{" "}
            {formatNumberWithCommas(
              isCustomDonationAllow.minimumCustomDonation.toFixed(2),
            )}
          </TypographyComp>
        )}
    </>
  );

  return (
    <>
      <Head>
        <title>{campaignDetails?.title || "Madinah"}</title>
        <meta
          name="description"
          content={
            campaignDetails?.subTitle ||
            "Trusted fundraising for all of life's moments..."
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <DonationTemplate
        heading="Secure donation"
        onClickHandler={nextButtonHandler}
        isContinueButtonDisabled={isDisable}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        setCurrentIndex={setCurrentIndex}
        newDonation
        selectedDonationType={selectedDonationType}
        // customInputField={customInputFieldElement}
        hasGivingLevels={hasGivingLevelsForCurrentType()}
        isSubmitButton={false}
      >
        <StackComponent
          direction="row"
          justifyContent={{ xs: "space-between", sm: "space-between" }}
          sx={{
            marginTop: { xs: "0px", sm: "0px" },
            marginBottom: "15px",
          }}
        >
          <EmailField formik={formik} />
        </StackComponent>
        <StackComponent
          direction="row"
          justifyContent={{ xs: "space-between", sm: "space-between" }}
          sx={{ marginTop: { xs: "0px", sm: "0px" }, marginBottom: "15px" }}
        >
          <BoxComponent
            sx={{
              width: "100%",
              display: "flex",
              gap: "15px",
            }}
          >
            {donation.oneTimeDonation && (
              <ButtonComp
                onClick={() => handleDonationTypeClick("once")}
                disabled={
                  !donation.oneTimeDonation ||
                  (!donation.campaignDetails?.isCustomDonationsAllowed &&
                    !donation?.campaignDetails?.givingLevels?.some(
                      (level) => level.donationType === "oneTimeDonation",
                    ))
                }
                sx={{
                  width: donation.monthlyDonation ? "192px" : "100%",
                  borderRadius: "10px",
                  height: "40px",
                  backgroundColor:
                    selectedDonationType === "once"
                      ? "primary.main"
                      : "transparent",
                  color:
                    selectedDonationType === "once" ? "white" : "primary.main",
                  "&:hover": {
                    backgroundColor:
                      selectedDonationType === "once"
                        ? "primary.dark"
                        : "transparent",
                  },
                }}
                variant={
                  selectedDonationType === "once" ? "contained" : "outlined"
                }
              >
                Give once
              </ButtonComp>
            )}
            {donation.monthlyDonation && (
              <ButtonComp
                onClick={() => handleDonationTypeClick("monthly")}
                disabled={
                  !donation.monthlyDonation ||
                  (!donation.campaignDetails?.isCustomDonationsAllowed &&
                    !donation?.campaignDetails?.givingLevels?.some(
                      (level) => level.donationType === "recurringDonation",
                    ))
                }
                sx={{
                  width: donation.oneTimeDonation ? "192px" : "100%",
                  borderRadius: "10px",
                  height: "40px",
                  backgroundColor:
                    selectedDonationType === "monthly"
                      ? "primary.main"
                      : "transparent",
                  color:
                    selectedDonationType === "monthly"
                      ? "white"
                      : "primary.main",
                  "&:hover": {
                    backgroundColor:
                      selectedDonationType === "monthly"
                        ? "primary.dark"
                        : "transparent",
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "center",
                }}
                variant={
                  selectedDonationType === "monthly" ? "contained" : "outlined"
                }
              >
                <Image
                  style={{
                    marginBottom: "3px",
                    filter:
                      selectedDonationType === "monthly"
                        ? "brightness(0) invert(1)"
                        : "none",
                  }}
                  src={heartIcon}
                  alt="heart"
                  width={16}
                  height={16}
                />
                Recurring
              </ButtonComp>
            )}
          </BoxComponent>
        </StackComponent>

        {/* Show custom input field in content area when no giving levels are available */}
        {/* {!hasGivingLevelsForCurrentType() &&
          isCustomDonationAllow?.isCustomDonation && (
            <BoxComponent>{customInputFieldElement}</BoxComponent>
          )} */}

        {isLoading ? (
          <GivingLevelSkeleton />
        ) : (
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexDirection: "column",
              opacity: isCurrencyLoading ? 0.6 : 1,
              pointerEvents: isCurrencyLoading ? "none" : "auto",
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            {/* Custom input field is now moved to the sticky footer */}
            <GridComp container spacing={1.5}>
              {getFilteredGivingLevels()?.length !== 0 &&
                getFilteredGivingLevels()?.map((item, index) => (
                  <GridComp item xs={4} sm={4} key={index}>
                    <NewSelectAbleLevel
                      isActive={selectedBox === index}
                      onClick={
                        isCurrencyLoading
                          ? () => {}
                          : () => handleBoxClick(item, index)
                      }
                      heading={item.title}
                      title={item.description}
                      amount={item.amount.toFixed(2)}
                      height={60}
                      currencySymbol={currencyConversion?.symbol}
                      currencyUnit={currencyConversion?.units}
                      donationType={item?.donationType}
                      recurringType={item?.recurringType}
                    />
                  </GridComp>
                ))}
            </GridComp>
            <>
              <NewCustomInputField
                value={donationAmount}
                onChange={handleDonationChange}
                onClick={customFieldClickHandler}
                min={0}
                recurringDonation={recurringDonation}
                oneTimeDonation={oneTimeDonation}
                monthlyDonation={monthlyDonation}
                isOneTimeDonations={isOneTimeDonations}
                isHighlighted={isCustomFieldHighlighted}
                isOneTimeDonationForLabel={isOneTimeDonationForLabel}
                currencyData={activeCurrencies}
                selectedCurrency={selectedCountry}
                onCurrencyChange={handleDropDownChange}
                activeCurrencies={activeCurrencies}
                currencyConversion={currencyConversion}
                selectedCountry={selectedCountry}
              />
              {donationAmount !== "" &&
                parseFloat(donationAmount) <
                  parseFloat(
                    isCustomDonationAllow.minimumCustomDonation,
                  ).toFixed(2) && (
                  <TypographyComp
                    sx={{
                      ml: 1,
                      marginTop:
                        monthlyDonation && isOneTimeDonations
                          ? { xs: "15px", sm: "25px" }
                          : "0px",
                      color: "red",
                      fontSize: "14px",
                      opacity: 0.7,
                    }}
                  >
                    Amount should be greater than or equal to{" "}
                    {currencyConversion?.units}{" "}
                    {formatNumberWithCommas(
                      isCustomDonationAllow.minimumCustomDonation.toFixed(2),
                    )}
                  </TypographyComp>
                )}
              <BoxComponent sx={{ padding: "0" }}>
                <SubmitButton
                  sx={{
                    mt: { xs: 2, sm: 0 },
                    width: { sm: newDonation ? "100%" : "auto" },
                    maxWidth: newDonation && isSmallScreen ? "600px" : "none",
                    margin: newDonation && isSmallScreen ? "0 auto" : "0 auto",
                  }}
                  isContinueButtonDisabled={isDisable}
                  onClick={nextButtonHandler}
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
            </>
          </div>
        )}
        {open && (
          <ModalComponent
            open={open}
            onClose={handleModalClose}
            width={738}
            borderRadius="32px"
            padding="48px 32px 48px 32px"
          >
            <RecurringModal
              onClick={donateModalButtonHandler}
              levelAmount={levelAmount}
              selectedCountry={selectedCountry}
              recurringPercentage={recurringPercentage}
              symbol={currencyConversion?.symbol}
              unit={currencyConversion?.units}
              packageValues={packageValues}
              isLevel={isLevel}
            />
          </ModalComponent>
        )}
      </DonationTemplate>
    </>
  );
};

NewGivingLevels.propTypes = {
  campaignDetails: PropTypes.object,
  setActiveStep: PropTypes.func,
  setCurrentIndex: PropTypes.func,
  setSelectedBoxData: PropTypes.func,
  selectedBoxData: PropTypes.any,
  randomToken: PropTypes.any,
  activeStep: PropTypes.number,
  levelIndex: PropTypes.any,
};

// Custom comparison function for React.memo
// Only rerender if randomToken, activeStep, or levelIndex actually change
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.randomToken === nextProps.randomToken &&
    prevProps.activeStep === nextProps.activeStep &&
    prevProps.levelIndex === nextProps.levelIndex
  );
};

// Wrap component with React.memo to prevent unnecessary rerenders
export default React.memo(NewGivingLevels, arePropsEqual);
