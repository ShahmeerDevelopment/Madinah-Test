"use client";

import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import StackComponent from "@/components/atoms/StackComponent";
import Image from "next/image";
import { ASSET_PATHS } from "@/utils/assets";
const heartIcon = ASSET_PATHS.svg.heartIcon;
import DonationTemplate from "@/components/templates/donationTemplate/DonationTemplate";
import { theme } from "@/config/customTheme";
import {
  donationHandler,
  isRecurringHandler,
  isSelectedRecurringPageHandler,
  recurringTypeHandler,
  resetDonationState,
} from "@/store/slices/donationSlice";
import { formatNumberWithCommas, getUTMParams } from "@/utils/helpers";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { getCookie } from "cookies-next";
import { handlePosthog } from "@/api/post-api-services";
import {
  AUTOMATIC_DONATION_DAYS,
  CONSENT_COOKIE_NAME,
} from "@/config/constant";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// import posthog from "posthog-js";

const RecurringDonationPage = ({
  activeStep,
  setActiveStep,
  setCurrentIndex,
}) => {
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const donation = useSelector((state) => state.donation);
  const dispatch = useDispatch();
  const isLevel = useSelector((state) => state?.donation?.isLevel);
  const hasUrlChanged = useRef(false);
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);
  const packageValues = useSelector((state) => state?.donation?.packageValues);
  const recurringPercentage =
    donation?.campaignDetails?.recurringSubscriptionPercentages;
  const levelAmount = donation?.donationValues?.totalAmount;
  const selectedCurrency = useSelector(
    (state) => state.donation?.currencySymbol,
  );
  const campaignDetails = useSelector(
    (state) => state.donation?.campaignDetails,
  );
  const { monthlyDonation } = useSelector((state) => state.donation);
  const recurringType = useSelector((state) => state.donation?.recurringType);

  const getFilteredDonationDays = () => {
    const automaticDonationDays =
      donation?.campaignDetails?.automaticDonationDays;
    const givingLevels = donation?.campaignDetails?.givingLevels;

    // Always show "Monthly" from constants
    const monthlyButton = AUTOMATIC_DONATION_DAYS.find(
      (item) => item.value === "monthly",
    );

    // Add "Give once" option that's always shown
    const oneTimeOption = {
      id: "oneTime",
      value: "oneTime",
      label: "Give once",
    };

    // If no giving levels, only show monthly and give once
    if (!givingLevels || givingLevels.length === 0) {
      return [monthlyButton, oneTimeOption].filter(Boolean);
    }

    // Get unique recurring types from giving levels
    const givingLevelRecurringTypes = new Set();
    givingLevels.forEach((level) => {
      if (level.donationType === "recurringDonation" && level.recurringType) {
        givingLevelRecurringTypes.add(level.recurringType);
      }
    });

    // Check if there are any recurring giving levels
    const hasRecurringGivingLevels = givingLevelRecurringTypes.size > 0;

    // Filter buttons based on giving levels without checking dates
    let availableButtons = [];

    if (!hasRecurringGivingLevels) {
      // If no recurring giving levels, show all available options
      availableButtons = AUTOMATIC_DONATION_DAYS;
    } else {
      // If recurring giving levels exist, filter by them without date checking
      availableButtons = AUTOMATIC_DONATION_DAYS.filter((item) => {
        const hasSupport = givingLevelRecurringTypes.has(item.value);
        return hasSupport;
      });
    }

    // Always add "Give once" option
    const allButtons = [...availableButtons, oneTimeOption];

    const uniqueButtons = allButtons.filter(
      (button, index, array) =>
        array.findIndex((b) => b.value === button.value) === index,
    );

    return uniqueButtons;
  };

  let ThirtyFivePercent =
    recurringPercentage && recurringPercentage.length > 0
      ? (
          (parseFloat(donation?.donationValues?.totalAmount, 10) / 100) *
          recurringPercentage[0]
        ).toFixed(2)
      : 0;

  let TwentyFivePercent =
    recurringPercentage && recurringPercentage.length > 1
      ? (
          (parseFloat(donation?.donationValues?.totalAmount, 10) / 100) *
          recurringPercentage[1]
        ).toFixed(2)
      : 0;

  // const nextButtonHandler = () => {
  //   setActiveStep((prevActiveStep) => {
  //     setCurrentIndex(prevActiveStep);
  //     return prevActiveStep + 1;
  //   });
  // };

  const onClick = (donateValue) => {
    sendDonateDataToRedux(
      donation?.campaignDetails?.isOneTimeDonation,
      donateValue,
    );
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

  const sendDonateDataToRedux = (isOneTimeDonation, donateValue) => {
    const convertedData = {
      symbol: donation?.campaignDetails?.currencySymbol,
      units: donation?.campaignDetails?.amountCurrency,
      currencyConversionId: donation?.campaignDetails?.currencyConversionId,
      isoAlpha2: donation?.campaignDetails?.countryId?.isoAlpha2,
      country: donation?.campaignDetails?.countryId?.name,
      currencyCountry: donation?.campaignDetails?.currencyCountry,
    };
    const donationPayload = {
      title:
        donation?.selectedBoxData !== null
          ? donation?.selectedBoxData.title
          : "Custom Donation",
      description:
        donation?.selectedBoxData !== null
          ? donation?.selectedBoxData.description
          : null,
      totalAmount: +levelAmount,
      recurringDonation: +levelAmount,
      symbol:
        selectedCurrency && selectedCurrency.symbol
          ? selectedCurrency.symbol
          : convertedData?.symbol,
      units:
        selectedCurrency && selectedCurrency.units
          ? selectedCurrency.units
          : convertedData?.units,
      isoAlpha2: convertedData?.isoAlpha2,
      country: convertedData?.country,
      zipCode: convertedData?.zipCode,
      currencyConversionId: convertedData?.currencyConversionId,
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

  const next = () => {
    setActiveStep((prevActiveStep) => {
      setCurrentIndex(prevActiveStep);
      return prevActiveStep + 1;
    });
  };

  const recurringHandler = (identifier, prop) => {
    if (prop === "recurring") {
      dispatch(isRecurringHandler(true));
    } else {
      dispatch(isRecurringHandler(false));
    }
    if (identifier === 0) {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Donate 60% Button Clicked",
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
      const thirtyFivePercentRecurring = isLevel
        ? packageValues[0]
        : ThirtyFivePercent;
      onClick(thirtyFivePercentRecurring);
      dispatch(isSelectedRecurringPageHandler(true));
      dispatch(recurringTypeHandler("monthly"));
    }
    if (identifier === 1) {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Donate 40% Button Clicked",
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
      const twentyFivePercentRecurring = isLevel
        ? packageValues[1]
        : TwentyFivePercent;
      onClick(twentyFivePercentRecurring);
      dispatch(isSelectedRecurringPageHandler(true));
      dispatch(recurringTypeHandler("monthly"));
    }
    if (identifier === 2) {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Keep My One-Time Donation Button Clicked",
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
      onClick(levelAmount);
      dispatch(isSelectedRecurringPageHandler(false));
      dispatch(recurringTypeHandler(""));
    }
  };

  const handleRecurringType = (type) => {
    if (type === "monthly") {
      dispatch(isRecurringHandler(true));
      dispatch(isSelectedRecurringPageHandler(true));
      dispatch(recurringTypeHandler(type));
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Monthly Button Clicked",
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
      onClick(levelAmount);
    } else if (type === "dailyLast10NightsRamadan") {
      dispatch(isRecurringHandler(true));
      dispatch(isSelectedRecurringPageHandler(true));
      dispatch(recurringTypeHandler(type));
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Last 10 Nights of Ramadan Button Clicked",
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
      onClick(levelAmount);
    } else if (type === "daily30DaysRamadan") {
      dispatch(isRecurringHandler(true));
      dispatch(isSelectedRecurringPageHandler(true));
      dispatch(recurringTypeHandler(type));
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "30 Days of Ramadan Button Clicked",
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
      onClick(levelAmount);
    } else if (type === "dailyFirst10DaysDhulHijjah") {
      dispatch(isRecurringHandler(true));
      dispatch(isSelectedRecurringPageHandler(true));
      dispatch(recurringTypeHandler(type));
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "First 10 Days of Dhul Hijjah Button Clicked",
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
      onClick(levelAmount);
    } else if (type === "everyFriday") {
      dispatch(isRecurringHandler(true));
      dispatch(isSelectedRecurringPageHandler(true));
      dispatch(recurringTypeHandler(type));
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Every Friday Button Clicked",
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
      onClick(levelAmount);
    } else if (type === "oneTime") {
      dispatch(isRecurringHandler(true));
      dispatch(isSelectedRecurringPageHandler(true));
      dispatch(recurringTypeHandler(type));
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Give Once Button Clicked",
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
      onClick(levelAmount);
    }
  };

  return (
    <DonationTemplate
      setActiveStep={setActiveStep}
      activeStep={activeStep}
      setCurrentIndex={setCurrentIndex}
      heading={
        donation.isRecurring
          ? "Select Recurring Donation"
          : "Become a monthly supporter"
      }
      // onClickHandler={nextButtonHandler}
      isSubmitButton={false}
      newDonation
      //   isContinueButtonDisabled={selectedBox === null}
    >
      {donation.isRecurring && donation.donationType === "monthly" ? (
        <StackComponent
          direction={{ xs: "column", sm: "column" }}
          mt={4}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <BoxComponent>
            <TypographyComp sx={{ fontSize: "20px", fontWeight: 500 }}>
              Donate{" "}
              {donation?.currencySymbol?.symbol
                ? donation?.currencySymbol?.symbol
                : donation?.donationValues?.symbol}
              {formatNumberWithCommas(
                parseFloat(donation.donationValues.totalAmount, 10)?.toFixed(2),
              )}
            </TypographyComp>
          </BoxComponent>
          {getFilteredDonationDays()?.map((item) => {
            return (
              <ButtonComp
                key={item.id}
                onClick={() => handleRecurringType(item.value)}
                variant="outlined"
                sx={{
                  width: { xs: "100%", sm: "100%" },
                  padding: "10px 16px 8px 16px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "black",
                  borderColor:
                    recurringType === item.value ? "#6363e6" : undefined,
                  backgroundColor:
                    recurringType === item.value ? "#f9f9fe" : undefined,
                }}
              >
                <TypographyComp
                  sx={{
                    display: "contents",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </TypographyComp>
              </ButtonComp>
            );
          })}
        </StackComponent>
      ) : (
        <>
          {" "}
          <SubHeading1
            sx={{
              color: theme.palette.primary.gray,
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Will you consider becoming one of our valued monthly supporters by
            converting your{" "}
            <span style={{ color: "black", fontWeight: 500 }}>
              {donation?.currencySymbol?.symbol
                ? donation?.currencySymbol?.symbol
                : donation?.donationValues?.symbol}
              {formatNumberWithCommas(
                parseFloat(donation.donationValues.totalAmount, 10)?.toFixed(2),
              )}{" "}
              {donation?.donationValues?.unit
                ? donation?.donationValues?.unit
                : donation?.donationValues?.units}
            </span>{" "}
            contribution into a monthly donation?
            <br /> <br /> Ongoing monthly donations allow us to better focus on
            our mission.
          </SubHeading1>
          <StackComponent
            direction={{ xs: "column", sm: "column" }}
            mt={4}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <ButtonComp
              onClick={() => recurringHandler(0, "recurring")}
              color={"success"}
              sx={{
                background: "#0CAB72",
                width: { xs: "100%", sm: "100%" },
                padding: "10px 16px 8px 16px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Image
                src={heartIcon}
                alt="heart icon"
                width={20}
                height={20}
                style={{
                  filter: "brightness(0) invert(1)",
                  marginBottom: "3px",
                }}
              />
              Donate{" "}
              {donation?.currencySymbol?.symbol
                ? donation?.currencySymbol?.symbol
                : donation?.donationValues?.symbol}
              {donation.selectedBoxData
                ? formatNumberWithCommas(
                    donation.selectedBoxData.recurringPackageValues[0].toFixed(
                      2,
                    ),
                  )
                : formatNumberWithCommas(ThirtyFivePercent)}
              /month
            </ButtonComp>
            <ButtonComp
              // onClick={() => nextButtonHandler()}
              onClick={() => recurringHandler(1, "recurring")}
              sx={{
                width: { xs: "100%", sm: "100%" },
                padding: "10px 16px 8px 16px",
                borderRadius: "10px",
              }}
            >
              Donate{" "}
              {donation?.currencySymbol?.symbol
                ? donation?.currencySymbol?.symbol
                : donation?.donationValues?.symbol}
              {donation.selectedBoxData
                ? formatNumberWithCommas(
                    donation.selectedBoxData.recurringPackageValues[1].toFixed(
                      2,
                    ),
                  )
                : formatNumberWithCommas(TwentyFivePercent)}
              /month
            </ButtonComp>
            <ButtonComp
              variant={"outlined"}
              sx={{
                width: { xs: "100%", sm: "100%" },
                padding: "10px 16px 8px 16px",
                color: "black",
                borderRadius: "10px",
              }}
              // onClick={() => nextButtonHandler()}

              onClick={() => recurringHandler(2, "oneTimePayment")}
            >
              Keep my one-time{" "}
              {donation?.currencySymbol?.symbol
                ? donation?.currencySymbol?.symbol
                : donation?.donationValues?.symbol}
              {formatNumberWithCommas(
                parseFloat(donation.donationValues.totalAmount, 10)?.toFixed(2),
              )}{" "}
              gift
            </ButtonComp>
          </StackComponent>
        </>
      )}
    </DonationTemplate>
  );
};

export default RecurringDonationPage;
