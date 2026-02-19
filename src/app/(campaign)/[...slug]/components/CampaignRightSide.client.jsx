"use client";

/**
 * CampaignRightSide - Client Component for dynamic campaign content
 * This component renders the right side of the campaign page with
 * interactive elements like donation progress, giving levels, etc.
 */

import {
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

import { formatNumber } from "@/utils/formatNumber";
import { createSearchParams, getUTMParams } from "@/utils/helpers";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { handlePosthog } from "@/api/post-api-services";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// Removed useResponsiveScreen - using CSS-based responsive design to reduce TBT
import { loadPaymentScripts } from "@/utils/loadPaymentScripts";

import {
  donatePressHandler,
  donateCurrencyHandler,
  currencySymbolHandler,
  desktopLevelIndexHandler,
  recurringTypeHandler,
  resetDonationState,
} from "@/store/slices/donationSlice";

import ShareAbleIcon from "@/assets/iconComponent/ShareAbleIcon";

// Lazy load heavy components
const NewPayment = lazy(
  () => import("@/components/UI/DonationOnCampaign/NewPayment"),
);
const NewDonationProgressBar = lazy(
  () =>
    import("@/components/advance/DonationProgressBar/NewDonationProgressBar"),
);
const DropDown = lazy(() => import("@/components/atoms/inputFields/DropDown"));
const SingleSimilarCampaign = lazy(
  () =>
    import("@/components/templates/ViewCampaignTemplate/SingleSimilarCampaign"),
);
const ModalComponent = lazy(
  () => import("@/components/molecules/modal/ModalComponent"),
);
const SocialShare = lazy(
  () => import("@/components/molecules/socialShare/SocialShare"),
);
const CampaignBenefits = lazy(
  () => import("@/components/advance/CampaignBenefits"),
);

import { ASSET_PATHS } from "@/utils/assets";
const zakatEligible = ASSET_PATHS.svg.zakatEligible;
const taxDonation = ASSET_PATHS.svg.taxDeductible;
const secureDonation = ASSET_PATHS.svg.secureDonation;

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

// Progress Bar Skeleton
const ProgressBarSkeleton = () => (
  <BoxComponent sx={{ width: "100%" }}>
    {/* Progress bar */}
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "8px",
        width: "100%",
        borderRadius: "4px",
        mb: 2,
      }}
    />
    {/* Amount and percentage */}
    <StackComponent
      direction="row"
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "32px",
          width: "120px",
        }}
      />
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "20px",
          width: "60px",
        }}
      />
    </StackComponent>
    {/* Supporters count */}
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "20px",
        width: "140px",
      }}
    />
  </BoxComponent>
);

// Campaign Benefits Skeleton
const BenefitsSkeleton = () => (
  <BoxComponent
    sx={{
      ...skeletonBase,
      height: "60px",
      width: "30%",
      borderRadius: "8px",
    }}
  />
);

// Dropdown Skeleton
const DropdownSkeleton = () => (
  <BoxComponent
    sx={{
      ...skeletonBase,
      height: "36px",
      width: "100%",
      borderRadius: "8px",
    }}
  />
);

// Payment Form Skeleton
const PaymentFormSkeleton = () => (
  <BoxComponent
    sx={{
      background: "white",
      borderRadius: "32px",
      padding: "32px",
    }}
  >
    {/* Title */}
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "32px",
        width: "60%",
        mb: 3,
      }}
    />
    {/* Form fields */}
    {[1, 2, 3, 4].map((i) => (
      <BoxComponent
        key={i}
        sx={{
          ...skeletonBase,
          height: "56px",
          width: "100%",
          mb: 2,
          borderRadius: "8px",
        }}
      />
    ))}
    {/* Submit button */}
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "48px",
        width: "100%",
        borderRadius: "8px",
        mt: 2,
      }}
    />
  </BoxComponent>
);

// Modal Skeleton
const ModalSkeleton = () => (
  <BoxComponent sx={{ p: 3 }}>
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "32px",
        width: "60%",
        mb: 3,
      }}
    />
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "200px",
        width: "100%",
        borderRadius: "8px",
      }}
    />
  </BoxComponent>
);

// Giving Level Card Skeleton
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

const styles = {
  // Desktop-only component (hidden on mobile via parent CSS)
  rightSide: ({ hideOverflow }) => ({
    width: "100%",
    position: "sticky",
    top: "80px",
    maxHeight: "calc(100vh - 80px)",
    overflowY: !hideOverflow ? "visible" : "auto",
    borderRadius: "32px",
    WebkitOverflowScrolling: "touch",
    scrollbarGutter: "stable",
    MsOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }),
};

