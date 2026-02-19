"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAddToCartFbTags, getSingleCampaignData } from "@/api";

import {
  campaignIdHandler,
  currencySymbolHandler,
  donateCurrencyHandler,
  donationHandler,
  isRecurringHandler,
  monthlyDonationHandler,
  oneTimeDonationHandler,
  randomTokenHandler,
  resetDonationState,
  selectedBoxDataHandler,
  updateCampaignDetails,
  updateCustomDonation,
} from "@/store/slices/donationSlice";

import Head from "next/head";
import RecurringModal from "./RecurringModal";
import { titleHandler } from "@/store/slices/authSlice";
import { DONATION_METHOD_OPTION } from "@/config/constant";
import GridComp from "@/components/atoms/GridComp/GridComp";
import DropDown from "@/components/atoms/inputFields/DropDown";
import StackComponent from "@/components/atoms/StackComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import GivingLevelSkeleton from "../paymentSkeleton/GivingLevelSkeleton";
import CustomInputField from "@/components/atoms/inputFields/CustomInputField";
import SelectAbleLevel from "@/components/atoms/selectAbleField/SelectAbleLevel";
import DonationTemplate from "@/components/templates/donationTemplate/DonationTemplate";
import RadioButtonGroups from "@/components/molecules/radionButtonGroups/RadioButtonGroups";

