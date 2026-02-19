"use client";

/**
 * MobileGivingLevels - Client Component for mobile giving levels display
 * This component renders the giving levels on mobile view after the story
 */

import {
  useState,
  useCallback,
  useMemo,
  useRef,
  lazy,
  Suspense,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import { formatNumber } from "@/utils/formatNumber";
import { createSearchParams, getUTMParams } from "@/utils/helpers";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { handlePosthog } from "@/api/post-api-services";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";

import {
  donateCurrencyHandler,
  currencySymbolHandler,
  recurringTypeHandler,
} from "@/store/slices/donationSlice";
import { getSingleCampaignData } from "@/api";
import { getSingleCampaignDataGivingLevels } from "@/api/get-api-services";

// Lazy load components
const SingleSimilarCampaign = lazy(
  () =>
    import("@/components/templates/ViewCampaignTemplate/SingleSimilarCampaign"),
);
const DropDown = lazy(() => import("@/components/atoms/inputFields/DropDown"));

// Skeleton animation styles
const skeletonPulse = {
  animation: "pulse 1.5s ease-in-out infinite",
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.4 },
    "100%": { opacity: 1 },
  },
};

const skeletonBase = {
  backgroundColor: "#e0e0e0",
  borderRadius: "4px",
  ...skeletonPulse,
};

// Loading component for small elements
const LoadingSpinner = ({ height = "50px" }) => (
  <BoxComponent
    sx={{ display: "flex", justifyContent: "center", p: 2, height }}
  >
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "100%",
        width: "80%",
        borderRadius: "8px",
      }}
    />
  </BoxComponent>
);

// Giving Level Card Skeleton - matches the actual giving level card structure
const GivingLevelCardSkeleton = () => (
  <BoxComponent
    sx={{
      background: "white",
      borderRadius: "32px",
      padding: "32px",
      marginTop: "8px",
    }}
  >
    {/* Title and Amount row */}
    <StackComponent
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ mb: 1.5 }}
    >
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "22px",
          width: "55%",
        }}
      />
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "22px",
          width: "20%",
        }}
      />
    </StackComponent>

    {/* Description lines */}
    <StackComponent direction="column" spacing={0.75} sx={{ mb: 1.5 }}>
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "16px",
          width: "100%",
        }}
      />
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "16px",
          width: "85%",
        }}
      />
    </StackComponent>

    {/* Claimed count */}
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "14px",
        width: "70px",
        mb: 1.5,
      }}
    />

    {/* Donate button */}
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "34px",
        width: "100%",
        borderRadius: "22px",
      }}
    />
  </BoxComponent>
);