export default function CampaignRightSide({
  campaignId,
  title,
  currency,
  initialGoal,
  raisedPercentage = 0,
  recentSupportersCount = 0,
  isZakatEligible,
  isTaxDeductable,
  oneTimeDonation,
  recurringDonation,
  gradingLevelsList = [],
  url,
  checkStatus,
  campaignEndDate,
  randomToken,
  meta = [],
  currencyConversionIdCampaign,
  previewMode = false,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // Removed useResponsiveScreen - using CSS sx props for responsive design

  const [showShareModel, setShowShareModel] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentGradingLevels, setCurrentGradingLevels] =
    useState(gradingLevelsList);
  const [currentCurrency, setCurrentCurrency] = useState(currency);
  const containerRef = useRef(null);

  const donatePress = useSelector((state) => state.donation?.donatePress);
  const reduxCurrency = useSelector((state) => state.donation?.currency);
  const selectedCurrency = useSelector(
    (state) => state.donation?.currencySymbol,
  );
  const countriesList = useSelector((state) => state.meta.countries);
  const isAdminLogin = useSelector((state) =>
    state.auth.userDetails?.loginAs === "admin" ? true : false,
  );

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

  const defaultValue = Math.round(initialGoal * raisedPercentage);

  const isCampaignExpired = useCallback(() => {
    if (!campaignEndDate) return false;
    const today = new Date();
    const endDate = new Date(campaignEndDate);
    return endDate < today;
  }, [campaignEndDate]);

  const getButtonText = useCallback(() => {
    if (checkStatus === "in-active") return "Closed";
    if (isCampaignExpired()) return "Closed";
    return "Donate Now";
  }, [checkStatus, isCampaignExpired]);

  const donateHandler = useCallback(() => {
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

    // Load payment scripts dynamically when donate button is clicked
    loadPaymentScripts().catch((error) => {
      console.error("Failed to load payment scripts:", error);
    });

    if (parsedConsent?.analytics) {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Donate Button Clicked",
        properties: {
          $current_url: window.location.href,
          ...utmParams,
        },
      };
      enhancedHandlePosthog(handlePosthog, payload, title || "Campaign Page");
    }

    // Desktop-only component - always open in-page donation form
    dispatch(donatePressHandler(true));

    // Execute donation button scripts from meta
    if (meta && meta.length > 0) {
      meta.forEach((metaItem) => {
        if (metaItem.type === "donationButtonScript") {
          try {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.text = metaItem.value;
            document.head.appendChild(script);
          } catch (error) {
            console.error(
              "Error executing script from donation button:",
              error,
            );
          }
        }
      });
    }
  }, [
    previewMode,
    experimentalFeature,
    dispatch,
    meta,
    parsedConsent,
    title,
  ]);

  const shareButtonHandler = useCallback(() => {
    if (previewMode) {
      toast("Not Functional in Preview Mode", { duration: 1000 });
      return;
    }

    if (parsedConsent?.analytics) {
      const userId = getCookie("distinctId");
      const utmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Share Button Clicked",
        properties: {
          $current_url: window.location.href,
          ...utmParams,
        },
      };
      enhancedHandlePosthog(handlePosthog, payload, title || "Campaign Page");
    }
    setShowShareModel(true);
  }, [previewMode, parsedConsent, title]);

  const givingLevelHandler = useCallback(
    (item, index) => {
      if (item?.recurringType) {
        dispatch(recurringTypeHandler(item.recurringType));
      }
      if (previewMode) {
        toast("Not Functional in Preview Mode", { duration: 1000 });
        return;
      }
      // Desktop-only component - always open in-page donation form
      dispatch(donatePressHandler(true));
      dispatch(desktopLevelIndexHandler(index));
    },
    [dispatch, previewMode],
  );

  const handleDropDownChange = useCallback((newValue) => {
    setSelectedCountry(newValue);
    // Here you can add currency conversion logic
  }, []);

  // Reset donation state when navigating away, but preserve currency
  useEffect(() => {
    return () => {
      // Save currency before reset
      const currentCurrency = reduxCurrency;
      const currentCurrencySymbol = selectedCurrency;

      dispatch(resetDonationState());

      // Restore currency after reset
      if (currentCurrency) {
        dispatch(donateCurrencyHandler(currentCurrency));
      }
      if (currentCurrencySymbol) {
        dispatch(currencySymbolHandler(currentCurrencySymbol));
      }
    };
  }, [dispatch, reduxCurrency, selectedCurrency]);

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
  // Scroll to top when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  // Desktop-only component - visibility controlled by parent CSS (display: none on mobile)
  // No JS check needed here, parent handles responsive visibility

  return (
    <StackComponent ref={containerRef}>
      <StackComponent
        direction="column"
        sx={styles.rightSide({
          hideOverflow: currentGradingLevels && currentGradingLevels.length > 0,
        })}
      >
        {donatePress ? (
          <Suspense fallback={<PaymentFormSkeleton />}>
            <NewPayment />
          </Suspense>
        ) : (
          <WhiteBackgroundSection direction="column">
            {/* Donation Progress Bar */}
            <Suspense fallback={<ProgressBarSkeleton />}>
              <NewDonationProgressBar
                recentSupportersCount={recentSupportersCount}
                isAnimation={false}
                oneTimeDonation={oneTimeDonation}
                recurringDonation={recurringDonation}
                defaultValue={defaultValue}
                maxVal={+initialGoal > 0 ? initialGoal : 1}
                isStatic={false}
                minVal={0}
                currency={previewMode ? "$" : currentCurrency || currency}
                status={checkStatus}
                getValue={() => {}}
              />
            </Suspense>

            {/* Donate & Share Buttons */}
            <StackComponent direction="column" sx={{ width: "100%", mt: 2 }}>
              {!isAdminLogin && (
                <ButtonComp
                  onClick={donateHandler}
                  size="normal"
                  variant="contained"
                  disabled={
                    checkStatus === "in-active" ||
                    checkStatus === "expired" ||
                    checkStatus === "pending-approval"
                  }
                  fullWidth={true}
                >
                  {getButtonText()}
                </ButtonComp>
              )}

              <ButtonComp
                onClick={shareButtonHandler}
                size="normal"
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Share
              </ButtonComp>
            </StackComponent>

            {/* Campaign Benefits */}
            {(isZakatEligible || isTaxDeductable) && (
              <StackComponent
                direction="row"
                sx={{
                  mt: "32px !important",
                  justifyContent: "space-between",
                }}
              >
                {isZakatEligible && (
                  <Suspense fallback={<BenefitsSkeleton />}>
                    <CampaignBenefits
                      title="Zakat Eligible"
                      img={zakatEligible}
                    />
                  </Suspense>
                )}
                {isTaxDeductable && (
                  <Suspense fallback={<BenefitsSkeleton />}>
                    <CampaignBenefits
                      title="Tax Deductible"
                      img={taxDonation}
                    />
                  </Suspense>
                )}
                <Suspense fallback={<BenefitsSkeleton />}>
                  <CampaignBenefits
                    title="Secure Donation"
                    img={secureDonation}
                  />
                </Suspense>
              </StackComponent>
            )}
          </WhiteBackgroundSection>
        )}

        {/* Giving Levels */}
        {!donatePress && currentGradingLevels?.length > 0 && (
          <StackComponent direction="column">
            {!previewMode && (
              <StackComponent
                direction="row"
                justifyContent="flex-end"
                sx={{ marginTop: "17px !important", marginBottom: "15px" }}
              >
                <BoxComponent sx={{ width: "100px" }}>
                  <Suspense fallback={<DropdownSkeleton />}>
                    <DropDown
                      disableClearable={true}
                      isLabel={false}
                      placeholder={currency}
                      data={activeCurrencies}
                      onChange={handleDropDownChange}
                      selectedValue={selectedCountry}
                      isHeightCustomizable={true}
                      textColor="#A1A1A8"
                    />
                  </Suspense>
                </BoxComponent>
              </StackComponent>
            )}

            {currentGradingLevels.map((eachCampaign, index) => {
              const maxClaims = Math.max(
                ...currentGradingLevels.map((c) => c?.usedCount || 0),
              );
              return (
                <Suspense key={index} fallback={<GivingLevelCardSkeleton />}>
                  <SingleSimilarCampaign
                    title={eachCampaign.title}
                    donationAmount={formatNumber(eachCampaign.amount)}
                    claimed={eachCampaign?.usedCount || 0}
                    btnClickEvent={() =>
                      givingLevelHandler(eachCampaign, index)
                    }
                    buttonText={`Donate ${currentCurrency || currency || "$"}${formatNumber(eachCampaign.amount)}`}
                    recurringType={eachCampaign.recurringType}
                    status={checkStatus}
                    donationType={eachCampaign.donationType}
                    description={eachCampaign.description}
                    isMostNeeded={eachCampaign.isMostNeeded}
                    currencySymbol={currentCurrency || currency || "$"}
                    isHighestClaimed={
                      currentGradingLevels.length > 1 &&
                      (eachCampaign?.usedCount || 0) === maxClaims &&
                      maxClaims > 0
                    }
                  />
                </Suspense>
              );
            })}
          </StackComponent>
        )}

        {/* Share Modal */}
        {showShareModel && (
          <Suspense fallback={<ModalSkeleton />}>
            <ModalComponent
              onClose={() => setShowShareModel(false)}
              open={showShareModel}
              width={600}
            >
              <SocialShare
                customUrlData={url}
                customTitle={title}
                setSocialShareModal={setShowShareModel}
              />
            </ModalComponent>
          </Suspense>
        )}
      </StackComponent>
    </StackComponent>
  );
}