import {
  updateAmountCurrency,
  updateCampaignId,
  updateSellConfigs,
} from "@/store/slices/sellConfigSlice";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { usePathname, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { generateRandomToken } from "@/utils/helpers";
import { getCookie } from "cookies-next";
// import { savePixelLogs } from "@/api/post-api-services";
// import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { savePixelLogs } from "@/api/post-api-services";
// import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const GivingLevels = ({
  activeStep,
  setActiveStep,
  setCurrentIndex,
  randomToken,
  levelIndex,
}) => {
  const dispatch = useDispatch();
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

  // const { isSmallScreen } = useResponsiveScreen();
  // const campaignId = useSelector((state) => state.donation.campaignId);
  const campaignIdRedux = useSelector(
    (state) => state.donation.campaignDetails?._id,
  );
  const abTestingCookie = getCookie("abtesting");
  const campaignVersion = getCookie("campaign_testing");
  const experimentKey = localStorage.getItem("experimentKey");
  const variationKey = localStorage.getItem("variationKey");
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
  const content_ids = [campaignIdRedux];
  const content_type = "product";
  const user_roles = "guest";
  const url = window?.location?.href;
  // const customDonationCheckbox = useSelector(
  //   (state) => state?.donation?.customDonationCheckbox
  // );
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
  // const [nextClicked, setNextClicked] = useState(false);
  const initialDonationOption = useSelector(
    (state) => state?.donation?.customDonationCheckbox,
  );
  const customDonation = useSelector(
    (state) => state?.donation?.donationValues,
  );

  const fbpData = getCookie("_fbp");

  const [isCustomDonationAllow, setIsCustomDonationAllow] = useState({
    isCustomDonation: true,
    minimumCustomDonation: 0,
  });

  const [isCustomFieldHighlighted, setIsCustomFieldHighlighted] =
    useState(false);

  const [isOneTimeDonationForLabel, setIsOneTimeDonationForLabel] =
    useState(false);

  const [donationOption, setDonationOption] = useState(initialDonationOption);
  const [levelAmount, setLevelAmount] = useState(donationValue || null);
  const [givingLevelsValues, setGivingLevelsValues] = useState(null);
  const [currencyConversion, setCurrencyConversion] = useState(null);
  const [recurringDonation, setRecurringDonation] = useState(false);
  const [oneTimeDonation, setOneTimeDonation] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [packageValues, setPackageValues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLevel, setIsLevel] = useState(null);
  const [open, setOpen] = useState(false);
  const [reduxLoading, setReduxLoading] = useState(true);
  const [donationTypeLevel, setDonationTypeLevel] = useState(null);
  // const [selectedBox, setSelectedBox] = useState(() => {
  //   if (
  //     selectedBoxData &&
  //     (selectedBoxData.index === 0 || selectedBoxData.index)
  //   ) {
  //     return selectedBoxData.index;
  //   }
  //   return Number(levelIndex) || null;
  // });
  const [selectedBox, setSelectedBox] = useState(null);

  const [boxClickUpdated, setBoxClickUpdated] = useState(false);
  const [autoProgressTriggered, setAutoProgressTriggered] = useState(false);

  const getCampaignData = (isDropDown = false, selectedCurrency) => {
    setIsLoading(true);
    // Consider showing loading state before the call
    const cfCountry = typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;
    getSingleCampaignData(
      randomToken,
      selectedCurrency,
      "",
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral,
      null,
      null,
      cfCountry,
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
        // setRecurringDonation(donationType);

        let conversionId;
        if (isDropDown === true) {
          conversionId = data?.currencyConversionId;
          // ? data?.currencyConversionId
          // : campaignDetails?.currencyConversionId;
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
          dispatch(isRecurringHandler(data.isRecurringDonation));
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
        toast.error(error.message || "An error occurred");
      })
      .finally(() => {
        if (reduxCurrency && !isDropDown) {
          setReduxLoading(true);
          setSelectedCountry(selectedCountry);
          getCampaignDetails(selectedCountry?.unit, isDropDown);
        }
        setIsLoading(false);
      });
  };

  const getCampaignDetails = (selectedCurrency, isDropDown) => {
    const cfCountryDetail = typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;
    getSingleCampaignData(randomToken, selectedCurrency, undefined, undefined, undefined, undefined, undefined, undefined, undefined, null, null, cfCountryDetail)
      .then((res) => {
        setIsLoading(false);
        setReduxLoading(false);
        const result = res?.data;
        if (result.success) {
          const data = result.data.campaignDetails;
          dispatch(updateCampaignDetails(data));
          setOneTimeDonation(data?.isOneTimeDonation);
          setRecurringDonation(data.isRecurringDonation);
          dispatch(monthlyDonationHandler(data.isRecurringDonation));
          dispatch(oneTimeDonationHandler(data.isOneTimeDonation));

          const conversionId = data?.currencyConversionId;
          // ? data?.currencyConversionId
          // : campaignDetails?.currencyConversionId;

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

          // // Set the selected box based on levelIndex if it exists
          // if (levelIndex !== null && levelIndex !== undefined) {
          //   const indexNum = Number(levelIndex);
          //   if (data.givingLevels[indexNum]) {
          //     setSelectedBox(indexNum);
          //     setLevelAmount(data.givingLevels[indexNum].amount);
          //     setDonationAmount(data.givingLevels[indexNum].amount);
          //     dispatch(
          //       selectedBoxDataHandler({
          //         ...data.givingLevels[indexNum],
          //         index: indexNum,
          //       })
          //     );
          //   }
          // } else if (
          //   selectedBoxData &&
          //   (selectedBoxData.index === 0 || selectedBoxData.index)
          // ) {
          //   // If we have a previously selected box, maintain that selection
          //   setSelectedBox(selectedBoxData.index);
          //   setLevelAmount(selectedBoxData.amount);
          //   setDonationAmount(selectedBoxData.amount);
          // }

          const donationType =
            data.isRecurringDonation === true && data.isOneTimeDonation === true
              ? false
              : data.isRecurringDonation === false &&
                  data.isOneTimeDonation === true
                ? false
                : true;
          setIsOneTimeDonationForLabel(donationType);

          // Fix: Set levelAmount appropriately when currency is in URL
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
          } else {
            // Default to empty state or first giving level amount if necessary
            setLevelAmount(
              data.givingLevels.length > 0 ? data.givingLevels[0].amount : "",
            );
            setDonationAmount(
              data.givingLevels.length > 0 ? data.givingLevels[0].amount : "",
            );
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
        // setIsLoading(false);
      });
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
    const currency = query.currency;
    if (randomToken) {
      if (!currency) {
        getCampaignData(false, reduxCurrency?.unit);
      } else {
        getCampaignData(false, reduxCurrency?.unit);
      }
    }
  }, [randomToken]);

  const handleDropDownChange = (value) => {
    setSelectedCountry(value);
    const isDropDownEnabled = true;
    dispatch(donateCurrencyHandler(""));
    getCampaignData(isDropDownEnabled, value.unit);
  };

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
    if (
      levelIndex !== null &&
      levelIndex !== undefined &&
      !selectedBoxData &&
      customDonation?.title !== "Custom Donation"
    ) {
      setSelectedBox(levelIndex === 0 ? 0 : Number(levelIndex));
      const selectedLevel = campaignDetails?.givingLevels[levelIndex];
      if (selectedLevel) {
        setLevelAmount(selectedLevel.amount);
      }
      dispatch(
        selectedBoxDataHandler(campaignDetails?.givingLevels[levelIndex]),
      );
    }
  }, [levelIndex, campaignDetails?.givingLevels, currencyConversion]);

  useEffect(() => {
    // Reset all related states when campaign changes
    dispatch(selectedBoxDataHandler(null));
    setSelectedBox(null);
    setLevelAmount(null);
    setDonationAmount("");
    setAutoProgressTriggered(false); // Reset the flag when campaign changes

    // Then set new values if levelIndex exists
    if (
      levelIndex !== null &&
      levelIndex !== undefined &&
      campaignDetails?.givingLevels &&
      customDonation?.title !== "Custom Donation"
    ) {
      const selectedLevel = campaignDetails.givingLevels[levelIndex];
      if (selectedLevel) {
        setSelectedBox(Number(levelIndex));
        setLevelAmount(selectedLevel.amount);
        dispatch(selectedBoxDataHandler(selectedLevel));
        setDonationAmount(selectedLevel.amount);
      }
    } else if (
      selectedBoxData &&
      (selectedBoxData.index === 0 || selectedBoxData.index)
    ) {
      setSelectedBox(selectedBoxData.index);
      setLevelAmount(selectedBoxData.amount);
      setDonationAmount(selectedBoxData.amount);
      dispatch(selectedBoxDataHandler(selectedBoxData));
      dispatch(
        isRecurringHandler(
          selectedBoxData.donationType === "recurringDonation" ? true : false,
        ),
      );
    } else {
      setLevelAmount(donationAmount);
      dispatch(selectedBoxDataHandler(null));
      if (
        recurringDonation &&
        oneTimeDonation &&
        donationOption !== "recurringDonation"
      ) {
        dispatch(isRecurringHandler(false));
      } else if (
        recurringDonation &&
        oneTimeDonation &&
        donationOption === "recurringDonation"
      ) {
        dispatch(isRecurringHandler(true));
      } else if (recurringDonation) {
        dispatch(isRecurringHandler(true));
      } else {
        dispatch(isRecurringHandler(false));
      }
      setDonationAmount(donationValue);
    }
  }, [randomToken]); // Only run when randomToken (campaign) changes

  useEffect(() => {
    setSelectedBox(null);

    // Then set it based on levelIndex or selectedBoxData if they exist
    if (
      levelIndex !== null &&
      levelIndex !== undefined &&
      !selectedBoxData &&
      customDonation?.title !== "Custom Donation"
    ) {
      setSelectedBox(Number(levelIndex));
    } else if (
      selectedBoxData &&
      (selectedBoxData.index === 0 || selectedBoxData.index)
    ) {
      setSelectedBox(selectedBoxData.index);
    }
  }, [randomToken, levelIndex, selectedBoxData]);

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
  const handleBoxClick = (item, index) => {
    const donationType =
      item.donationType === "recurringDonation" ? true : false;
    setDonationTypeLevel(donationType);
    setRecurringDonation(donationType);
    setIsLevel(true);
    setSelectedBox((prevSelected) => (prevSelected === index ? null : index));
    setLevelAmount(item?.amount);
    dispatch(isRecurringHandler(donationType));
    dispatch(selectedBoxDataHandler(item));
    setPackageValues(item.recurringPackageValues);
    setIsCustomFieldHighlighted(false);
    setBoxClickUpdated(true);
  };

  useEffect(() => {
    if (boxClickUpdated) {
      nextButtonHandler();
      setBoxClickUpdated(false);
    }
  }, [boxClickUpdated]);

  const handleDonationChange = (e) => {
    const value = e.target.value;
    dispatch(selectedBoxDataHandler(null));

    const isValidInput = /^\d*\.?\d*$/.test(value);

    if (!isValidInput) {
      setDonationAmount("");
      setLevelAmount(null);
    } else {
      setDonationAmount(value);
      setLevelAmount(value);
    }
  };

  const customFieldClickHandler = () => {
    setSelectedBox(null);
    setIsLevel(false);
    setLevelAmount(donationAmount);
    dispatch(selectedBoxDataHandler(null));
    if (
      recurringDonation &&
      oneTimeDonation &&
      donationOption !== "recurringDonation"
    ) {
      dispatch(isRecurringHandler(false));
    } else if (
      recurringDonation &&
      oneTimeDonation &&
      donationOption === "recurringDonation"
    ) {
      dispatch(isRecurringHandler(true));
    } else if (recurringDonation) {
      dispatch(isRecurringHandler(true));
    } else {
      dispatch(isRecurringHandler(false));
    }
  };

  // Enhanced function for updating URL without refreshing
  const updateUrlWithoutRefresh = (newQueryObj) => {
    // Update the URL in the browser history
    const url =
      window.location.pathname +
      (Object.keys(newQueryObj).length
        ? "?" + new URLSearchParams(newQueryObj).toString()
        : "");

    window.history.replaceState(
      { ...window.history.state, as: url, url: url },
      "",
      url,
    );
  };

  const donateModalButtonHandler = (donateValue) => {
    // Remove noBack from URL when selection in modal is made
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

    sendDonateDataToRedux(campaignDetails?.isOneTimeDonation, donateValue);
    setOpen(false);
  };

  const sendDonateDataToRedux = (isOneTimeDonation, donateValue) => {
    const donationPayload = {
      title:
        selectedBoxData !== null ? selectedBoxData.title : "Custom Donation",
      description:
        selectedBoxData !== null ? selectedBoxData.description : null,
      totalAmount: +levelAmount,
      recurringDonation: +levelAmount,
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
        : +levelAmount;
    }
    if (isOneTimeDonation) {
      donationPayload.recurringDonation = donateValue
        ? +donateValue
        : +levelAmount;
    }
    if (isOneTimeDonation && monthlyDonation) {
      donationPayload.recurringDonation = donateValue
        ? +donateValue
        : +levelAmount;
    }

    dispatch(donationHandler(donationPayload));
    next(donateValue);
  };
  // const givingLevels = campaignDetails?.givingLevels;
  const recurringPercentage = campaignDetails?.recurringSubscriptionPercentages;

  // Extract the recurring modal condition check to a reusable function
  const shouldShowRecurringModal = (selectedLevel) => {
    return (
      campaignDetails?.isOneTimeDonation === true &&
      campaignDetails?.isRecurringDonation === true &&
      !donationTypeLevel &&
      selectedLevel?.donationType !== "recurringDonation" &&
      donationOption !== "recurringDonation" &&
      abTestingCookie !== "recurring_modal_version_1"
    );
  };

  const nextButtonHandler = () => {
    dispatch(donateCurrencyHandler(selectedCountry));
    dispatch(campaignIdHandler(campaignDetails._id));
    dispatch(updateCampaignId(campaignDetails._id));
    dispatch(randomTokenHandler(randomToken));

    // Set the correct isRecurring value when custom field is selected and no radio buttons were shown
    if (selectedBox === null) {
      // Custom donation field is selected
      if (!monthlyDonation && isOneTimeDonations) {
        // Only one-time donation is available
        dispatch(isRecurringHandler(false));
      } else if (monthlyDonation && !isOneTimeDonations) {
        // Only recurring donation is available
        dispatch(isRecurringHandler(true));
      }
      // If both options are available, the radio button handler would have already set isRecurring
    }

    if (selectedCurrency === "") {
      dispatch(
        currencySymbolHandler({
          currencyConversionId: campaignDetails?.currencyConversionId,
        }),
      );
    }

    // Check if we should show the recurring modal based on A/B testing
    if (shouldShowRecurringModal(selectedBoxData)) {
      setOpen(true);
    } else {
      sendDonateDataToRedux(campaignDetails?.isOneTimeDonation);
    }
  };

  useEffect(() => {
    if (!reduxLoading) {
      if (shouldShowRecurringModal(selectedBoxData)) {
        setOpen(true);
      }
    }
  }, [reduxLoading]);

  const next = (donateValue) => {
    if (!donateValue) {
      if (selectedBoxData) {
        if (selectedBoxData?.donationType === "recurringDonation") {
          dispatch(isRecurringHandler(true));
        } else {
          dispatch(isRecurringHandler(false));
        }
      }
    }

    setActiveStep((prevActiveStep) => {
      setCurrentIndex(prevActiveStep);
      return prevActiveStep + 1;
    });
  };

  const isDisable =
    selectedBox === null &&
    (donationAmount === "" ||
      donationAmount === undefined ||
      donationAmount === "0" ||
      (isCustomDonationAllow.isCustomDonation &&
        donationAmount < isCustomDonationAllow.minimumCustomDonation));

  const radioButtonHandler = (value) => {
    setDonationOption(value);
    dispatch(selectedBoxDataHandler(null));
    if (value === "recurringDonation") {
      setRecurringDonation(true);
      setIsOneTimeDonationForLabel(true);
      dispatch(isRecurringHandler(true));
    } else {
      setRecurringDonation(false);
      setIsOneTimeDonationForLabel(false);
      dispatch(isRecurringHandler(false));
    }
    dispatch(updateCustomDonation(value));
    setIsCustomFieldHighlighted(true);
    setSelectedBox(null);
  };

  useEffect(() => {
    if (initialDonationOption === "recurringDonation") {
      setRecurringDonation(true);
      dispatch(isRecurringHandler(true));
    } else {
      setRecurringDonation(false);
      dispatch(isRecurringHandler(false));
    }
    dispatch(updateCustomDonation(initialDonationOption));
  }, [initialDonationOption, dispatch, campaignDetails]);

  useEffect(() => {
    const eventId = generateRandomToken("a", 5) + dayjs().unix();
    if (window.fbq && campaignDetails) {
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

      window.fbq("track", "AddToCart", fbqData, {
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

  // Add a new useEffect to handle automatic progression when levelIndex is provided
  useEffect(() => {
    const noBack = query.noBack;

    if (
      levelIndex !== null &&
      levelIndex !== undefined &&
      noBack === "true" &&
      campaignDetails &&
      !isLoading &&
      !autoProgressTriggered &&
      currencyConversion // Make sure currency conversion is available
    ) {
      // Set the flag to prevent multiple triggers immediately
      setAutoProgressTriggered(true);

      // Setup basic campaign data for donation
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

      // Find the correct giving level at the array index position
      const parsedLevelIndex = parseInt(levelIndex, 10);
      if (
        campaignDetails.givingLevels &&
        parsedLevelIndex < campaignDetails.givingLevels.length
      ) {
        const selectedLevel = campaignDetails.givingLevels[parsedLevelIndex];

        if (selectedLevel) {
          // This is the array index, not any internal index property
          setSelectedBox(parsedLevelIndex);

          // Update selected level in Redux with the array index as the index property
          dispatch(
            selectedBoxDataHandler({
              ...selectedLevel,
              index: parsedLevelIndex,
            }),
          );

          // Handle donation type setting
          const donationType =
            selectedLevel.donationType === "recurringDonation";
          dispatch(isRecurringHandler(donationType));

          // Create donation payload
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

          // Check if recurring modal should be shown
          if (shouldShowRecurringModal(selectedLevel)) {
            setOpen(true);
          } else {
            // Progress to next step only after all state updates and API calls are complete
            if (query.noBack) {
              const newQuery = {};
              Object.keys(query).forEach((key) => {
                if (key !== "noBack") {
                  newQuery[key] = query[key];
                }
              });
              updateUrlWithoutRefresh(newQuery);
            }

            setActiveStep((prevActiveStep) => {
              setCurrentIndex(prevActiveStep);
              return prevActiveStep + 1;
            });
          }
        }
      } else {
        console.warn(
          `Level index ${parsedLevelIndex} is out of bounds. Available levels: ${
            campaignDetails.givingLevels?.length || 0
          }`,
        );
      }
    }
  }, [
    levelIndex,
    query.noBack,
    campaignDetails,
    isLoading,
    autoProgressTriggered,
    currencyConversion,
  ]);

  // Also update the useEffect that sets selectedBox based on levelIndex
  useEffect(() => {
    if (
      levelIndex !== null &&
      levelIndex !== undefined &&
      campaignDetails?.givingLevels &&
      !selectedBoxData &&
      customDonation?.title !== "Custom Donation"
    ) {
      const parsedLevelIndex = parseInt(levelIndex, 10);

      // Only set the box if the level exists at that array index
      if (parsedLevelIndex < campaignDetails.givingLevels.length) {
        setSelectedBox(parsedLevelIndex);
        const selectedLevel = campaignDetails.givingLevels[parsedLevelIndex];
        if (selectedLevel) {
          setLevelAmount(selectedLevel.amount);
          // Make sure to set the index property to the array index
          dispatch(
            selectedBoxDataHandler({
              ...selectedLevel,
              index: parsedLevelIndex,
            }),
          );
        }
      }
    }
  }, [levelIndex, campaignDetails?.givingLevels, currencyConversion]);

  // Also add a handler for modal close that keeps noBack parameter
  const handleModalClose = () => {
    // Don't remove noBack when modal is closed without selection
    setOpen(false);
  };

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
        {/* <link
          rel="icon"
          href="https://madinah.s3.us-east-2.amazonaws.com/favicon.ico"
        /> */}
      </Head>
      <DonationTemplate
        heading="Select a giving level"
        onClickHandler={nextButtonHandler}
        isContinueButtonDisabled={isDisable}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        setCurrentIndex={setCurrentIndex}
        isGivingLevel={true}
      >
        <StackComponent
          direction={"row"}
          justifyContent={{ xs: "flex-start", sm: "flex-end" }}
          sx={{ marginTop: { xs: "-15px", sm: "-75px" }, marginBottom: "15px" }}
        >
          <BoxComponent sx={{ width: "100px" }}>
            <DropDown
              disableClearable={true}
              isLabel={false}
              placeholder={currencyConversion?.units}
              data={activeCurrencies}
              onChange={handleDropDownChange}
              selectedValue={selectedCountry}
              isHeightCustomizable={true}
              textColor="#A1A1A8"
            />
          </BoxComponent>
        </StackComponent>

        {isLoading ? (
          <GivingLevelSkeleton />
        ) : (
          <div>
            <GridComp container spacing={2}>
              {isCustomDonationAllow.isCustomDonation ? (
                <GridComp item xs={12} sm={6}>
                  <BoxComponent>
                    <CustomInputField
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
                    />
                    {monthlyDonation && isOneTimeDonations ? (
                      <BoxComponent
                        sx={{
                          mt: 2,
                          mb: 2,
                          display: "flex",
                          marginTop: {
                            xs: "-40px",
                            sm: "-40px",
                          },
                          marginLeft: "25px",
                          flexDirection: { xs: "row", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: { xs: 0, sm: 2 },
                        }}
                      >
                        {DONATION_METHOD_OPTION.map((item) => (
                          <RadioButtonGroups
                            key={item.id}
                            label=""
                            options={item}
                            value={donationOption}
                            onChange={radioButtonHandler}
                          />
                        ))}
                      </BoxComponent>
                    ) : null}
                    {donationAmount !== "" &&
                      donationAmount <
                        isCustomDonationAllow.minimumCustomDonation && (
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
                          {isCustomDonationAllow.minimumCustomDonation}
                        </TypographyComp>
                      )}
                  </BoxComponent>
                </GridComp>
              ) : null}
              {givingLevelsValues?.length !== 0 &&
                givingLevelsValues?.map((item, index) => (
                  <GridComp item xs={12} sm={6} key={index}>
                    <SelectAbleLevel
                      isActive={selectedBox === index}
                      onClick={() => handleBoxClick(item, index)}
                      heading={item.title}
                      title={item.description}
                      amount={item.amount}
                      currencySymbol={currencyConversion?.symbol}
                      currencyUnit={currencyConversion?.units}
                      donationType={item?.donationType}
                    />
                  </GridComp>
                ))}
            </GridComp>

            {/* <GridComp container spacing={2}>
              {givingLevelsValues?.length !== 0 &&
                givingLevelsValues?.map((item, index) => (
                  <GridComp item xs={12} sm={6} key={index}>
                    <SelectAbleLevel
                      isActive={selectedBox === index}
                      onClick={() => handleBoxClick(item, index)}
                      heading={item.title}
                      title={item.description}
                      amount={item.amount}
                      currencySymbol={currencyConversion?.symbol}
                      currencyUnit={currencyConversion?.units}
                      donationType={item?.donationType}
                    />
                  </GridComp>
                ))}
            </GridComp> */}

            {/* {!isSmallScreen && isCustomDonationAllow.isCustomDonation && (
              <GridComp container spacing={2}>
                <GridComp item xs={12} sm={6} sx={{ mt: 2 }}>
                  <BoxComponent>
                    <CustomInputField
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
                    />
                    {monthlyDonation && isOneTimeDonations ? (
                      <BoxComponent
                        sx={{
                          mt: 2,
                          mb: 2,
                          display: "flex",
                          marginTop: {
                            xs: "-40px",
                            sm: "-40px",
                          },
                          marginLeft: "25px",
                          flexDirection: { xs: "row", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: { xs: 0, sm: 2 },
                        }}
                      >
                        {DONATION_METHOD_OPTION.map((item) => (
                          <RadioButtonGroups
                            key={item.id}
                            label=""
                            options={item}
                            value={donationOption}
                            onChange={radioButtonHandler}
                          />
                        ))}
                      </BoxComponent>
                    ) : null}
                    {donationAmount !== "" &&
                      donationAmount <
                        isCustomDonationAllow.minimumCustomDonation && (
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
                          {isCustomDonationAllow.minimumCustomDonation}
                        </TypographyComp>
                      )}
                  </BoxComponent>
                </GridComp>
              ) : null}
              {givingLevelsValues?.length !== 0 &&
                givingLevelsValues?.map((item, index) => (
                  <GridComp item xs={12} sm={6} key={index}>
                    <SelectAbleLevel
                      isActive={selectedBox === index}
                      onClick={() => handleBoxClick(item, index)}
                      heading={item.title}
                      title={item.description}
                      amount={item.amount}
                      currencySymbol={currencyConversion?.symbol}
                      currencyUnit={currencyConversion?.units}
                      donationType={item?.donationType}
                    />
                  </GridComp>
                ))}
            </GridComp>

            {/* <GridComp container spacing={2}>
              {givingLevelsValues?.length !== 0 &&
                givingLevelsValues?.map((item, index) => (
                  <GridComp item xs={12} sm={6} key={index}>
                    <SelectAbleLevel
                      isActive={selectedBox === index}
                      onClick={() => handleBoxClick(item, index)}
                      heading={item.title}
                      title={item.description}
                      amount={item.amount}
                      currencySymbol={currencyConversion?.symbol}
                      currencyUnit={currencyConversion?.units}
                      donationType={item?.donationType}
                    />
                  </GridComp>
                ))}
            </GridComp> */}

            {/* {!isSmallScreen && isCustomDonationAllow.isCustomDonation && (
              <GridComp container spacing={2}>
                <GridComp item xs={12} sm={6} sx={{ mt: 2 }}>
                  <BoxComponent>
                    <CustomInputField
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
                    />
                    {monthlyDonation && isOneTimeDonations ? (
                      <BoxComponent
                        sx={{
                          mt: 2,
                          mb: 2,
                          display: "flex",
                          marginTop: {
                            xs: "-40px",
                            sm: "-40px",
                          },
                          marginLeft: "25px",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: { xs: 0, sm: 2 },
                        }}
                      >
                        {DONATION_METHOD_OPTION.map((item) => (
                          <RadioButtonGroups
                            key={item.id}
                            label=""
                            options={item}
                            value={donationOption}
                            onChange={radioButtonHandler}
                          />
                        ))}
                      </BoxComponent>
                    ) : null}
                    {donationAmount !== "" &&
                      donationAmount <
                      isCustomDonationAllow.minimumCustomDonation && (
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
                          {isCustomDonationAllow.minimumCustomDonation}
                        </TypographyComp>
                      )}
                  </BoxComponent>
                </GridComp>
              </GridComp>
            )} */}
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

GivingLevels.propTypes = {
  campaignDetails: PropTypes.object,
  setActiveStep: PropTypes.func,
  setCurrentIndex: PropTypes.func,
  setSelectedBoxData: PropTypes.func,
  selectedBoxData: PropTypes.any,
  randomToken: PropTypes.any,
  activeStep: PropTypes.number,
  levelIndex: PropTypes.any,
};
export default GivingLevels;