export default function MobileGivingLevels({
  gradingLevelsList = [],
  currency,
  currencyCode,
  currencyConversionIdCampaign,
  checkStatus,
  url,
  randomToken,
  previewMode = false,
  title,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState(currency);
  const [currentCurrencyCode, setCurrentCurrencyCode] = useState(currencyCode);
  const [currentGradingLevels, setCurrentGradingLevels] =
    useState(gradingLevelsList);
  const [isLoading, setIsLoading] = useState(false);

  const reduxCurrency = useSelector((state) => state.donation?.currency);
  const campaignDetails = useSelector((state) => state.donation?.campaignDetails);
  const countriesList = useSelector((state) => state.meta.countries);

  // Sync currency and giving levels from Redux when CampaignDetailsHydrator
  // hydrates country-aware data (static shell has no country code)
  const hasHydratedRef = useRef(false);
  useEffect(() => {
    if (hasHydratedRef.current) return;
    if (campaignDetails?.currencySymbol) {
      hasHydratedRef.current = true;
      setCurrentCurrency(campaignDetails.currencySymbol);
      if (campaignDetails.amountCurrency) {
        setCurrentCurrencyCode(campaignDetails.amountCurrency);
      }
      if (campaignDetails.givingLevels?.length > 0) {
        setCurrentGradingLevels(campaignDetails.givingLevels);
      }
      // Update Redux currencySymbol with country-aware conversion data
      const convertedData = {
        symbol: campaignDetails.currencySymbol,
        units: campaignDetails.amountCurrency,
        currencyConversionId: campaignDetails.currencyConversionId,
        isoAlpha2: campaignDetails.countryId?.isoAlpha2,
        country: campaignDetails.countryId?.name,
        currencyCountry: campaignDetails.currencyCountry,
      };
      dispatch(currencySymbolHandler(convertedData));
    }
  }, [campaignDetails, dispatch]);

  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  const experimentalFeature = getCookie("abtesting");

  const parsedConsent = useMemo(() => {
    if (consentCookie) {
      try {
        return JSON.parse(consentCookie);
      } catch {
        return {};
      }
    }
    return {};
  }, [consentCookie]);

  // Build query object from searchParams
  const query = useMemo(() => {
    const obj = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  // Memoized active currencies
  const activeCurrencies = useMemo(() => {
    if (!countriesList) return [];

    const uniqueCountries = countriesList.reduce(
      (acc, current) => {
        if (!acc.unique[current.currencyUnit]) {
          acc.unique[current.currencyUnit] = true;
          acc.result.push(current);
        }
        return acc;
      },
      { unique: {}, result: [] },
    ).result;

    const transformedCountriesList = uniqueCountries.map((country) => ({
      name: country.currencyUnit,
      unit: country.currencyUnit,
      symbol: country.currency.symbol,
      id: country._id,
      isActive: country.currency.isActive,
    }));

    return transformedCountriesList.filter(
      (currency) => currency.isActive === true,
    );
  }, [countriesList]);

  // Initialize currency
  useEffect(() => {
    if (currencyConversionIdCampaign) {
      dispatch(
        currencySymbolHandler({
          currencyConversionId: currencyConversionIdCampaign,
        }),
      );
    }
    setSelectedCountry(reduxCurrency || null);
  }, [currencyConversionIdCampaign, reduxCurrency, dispatch]);

  // Sync giving levels with Redux currency on mount/remount
  // When navigating back from donation flow, local state resets to server props
  // but Redux still holds the user-selected currency
  const hasSyncedRef = useRef(false);
  useEffect(() => {
    if (hasSyncedRef.current) return;
    if (
      reduxCurrency?.unit &&
      currencyCode &&
      reduxCurrency.unit !== currencyCode &&
      randomToken
    ) {
      hasSyncedRef.current = true;
      setIsLoading(true);
      const cfCountry = typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;
      getSingleCampaignDataGivingLevels(randomToken, reduxCurrency.unit, undefined, undefined, undefined, undefined, undefined, undefined, undefined, null, null, cfCountry)
        .then((res) => {
          const result = res?.data;
          if (result?.success) {
            const data = result.data.campaignDetails;
            setCurrentCurrency(data.currencySymbol);
            setCurrentCurrencyCode(data.amountCurrency);
            setCurrentGradingLevels(data.givingLevels || gradingLevelsList);

            const convertedData = {
              symbol: data.currencySymbol,
              units: data.amountCurrency,
              currencyConversionId: data.currencyConversionId,
              isoAlpha2: data.countryId?.isoAlpha2,
              country: data.countryId?.name,
              currencyCountry: data.currencyCountry,
            };
            dispatch(currencySymbolHandler(convertedData));
          }
        })
        .catch((error) => {
          console.error("Currency sync error on mount:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [reduxCurrency, currencyCode, randomToken, gradingLevelsList, dispatch]);

  const handleDropDownChange = useCallback(
    (newValue) => {
      if (!newValue || !randomToken) return;

      setSelectedCountry(newValue);
      setIsLoading(true);

      // Clear the currency in Redux to trigger refetch
      dispatch(donateCurrencyHandler(""));

      // Fetch campaign data with new currency
      const cfCountry = typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;
      getSingleCampaignDataGivingLevels(randomToken, newValue.unit, undefined, undefined, undefined, undefined, undefined, undefined, undefined, null, null, cfCountry)
        .then((res) => {
          const result = res?.data;
          if (result.success) {
            const data = result.data.campaignDetails;

            // Update Redux with new currency conversion data
            const convertedData = {
              symbol: data.currencySymbol,
              units: data.amountCurrency,
              currencyConversionId: data.currencyConversionId,
              isoAlpha2: data.countryId?.isoAlpha2,
              country: data.countryId?.name,
              currencyCountry: data.currencyCountry,
            };

            dispatch(currencySymbolHandler(convertedData));
            dispatch(donateCurrencyHandler(newValue));

            // Update local state with new currency and giving levels
            setCurrentCurrency(data.currencySymbol);
            setCurrentCurrencyCode(data.amountCurrency);
            setCurrentGradingLevels(data.givingLevels || gradingLevelsList);

            toast.success("Currency updated successfully");
          } else {
            toast.error(result.message || "Failed to convert currency");
            setSelectedCountry(reduxCurrency || null);
          }
        })
        .catch((error) => {
          console.error("Currency conversion error:", error);
          toast.error("Something went wrong with currency conversion");
          setSelectedCountry(reduxCurrency || null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [randomToken, dispatch, reduxCurrency, gradingLevelsList],
  );

  const givingLevelHandler = useCallback(
    (item, index) => {
      if (item?.recurringType) {
        dispatch(recurringTypeHandler(item.recurringType));
      }
      if (previewMode) {
        toast("Not Functional in Preview Mode", { duration: 1000 });
        return;
      }

      // IMPORTANT: Set intentional flag AND clear skip flags BEFORE navigation
      sessionStorage.setItem("__intentionalDonation", "true");
      sessionStorage.removeItem("__skipDonationPage");
      sessionStorage.removeItem("__skipDonationPageTarget");
      window.__blockBackToDonation = false;

      // Verify flag was set
      const checkFlag = sessionStorage.getItem("__intentionalDonation");

      if (parsedConsent?.analytics) {
        const userId = getCookie("distinctId");
        const utmParams = getUTMParams(window.location.href);
        const payload = {
          distinctId: userId,
          event: "Giving Level Clicked on Campaign Page",
          properties: {
            $current_url: window.location.href,
            ...utmParams,
          },
        };
        enhancedHandlePosthog(handlePosthog, payload, title || "Campaign Page");
      }

      // Navigate to donate page on mobile
      const id = randomToken || pathname?.split("/").filter(Boolean).join("/");
      const src = query?.src;

      const params = {
        id: id,
        levelIndex: index,
        ...query,
      };

      if (url && src === "internal_website") {
        params.src = "internal_website";
      }

      // Don't reset currency on mobile - preserve the user's selected currency
      // if (experimentalFeature !== "donation_version_1") {
      //   dispatch(donateCurrencyHandler(null));
      //   dispatch(currencySymbolHandler(null));
      // }

      const route = createSearchParams(params, "/donate-now");
      router.push(route);
    },
    [
      previewMode,
      dispatch,
      router,
      url,
      query,
      randomToken,
      pathname,
      parsedConsent,
      title,
      experimentalFeature,
    ],
  );

  // Only render if there are giving levels (removed isMediumScreen check - use CSS instead)
  if (!currentGradingLevels?.length) {
    return null;
  }

  // Calculate which giving level is highest claimed
  const maxClaims = Math.max(
    ...currentGradingLevels.map((campaign) => campaign?.usedCount || 0),
  );

  const givingLevelsWithMaxClaims = currentGradingLevels.filter(
    (campaign) => (campaign?.usedCount || 0) === maxClaims,
  );

  let highestAmountWithMaxClaims = 0;
  if (givingLevelsWithMaxClaims.length > 1 && maxClaims > 0) {
    highestAmountWithMaxClaims = Math.max(
      ...givingLevelsWithMaxClaims.map((campaign) => campaign.amount || 0),
    );
  }

  return (
    <StackComponent
      direction="column"
      sx={{
        marginTop: "24px",
        // CSS-based responsive visibility (better for TBT than JS-based)
        display: { xs: "flex", md: "none" },
      }}
    >
      {/* Currency Dropdown */}
      {currentGradingLevels?.length > 0 && !previewMode && (
        <StackComponent
          direction="row"
          justifyContent="flex-end"
          sx={{
            marginBottom: "15px",
            marginRight: "10px !important",
          }}
        >
          <BoxComponent sx={{ width: "100px" }}>
            <Suspense fallback={<LoadingSpinner height="36px" />}>
              <DropDown
                disableClearable={true}
                isLabel={false}
                placeholder={currentCurrencyCode || currencyCode || currency}
                data={activeCurrencies}
                onChange={handleDropDownChange}
                selectedValue={selectedCountry}
                isHeightCustomizable={true}
                textColor="#A1A1A8"
                disabled={isLoading}
              />
            </Suspense>
          </BoxComponent>
        </StackComponent>
      )}

      {/* Giving Levels */}
      {currentGradingLevels.map((eachCampaign, index) => (
        <Suspense key={index} fallback={<GivingLevelCardSkeleton />}>
          <SingleSimilarCampaign
            title={eachCampaign.title}
            donationAmount={formatNumber(eachCampaign.amount)}
            claimed={eachCampaign?.usedCount || 0}
            recurringType={eachCampaign.recurringType}
            btnClickEvent={() => givingLevelHandler(eachCampaign, index)}
            buttonText={`Donate ${currentCurrency || currency || "$"}${formatNumber(eachCampaign.amount)}`}
            status={checkStatus}
            donationType={eachCampaign.donationType}
            description={eachCampaign.description}
            isMostNeeded={eachCampaign.isMostNeeded}
            currencySymbol={currentCurrency || currency || "$"}
            isHighestClaimed={
              currentGradingLevels.length > 1 &&
              (eachCampaign?.usedCount || 0) === maxClaims &&
              maxClaims > 0 &&
              (givingLevelsWithMaxClaims.length === 1 ||
                eachCampaign.amount === highestAmountWithMaxClaims)
            }
          />
        </Suspense>
      ))}
    </StackComponent>
  );
}
