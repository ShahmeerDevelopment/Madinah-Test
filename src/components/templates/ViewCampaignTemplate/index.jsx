/* eslint-disable no-unused-vars */
"use client";

import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { theme } from "../../../config/customTheme";
import { ASSET_PATHS } from "@/utils/assets";
const flagIcon = "/assets/svg/common/Flag.svg";
import VerifiedIcon from "../../../assets/svg/VerifiedIcon";
const taxDonation = ASSET_PATHS.svg.taxDeductible;
const zakatEligible = ASSET_PATHS.svg.zakatEligible;
const secureDonation = ASSET_PATHS.svg.secureDonation;
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { formatNumber } from "../../../utils/formatNumber";
import VideoPlayerComponent from "@/components/atoms/VideoPlayerComponent";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import StackComponent from "@/components/atoms/StackComponent";
import { styles } from "./ViewCampaignTemplate.style";
import NoCampaignSelected from "./NoCampaignSelected";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import Separator from "./Separator";
const testimonial_1 = ASSET_PATHS.testimonials.avatarPlaceholder;
import ShareAbleIcon from "@/assets/iconComponent/ShareAbleIcon";
import NextImage from "next/image";
import SafeImage from "@/components/atoms/SafeImage";

// Lazy load heavy components for better performance
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";

// Lazy load ALL non-critical components
const ModalComponent = lazy(
  () => import("@/components/molecules/modal/ModalComponent"),
);
const SocialShare = lazy(
  () => import("@/components/molecules/socialShare/SocialShare"),
);
const EmailButton = lazy(() => import("@/components/advance/EmailButton"));
const SingleSimilarCampaign = lazy(() => import("./SingleSimilarCampaign"));
const LoadingBtn = lazy(() => import("@/components/advance/LoadingBtn"));
const NewPayment = lazy(
  () => import("@/components/UI/DonationOnCampaign/NewPayment"),
);
const DropDown = lazy(() => import("@/components/atoms/inputFields/DropDown"));
const DisplayEditorData = lazy(
  () => import("@/components/atoms/displayEditorData/DisplayEditorData"),
);
const CampaignBenefits = lazy(
  () => import("@/components/advance/CampaignBenefits"),
);
const NewDonationProgressBar = lazy(
  () =>
    import("@/components/advance/DonationProgressBar/NewDonationProgressBar"),
);

// Custom hooks
import { useCampaignData } from "./hooks/useCampaignData";
import { useSupportersData } from "./hooks/useSupportersData";
import { useAnnouncementsData } from "./hooks/useAnnouncementsData";

// Utils and API
import {
  createSearchParams,
  formatTimestamp,
  getUTMParams,
  scrollToTop,
} from "@/utils/helpers";
import { loadPaymentScripts } from "@/utils/loadPaymentScripts";
import {
  DEFAULT_IMG,
  PLACEHOLDER_IMAGE,
  SIMILAR_CAMPAIGNS,
} from "./defaultProps";
import { getVisits } from "@/api/get-api-services";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import {
  currencySymbolHandler,
  desktopLevelIndexHandler,
  donateCurrencyHandler,
  donatePressHandler,
  donationBackHandler,
  recurringTypeHandler,
  // donationHandler,
  // isRecurringHandler,
  // monthlyDonationHandler,
  // oneTimeDonationHandler,
  // recurringTypeHandler,
  resetDonationState,
} from "@/store/slices/donationSlice";
import { handlePosthog } from "@/api/post-api-services";
// import posthog from "posthog-js";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// import posthog from "posthog-js";
// import posthog from "posthog-js";

// Loading components for Suspense fallbacks
const LoadingSpinner = ({ height = "50px" }) => (
  <BoxComponent
    sx={{ display: "flex", justifyContent: "center", p: 2, height }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>Loading...</div>
  </BoxComponent>
);

const ButtonLoading = () => (
  <BoxComponent
    sx={{
      height: "36px",
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    Loading...
  </BoxComponent>
);

// Memoized components for better performance
const CampaignHeader = ({ previewMode, title, subTitle, altSubTitle }) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <StackComponent
        justifyContent="space-between"
        alignItems="center"
        sx={styles.initialBtns}
      >
        {previewMode ? (
          <ButtonComp
            onClick={handleBack}
            fullWidth={false}
            size="normal"
            variant="outlined"
            sx={{
              padding: "12px 32px 12px 18px",
              width: "107",
              border: `1px solid ${theme.palette.primary.lightGray}`,
              color: theme.palette.primary.gray,
            }}
            startIcon={
              <KeyboardArrowLeftIcon
                sx={{ mr: -0.7, mt: -0.3 }}
                fontSize="medium"
              />
            }
          >
            Back
          </ButtonComp>
        ) : null}
        <TypographyComp sx={styles.previewModeText}>
          {previewMode ? "Preview Mode" : null}
        </TypographyComp>
      </StackComponent>

      <StackComponent direction="column">
        <TypographyComp
          align="center"
          component="h1"
          style={{ lineHeight: 1 }}
          sx={styles.heading}
        >
          {title}
        </TypographyComp>
      </StackComponent>

      {subTitle || altSubTitle ? (
        <TypographyComp
          align="center"
          component="h4"
          sx={{
            marginTop: "4px !important",
            color: "rgba(161, 161, 168, 1)",
            fontWeight: 400,
            fontSize: "18px",
            lineHeight: "22px",
            marginBottom: "16px !important",
          }}
        >
          {subTitle}
        </TypographyComp>
      ) : null}
    </>
  );
};

const CampaignMedia = ({ thumbnailImage }) => {
  const { isSmallScreen } = useResponsiveScreen();
  const [imgSrc, setImgSrc] = useState(thumbnailImage);
  const [hasError, setHasError] = useState(false);

  // Reset error state when thumbnailImage changes
  useEffect(() => {
    setImgSrc(thumbnailImage);
    setHasError(false);
  }, [thumbnailImage]);

  if (!thumbnailImage) return null;

  const videoRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(c\/)?[a-zA-Z0-9_-]+|youtu\.be\/[a-zA-Z0-9_-]+|vimeo\.com\/\d+)/;
  const isVimeo = /^https?:\/\/(www\.)?vimeo\.com\/\d+/.test(thumbnailImage);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  };

  return (
    <BoxComponent sx={styles.coverImg}>
      {thumbnailImage?.match(videoRegex) ? (
        <Suspense fallback={<LoadingSpinner height="380px" />}>
          <VideoPlayerComponent
            url={thumbnailImage}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
            }}
            width="100%"
            height={isSmallScreen ? "200px" : isVimeo ? "380px" : "380px"}
          />
        </Suspense>
      ) : (
        <NextImage
          src={imgSrc}
          alt="campaign-cover-photo"
          width={750}
          height={450}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "450px",
            borderRadius: "12px",
            objectFit: "cover",
          }}
          onError={handleImageError}
          priority={true}
        />
      )}
    </BoxComponent>
  );
};

// Main donation progress bar component
const DonationProgressBarHandle = (props) => {
  const {
    previewMode,
    updateDonationValue,
    currency,
    target,
    url,
    isZakatEligible,
    isTaxDeductable,
    raisedPercentage = 0.29,
    recentSupportersCount = 0,
    recurringDonation = false,
    title,
    oneTimeDonation,
    meta,
    checkStatus,
    campaignEndDate,
    randomToken, // Pass from parent
  } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasUrlChanged = useRef(false);
  const dispatch = useDispatch();
  const defaultValue = Math.round(target * raisedPercentage);
  const donatePress = useSelector((state) => state.donation?.donatePress);
  const minVal = 0;
  const { isSmallScreen } = useResponsiveScreen();
  const [showShareModel, setShowShareModel] = useState(false);
  const isAdminLogin = useSelector((state) =>
    state.auth.userDetails?.loginAs === "admin" ? true : false,
  );
  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  let parsedConsent = {};
  if (consentCookie) {
    parsedConsent = JSON.parse(consentCookie);
  }
  const experimentalFeature = getCookie("abtesting");

  // Build query object from searchParams for compatibility
  const query = useMemo(() => {
    const obj = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  const donateHandler = useCallback(() => {
    if (previewMode) {
      toast("Not Functional in Preview Mode", {
        duration: 1000,
      });
    } else {
      // Load payment scripts dynamically when donate button is clicked
      loadPaymentScripts().catch((error) => {
        console.error("Failed to load payment scripts:", error);
      });

      if (parsedConsent?.analytics || !consentCookie) {
        const userId = getCookie("distinctId");
        const utmParams = getUTMParams(window.location.href);
        const payload = {
          distinctId: userId,
          event: "Donate Button Clicked",
          properties: {
            $current_url: window.location.href,
            // ...posthog?.persistence?.properties(),
            ...utmParams, // Spread the UTM parameters
          },
        };
        enhancedHandlePosthog(handlePosthog, payload, title || "Campaign Page");
      }
      if (!isSmallScreen) {
        dispatch(donatePressHandler(true));
        // setDonatePress(true);
      } else {
        const id =
          randomToken || pathname?.split("/").filter(Boolean).join("/");
        const src = query?.src;

        // Preserve all existing URL parameters
        const params = {
          id: id,
          ...query, // Spread all existing parameters
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
      }

      //execute the script
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
      // }
    }
  }, [
    previewMode,
    experimentalFeature,
    isSmallScreen,
    dispatch,
    router,
    url,
    meta,
    query,
    randomToken,
    pathname,
  ]);

  const shareButtonHandler = useCallback(() => {
    if (!previewMode) {
      if (parsedConsent?.analytics || !consentCookie) {
        const userId = getCookie("distinctId");
        const utmParams = getUTMParams(window.location.href);
        const payload = {
          distinctId: userId,
          event: "Share Button Clicked",
          properties: {
            $current_url: window.location.href,
            // ...posthog?.persistence?.properties(),
            ...utmParams,
          },
        };
        // const posthogPayload = posthog.capture("TESTEVENT");
        // console.log("posthogPayload", posthogPayload);
        enhancedHandlePosthog(handlePosthog, payload, title || "Campaign Page");
      }
      setShowShareModel(true);
    } else {
      toast("Not Functional in Preview Mode", { duration: 1000 });
    }
  }, [previewMode]);

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

  // Track pathname changes to reset donation state when navigating away
  const currentPathname = pathname;
  const previousPathnameRef = useRef(currentPathname);

  useEffect(() => {
    // If pathname changed and we're not going to donate-now, reset donation state
    if (previousPathnameRef.current !== currentPathname) {
      if (!currentPathname?.includes("/donate-now")) {
        hasUrlChanged.current = true;
        dispatch(resetDonationState());
      }
      previousPathnameRef.current = currentPathname;
    }

    return () => {
      if (hasUrlChanged.current) {
        dispatch(resetDonationState());
      }
    };
  }, [dispatch, currentPathname]);

  return (
    <>
      {donatePress ? (
        <Suspense fallback={<LoadingSpinner />}>
          <NewPayment />
        </Suspense>
      ) : (
        <>
          <NewDonationProgressBar
            recentSupportersCount={recentSupportersCount}
            isAnimation={false}
            oneTimeDonation={oneTimeDonation}
            recurringDonation={recurringDonation}
            defaultValue={defaultValue}
            maxVal={+target > 0 ? target : 1}
            isStatic={false}
            minVal={minVal}
            currency={previewMode ? "$" : currency}
            status={checkStatus}
            getValue={(e) => {
              if (!previewMode) {
                updateDonationValue(e);
              }
            }}
          />

          <StackComponent
            direction={{ xs: "row", sm: "column" }}
            sx={{
              width: "100%",
              background: { xs: "#ffffff", sm: "auto" },
              position: { xs: "fixed", sm: "relative", bottom: 0, left: 0 },
              zIndex: 15,
              border: "1px solid #ffffff",
              p: { xs: "10px", sm: "auto" },
            }}
          >
            {!isAdminLogin ? (
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
            ) : null}

            <ButtonComp
              variant="outlined"
              size="normal"
              sx={{
                width: "77px",
                display: { xs: "block", sm: "none" },
                padding: "12px 19px 6px 19px !important",
              }}
              onClick={shareButtonHandler}
            >
              <ShareAbleIcon />
            </ButtonComp>
            <ButtonComp
              sx={{ display: { xs: "none", sm: "block" } }}
              onClick={shareButtonHandler}
              size="normal"
              variant="outlined"
            >
              Share
            </ButtonComp>
          </StackComponent>

          {isZakatEligible || isTaxDeductable ? (
            <StackComponent
              direction="row"
              sx={{
                mt: { xs: "0px", sm: "32px !important" },
                mb: { xs: "10px !important", sm: "0px !important" },
                justifyContent:
                  !isTaxDeductable && !isZakatEligible
                    ? "center"
                    : "space-between",
              }}
            >
              {isZakatEligible && (
                <CampaignBenefits title="Zakat Eligible" img={zakatEligible} />
              )}
              {isTaxDeductable && (
                <CampaignBenefits title="Tax Deductible" img={taxDonation} />
              )}
              <CampaignBenefits title="Secure Donation" img={secureDonation} />
            </StackComponent>
          ) : null}

          {showShareModel && (
            <Suspense fallback={<LoadingSpinner />}>
              <ModalComponent
                onClose={() => setShowShareModel(false)}
                open={showShareModel}
                width={
                  query.widget === "true" && query.embedded === "true"
                    ? (() => {
                        const { widgetSize } = query;
                        switch (widgetSize) {
                          case "small":
                            return 280;
                          case "large":
                            return 480;
                          default: // medium
                            return 380;
                        }
                      })()
                    : 600
                }
                containerStyleOverrides={
                  query.widget === "true" && query.embedded === "true"
                    ? {
                        maxHeight: (() => {
                          const { widgetSize } = query;
                          switch (widgetSize) {
                            case "small":
                              return "350px";
                            case "large":
                              return "550px";
                            default: // medium
                              return "450px";
                          }
                        })(),
                        overflow: "hidden",
                        overflowY: "auto",
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE
                        "&::-webkit-scrollbar": {
                          display: "none", // Chrome/Safari
                        },
                        "& *": {
                          scrollbarWidth: "none", // Firefox for all children
                          msOverflowStyle: "none", // IE for all children
                        },
                        "& *::-webkit-scrollbar": {
                          display: "none", // Chrome/Safari for all children
                        },
                      }
                    : {}
                }
              >
                <SocialShare
                  customUrlData={url}
                  customTitle={title}
                  setSocialShareModal={setShowShareModel}
                />
              </ModalComponent>
            </Suspense>
          )}
        </>
      )}
    </>
  );
};

export default function ViewCampaignTemplate(props) {
  // Performance optimization: Only destructure what we need
  const {
    previewMode = true,
    subTitle = "",
    altSubTitle = "",
    // altStory = "",
    campaignId = "",
    title = "",
    announcements,
    coverMedia = null,
    coverYoutubeUrl = null,
    organizerPhoto = DEFAULT_IMG,
    whenPublished = "Just Now",
    story = "",
    categoryName = "",
    creator = "SIMILAR_CAMPAIGNS",
    currencyConversionIdCampaign,
    recentSupporters = "RECENT_SUPPORTERS",
    recentSupportersCount = 0,
    countryName,
    isEmailVerified,
    updateDonationValue = () => {},
    gradingLevelsList = SIMILAR_CAMPAIGNS,
    recurringDonation = false,
    allowRecurringDonations = false,
    currency = "",
    initialGoal = 0,
    symbol,
    units,
    isoAlpha2,
    country,
    currencyCountry,
    url = "",
    email = "example@somebody.com",
    isZakatEligible,
    isTaxDeductable,
    meta,
    raisedPercentage,
    oneTimeDonation,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referral,
    randomToken,
    checkStatus,
    campaignEndDate,
    src,
  } = props;

  // Use custom hooks for better performance and separation of concerns

  const campaignData = useCampaignData(randomToken);
  const supportersData = useSupportersData(
    recentSupporters,
    randomToken,
    previewMode,
  );
  const announcementsData = useAnnouncementsData(campaignId, announcements); // Minimal component state
  const [levelIndex, setLevelIndex] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const { isSmallScreen, isMediumScreen } = useResponsiveScreen();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // Build query object from searchParams for compatibility
  const query = useMemo(() => {
    const obj = {};
    searchParams.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  const donatePress = useSelector((state) => state.donation?.donatePress);
  const reduxCurrency = useSelector((state) => state.donation?.currency);
  const countriesList = useSelector((state) => state.meta.countries);

  // Memoized calculations for better performance
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

  const getThumbnailImage = useCallback(() => {
    if (coverYoutubeUrl && !coverMedia) {
      return coverYoutubeUrl;
    }
    return coverMedia;
  }, [coverYoutubeUrl, coverMedia]);

  const thumbnailImage = getThumbnailImage();

  const getGivingLevelsEventName = (item) => {
    switch (item?.recurringType) {
      case "dailyLast10NightsRamadan":
        return "Giving Level Clicked on Campaign Page - Last 10 Nights of Ramadan";
      case "daily30DaysRamadan":
        return "Giving Level Clicked on Campaign Page - 30 Days of Ramadan";
      case "dailyFirst10DaysDhulHijjah":
        return "Giving Level Clicked on Campaign Page - First 10 Days of Dhul Hijjah";
      case "everyFriday":
        return "Giving Level Clicked on Campaign Page - Every Friday";
      case "monthly":
        return "Giving Level Clicked on Campaign Page - Monthly";
      default:
        return "Giving Level Clicked on Campaign Page";
    }
  };

  // const givingLevelHandler = (item, index) => {
  //   if (item?.recurringType) {
  //     dispatch(recurringTypeHandler(item.recurringType));
  //   }
  //   if (previewMode) {
  //     toast("Not Functional in Preview Mode", {
  //       duration: 1000,
  //     });
  //   } else {
  //     if (experimentalFeature === "donation_version_1") {
  //       const userId = getCookie("distinctId");
  //       const payload = {
  //         distinctId: userId,
  //         event: "Giving Level Clicked on Campaign Page",
  //         properties: {
  //           $current_url: window.location.href,
  //         },
  //       };
  //       handlePosthog(payload);
  //       if (!isSmallScreen) {
  //         dispatch(donatePressHandler(true));
  //         dispatch(desktopLevelIndexHandler(index));
  //       }
  //     }
  //   }
  const donationProgressBarHandleProps = useMemo(
    () => ({
      previewMode,
      updateDonationValue,
      target: initialGoal,
      currency,
      url,
      isZakatEligible,
      isTaxDeductable,
      raisedPercentage,
      oneTimeDonation,
      recentSupportersCount,
      gradingLevelsList,
      recurringDonation: previewMode
        ? allowRecurringDonations
        : recurringDonation,
      title,
      meta,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      referral,
      checkStatus,
      campaignEndDate,
      randomToken,
    }),
    [
      previewMode,
      updateDonationValue,
      initialGoal,
      currency,
      url,
      isZakatEligible,
      isTaxDeductable,
      raisedPercentage,
      oneTimeDonation,
      gradingLevelsList,
      recentSupportersCount,
      allowRecurringDonations,
      recurringDonation,
      title,
      meta,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      referral,
      checkStatus,
      campaignEndDate,
      randomToken,
    ],
  );

  // Performance optimization: Initialize visits only when needed
  useEffect(() => {
    const initVisits = async () => {
      if (!previewMode) {
        try {
          dispatch(donationBackHandler(false));
          const experimentKey = localStorage.getItem("experimentKey");
          const variationKey = localStorage.getItem("variationKey");
          const userId = localStorage.getItem("gb_visitor_id");
          const experimentalFeature = getCookie("abtesting");
          const campaignVersion = getCookie("campaign_testing");

          await getVisits(
            randomToken,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
            referral,
            experimentalFeature,
            src,
            campaignVersion,
            experimentKey,
            variationKey,
            userId,
          );
        } catch (error) {
          console.error("Error initializing visits:", error);
        }
      }
    };

    initVisits();
  }, [
    previewMode,
    dispatch,
    randomToken,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referral,
    src,
  ]);

  // Scroll to top optimization
  useEffect(() => {
    if (typeof window !== "undefined") {
      scrollToTop();
    }
  }, []);

  // Handle currency changes
  useEffect(() => {
    if (currencyConversionIdCampaign) {
      dispatch(
        currencySymbolHandler({
          currencyConversionId: currencyConversionIdCampaign,
        }),
      );
    }
    setSelectedCountry(reduxCurrency || null);
    if (!reduxCurrency) {
      dispatch(currencySymbolHandler(null));
    }
  }, [
    currencyConversionIdCampaign,
    reduxCurrency,
    dispatch,
    symbol,
    units,
    isoAlpha2,
    country,
    currencyCountry,
  ]);
  // Handle giving level selection
  const givingLevelHandler = useCallback(
    (item, index) => {
      if (item?.recurringType) {
        dispatch(recurringTypeHandler(item.recurringType));
      }
      if (previewMode) {
        toast("Not Functional in Preview Mode", {
          duration: 1000,
        });
      } else {
        // if (experimentalFeature === "donation_version_1") {
        const userId = getCookie("distinctId");
        const utmParams = getUTMParams(window.location.href);
        const payload = {
          distinctId: userId,
          event: getGivingLevelsEventName(item),
          properties: {
            $current_url: window.location.href,
            // $session_id: posthog.get_session_id(),
            ...utmParams,
          },
        };
        enhancedHandlePosthog(handlePosthog, payload, title || "Campaign Page");

        // handlePosthog(payload);
        if (!isSmallScreen) {
          dispatch(donatePressHandler(true));
          dispatch(desktopLevelIndexHandler(index));
        }

        setLevelIndex(index);

        // Scroll to payment component
        if (isSmallScreen) {
          const id = randomToken;
          const srcParam = query?.src;

          // Preserve all existing URL parameters
          const params = {
            id: id,
            levelIndex: index,
            noBack: true,
            currency: campaignData?.currencyConversionId,
            ...query, // Spread all existing parameters
          };

          if (url && srcParam === "internal_website") {
            params.src = "internal_website";
          }
          const queryParams = createSearchParams(params, "/donate-now");
          router.push(queryParams);
        }
        const paymentComponent = document.getElementById("payment-component");
        if (paymentComponent) {
          const offset = 100;
          const elementPosition = paymentComponent.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
        // } else {
        //   const id = router.query.slug;
        //   const src = router?.query?.src;

        //   // Preserve all existing URL parameters
        //   // eslint-disable-next-line no-unused-vars
        //   const { slug, ...existingParams } = router.query;
        //   const params = {
        //     id: id,
        //     levelIndex: index,
        //     noBack: true,
        //     currency: currencyConversionId,
        //     ...existingParams // Spread all existing parameters
        //   };

        //   if (url && src === "internal_website") {
        //     params.src = "internal_website";
        //   }
        //   const queryParams = createSearchParams(params, "/donate-now");
        //   router.push(queryParams);
        // }
      }
    },
    [
      previewMode,
      isSmallScreen,
      dispatch,
      router,
      url,
      campaignData.currencyConversionId,
      levelIndex,
      randomToken,
      query,
    ],
  );

  const handleDropDownChange = useCallback(
    (value) => {
      setSelectedCountry(value);
      dispatch(donateCurrencyHandler(value));
      campaignData.getCampaignData(true, value.unit);
    },
    [dispatch, campaignData],
  );

  // Utility functions
  const formatName = useCallback((name) => {
    return name
      ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      : "";
  }, []);

  const getFullName = useCallback((firstName, lastName) => {
    const maxLength = 20;
    const ellipsis = "...";

    const formatName = (name) => {
      if (name) {
        return name?.charAt(0)?.toUpperCase() + name?.slice(1)?.toLowerCase();
      }
      return "";
    };

    const formattedFirstName = formatName(firstName);
    const formattedLastName = formatName(lastName);
    const fullName = `${formattedFirstName} ${formattedLastName}`;

    if (fullName.length <= maxLength) {
      return fullName;
    }

    const availableLength = maxLength - ellipsis.length;
    const firstNameLength = Math.min(
      formattedFirstName.length,
      Math.floor(availableLength * 0.6),
    );
    const lastNameLength = availableLength - firstNameLength;

    const truncatedFirstName = formattedFirstName.slice(0, firstNameLength);
    const truncatedLastName = formattedLastName.slice(0, lastNameLength);

    return `${truncatedFirstName}${ellipsis} ${truncatedLastName}`;
  }, []);

  const getTimeAgo = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "just now";
  }, []);

  const truncateHTML = useCallback(
    (html) => {
      const maxChars = isSmallScreen ? 250 : 900;

      const div = document.createElement("div");
      div.innerHTML = html;
      const text = div.textContent || div.innerText || "";

      if (text.length <= maxChars) {
        return html;
      }

      const truncated = text.slice(0, maxChars).trim() + "...";

      if (html.includes("<p>")) {
        return `<p>${truncated}</p>`;
      }
      return truncated;
    },
    [isSmallScreen],
  );

  const getReadMoreText = useCallback(
    (isExpanded, item) => {
      const maxChars = isSmallScreen ? 250 : 900;

      const div = document.createElement("div");
      div.innerHTML = item.body;
      const text = div.textContent || div.innerText || "";

      if (isExpanded) {
        return "Read Less";
      }
      if (text.length <= maxChars) {
        return "";
      }
      return "Read More";
    },
    [isSmallScreen],
  );

  // Early return for empty title
  if (title === "") {
    return (
      <StackComponent
        direction={isMediumScreen ? "column" : "row"}
        spacing="24px"
        justifyContent="center"
        sx={styles.containerStyles({ previewMode, isMediumScreen })}
      >
        <NoCampaignSelected />
      </StackComponent>
    );
  }

  return (
    <StackComponent
      direction={isMediumScreen ? "column" : "row"}
      spacing="24px"
      justifyContent="flex-start"
      sx={styles.containerStyles({ previewMode, isMediumScreen })}
    >
      {/* Left Column */}
      <StackComponent
        direction="column"
        sx={styles.leftSide({ isMediumScreen, isSmallScreen })}
        spacing={2}
      >
        <WhiteBackgroundSection direction="column">
          <CampaignHeader
            previewMode={previewMode}
            title={title}
            subTitle={subTitle}
            altSubTitle={altSubTitle}
          />

          <CampaignMedia thumbnailImage={thumbnailImage} />

          {isMediumScreen ? (
            <Suspense fallback={<LoadingSpinner />}>
              <DonationProgressBarHandle {...donationProgressBarHandleProps} />
            </Suspense>
          ) : null}

          {/* {story || altStory ? ( */}
          <BoxComponent sx={styles.story}>
            <DisplayEditorData isStory content={story} />
          </BoxComponent>
          {/* ) : null} */}

          {/* Report Button */}
          <BoxComponent
            sx={{
              marginLeft: previewMode ? "0px" : "0px !important",
              marginBottom: !previewMode && "15px",
            }}
          >
            {previewMode ? (
              <ButtonComp
                sx={styles.reportBtn}
                variant="text"
                size="normal"
                padding="0px 5px"
                onClick={() => {
                  toast("Not Functional in Preview Mode", { duration: 1000 });
                }}
              >
                <NextImage
                  src={flagIcon}
                  alt="flag icon"
                  width={16}
                  height={16}
                  style={{ marginBottom: "2.5px" }}
                />
                <TypographyComp sx={styles.reportText}>
                  Report fundraiser
                </TypographyComp>
              </ButtonComp>
            ) : (
              <Suspense fallback={<ButtonLoading />}>
                <EmailButton
                  variant="text"
                  email="admin@madinah.com"
                  newTab={false}
                  isReport
                >
                  <NextImage
                    src={flagIcon}
                    alt="flag icon"
                    width={16}
                    height={16}
                  />
                  <TypographyComp
                    sx={{
                      color: "rgba(99, 99, 230, 1)",
                      marginLeft: "20.67px",
                      fontSize: "14px",
                      lineHeight: "16px",
                      fontWeight: 500,
                      marginTop: "-15px",
                    }}
                  >
                    Report fundraiser
                  </TypographyComp>
                </EmailButton>
              </Suspense>
            )}
          </BoxComponent>

          {/* Organizer Section */}
          <TypographyComp sx={styles.organizerHeading}>
            Organizer
          </TypographyComp>

          <StackComponent alignItems="center" spacing="12px">
            <SafeImage
              src={organizerPhoto || DEFAULT_IMG}
              fallbackSrc={PLACEHOLDER_IMAGE}
              alt="organizer photo"
              width={40}
              height={40}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <StackComponent
              sx={styles.organizerInfo}
              direction="column"
              spacing={0}
              justifyContent="space-between"
            >
              <StackComponent spacing={0} alignItems="center">
                <TypographyComp sx={styles.organizerName} component="span">
                  {creator}
                </TypographyComp>
                {isEmailVerified ? <VerifiedIcon /> : null}
              </StackComponent>
              <TypographyComp component="span" sx={styles.organizerCountry}>
                {countryName}
              </TypographyComp>
            </StackComponent>
            {previewMode ? (
              <ButtonComp
                variant="outlined"
                size="normal"
                height="34px"
                fontWeight={500}
                sx={{ width: "82px" }}
                onClick={() =>
                  toast("Not Functional in Preview Mode", { duration: 1000 })
                }
              >
                Contact
              </ButtonComp>
            ) : (
              <Suspense fallback={<ButtonLoading />}>
                <EmailButton variant="outlined" email={email} newTab={false}>
                  Contact
                </EmailButton>
              </Suspense>
            )}
          </StackComponent>

          <StackComponent
            sx={styles.organizerSubTextContainer}
            alignItems="center"
          >
            <TypographyComp sx={styles.organizerSubtext}>
              {whenPublished}
            </TypographyComp>
            <Separator />
            <TypographyComp sx={styles.organizerSubtext}>
              {categoryName}
            </TypographyComp>
          </StackComponent>
        </WhiteBackgroundSection>

        {/* Announcements Section */}
        {announcementsData.newAnnouncements &&
          announcementsData.newAnnouncements.length > 0 && (
            <BoxComponent>
              <WhiteBackgroundSection direction="column">
                <TypographyComp sx={{ ...styles.heading }}>
                  Updates{" "}
                  <Badge
                    sx={{ marginLeft: "10px" }}
                    color="primary"
                    badgeContent={announcementsData.totalAnnouncements}
                  />
                </TypographyComp>
                {announcementsData.newAnnouncements.map((item, index) => {
                  const isExpanded =
                    announcementsData.expandedAnnouncements[index];
                  const truncatedBody = truncateHTML(item.body);
                  return (
                    <BoxComponent
                      key={index}
                      sx={{ marginBottom: "20px !important" }}
                    >
                      <StackComponent
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <SafeImage
                          src={organizerPhoto || DEFAULT_IMG}
                          fallbackSrc={DEFAULT_IMG}
                          alt="organizer photo"
                          width={24}
                          height={24}
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <TypographyComp
                          sx={{
                            fontWeight: 500,
                            fontSize: "14px",
                            color: theme.palette.primary.dark,
                          }}
                        >
                          {creator}
                        </TypographyComp>
                        <TypographyComp
                          sx={{
                            fontSize: "14px",
                            color: theme.palette.primary.gray,
                          }}
                        >
                          •{" "}
                          {getTimeAgo(
                            item.userUpdatedAt
                              ? item.userUpdatedAt
                              : item.createdAt,
                          )}
                        </TypographyComp>
                      </StackComponent>
                      <StackComponent direction="column">
                        <TypographyComp
                          component="h4"
                          sx={styles.announcementHeading}
                        >
                          {item.title}
                        </TypographyComp>
                      </StackComponent>
                      <StackComponent direction="column">
                        <DisplayEditorData
                          isStory
                          content={isExpanded ? item.body : truncatedBody}
                        />
                        {item?.body?.length > 900 && (
                          <ButtonComp
                            variant="text"
                            onClick={() =>
                              announcementsData.toggleAnnouncement(index)
                            }
                            sx={{
                              color: theme.palette.primary.main,
                              fontSize: "14px",
                              padding: "8px 0",
                              fontWeight: 500,
                              "&:hover": {
                                background: "none",
                              },
                            }}
                          >
                            {getReadMoreText(isExpanded, item)}
                          </ButtonComp>
                        )}
                      </StackComponent>
                    </BoxComponent>
                  );
                })}
                {announcementsData.newAnnouncements.length <
                  announcementsData.totalAnnouncements && (
                  <BoxComponent sx={{ textAlign: "center", mt: 2 }}>
                    <Suspense fallback={<ButtonLoading />}>
                      <LoadingBtn
                        sx={{
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#6363E6",
                        }}
                        onClick={announcementsData.loadMoreAnnouncements}
                        variant="text"
                        loadingState={announcementsData.loadingAnnouncements}
                        loadingLabel="Loading more updates..."
                      >
                        Show more updates
                      </LoadingBtn>
                    </Suspense>
                  </BoxComponent>
                )}
              </WhiteBackgroundSection>
            </BoxComponent>
          )}

        {/* Recent Supporters Section - Desktop */}
        <BoxComponent sx={{ display: { xs: "none", sm: "block" } }}>
          {!previewMode && supportersData.supporters.length > 0 && (
            <WhiteBackgroundSection direction="column">
              <TypographyComp
                sx={{
                  ...styles.heading,
                  ...styles.recentSupportersHeadingOverride,
                }}
              >
                Recent Supporters
              </TypographyComp>
              <StackComponent spacing={0} sx={styles.recentSupportersContainer}>
                {supportersData.supporters.map((eachSupporter, index) => (
                  <StackComponent
                    sx={styles.eachRecentSupporterContainer(
                      index,
                      isSmallScreen,
                    )}
                    key={eachSupporter.id}
                    alignItems="center"
                  >
                    <SafeImage
                      width={46}
                      height={46}
                      style={{
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                      src={
                        eachSupporter.profileImage
                          ? eachSupporter.profileImage
                          : testimonial_1
                      }
                      fallbackSrc={testimonial_1}
                      alt={`${eachSupporter.firstName} ${eachSupporter.lastName}`}
                    />
                    <StackComponent
                      direction="column"
                      sx={{ maxWidth: "100%" }}
                      spacing={0}
                    >
                      <Tooltip
                        title={`${formatName(
                          eachSupporter?.firstName,
                        )} ${formatName(eachSupporter?.lastName)}`}
                      >
                        <span>
                          <TypographyComp
                            sx={{
                              fontWeight: 500,
                              fontSize: "18px",
                              lineHeight: "22px",
                              color: "#090909",
                            }}
                          >
                            {getFullName(
                              eachSupporter?.firstName,
                              eachSupporter?.lastName,
                            )}
                          </TypographyComp>
                        </span>
                      </Tooltip>
                      <TypographyComp
                        sx={{
                          color: "#606062",
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "20px",
                        }}
                      >
                        {eachSupporter.currencySymbol}
                        {eachSupporter.amount} {eachSupporter.currency},{" "}
                        {formatTimestamp(eachSupporter.createdAt)}
                      </TypographyComp>
                    </StackComponent>
                  </StackComponent>
                ))}
              </StackComponent>
              {recentSupportersCount > supportersData.supporters.length &&
                !supportersData.noSupporters && (
                  <BoxComponent sx={{ textAlign: "center" }}>
                    <Suspense fallback={<LoadingBtn loadingState={true} />}>
                      <LoadingBtn
                        sx={{
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: "#6363E6",
                        }}
                        onClick={supportersData.handleViewMoreClick}
                        variant="text"
                        loadingState={supportersData.isLoading}
                        loadingLabel="Loading more supporters..."
                      >
                        View more supporters
                      </LoadingBtn>
                    </Suspense>
                  </BoxComponent>
                )}
            </WhiteBackgroundSection>
          )}
        </BoxComponent>

        {/* Giving Levels - Mobile */}
        <StackComponent
          direction="column"
          sx={{ display: { xs: "block", sm: "none" } }}
        >
          {campaignData.currentGradingLevels?.length > 0 && !previewMode ? (
            <StackComponent
              direction="row"
              justifyContent={{ xs: "flex-end", sm: "flex-end" }}
              sx={{
                marginTop: { xs: "-15px", sm: "-75px" },
                marginBottom: "15px",
                marginRight: "10px !important",
              }}
            >
              <BoxComponent sx={{ width: "100px" }}>
                <Suspense fallback={<LoadingSpinner height="36px" />}>
                  <DropDown
                    disableClearable={true}
                    isLabel={false}
                    placeholder={campaignData.currencyConversion?.units}
                    data={activeCurrencies}
                    onChange={handleDropDownChange}
                    selectedValue={selectedCountry}
                    isHeightCustomizable={true}
                    textColor="#A1A1A8"
                  />
                </Suspense>
              </BoxComponent>
            </StackComponent>
          ) : null}

          {campaignData.currentGradingLevels.length > 0 &&
            (() => {
              const maxClaims = Math.max(
                ...campaignData.currentGradingLevels.map(
                  (campaign) => campaign?.usedCount || 0,
                ),
              );

              const givingLevelsWithMaxClaims =
                campaignData.currentGradingLevels.filter(
                  (campaign) => (campaign?.usedCount || 0) === maxClaims,
                );

              let highestAmountWithMaxClaims = 0;
              if (givingLevelsWithMaxClaims.length > 1 && maxClaims > 0) {
                highestAmountWithMaxClaims = Math.max(
                  ...givingLevelsWithMaxClaims.map(
                    (campaign) => campaign.amount || 0,
                  ),
                );
              }

              return campaignData.currentGradingLevels.map(
                (eachCampaign, index) => (
                  <Suspense key={index} fallback={<LoadingSpinner />}>
                    <SingleSimilarCampaign
                      title={eachCampaign.title}
                      donationAmount={formatNumber(eachCampaign.amount)}
                      claimed={eachCampaign?.usedCount || 0}
                      recurringType={eachCampaign.recurringType}
                      btnClickEvent={() => givingLevelHandler(index)}
                      buttonText={`Donate ${
                        campaignData.currentCurrency ||
                        campaignData?.currencyConversion?.symbol
                      }${formatNumber(eachCampaign.amount)}`}
                      status={checkStatus}
                      donationType={eachCampaign.donationType}
                      description={eachCampaign.description}
                      isMostNeeded={eachCampaign.isMostNeeded}
                      currencySymbol={
                        campaignData.currentCurrency ||
                        campaignData?.currencyConversion?.symbol
                      }
                      isHighestClaimed={
                        campaignData.currentGradingLevels.length > 1 &&
                        (eachCampaign?.usedCount || 0) === maxClaims &&
                        maxClaims > 0 &&
                        (givingLevelsWithMaxClaims.length === 1 ||
                          eachCampaign.amount === highestAmountWithMaxClaims)
                      }
                    />
                  </Suspense>
                ),
              );
            })()}
        </StackComponent>
      </StackComponent>

      {/* Right Column - Desktop */}
      <BoxComponent
        sx={{
          position: "relative",
          width: isMediumScreen ? "100%" : "31.508%",
          display: { xs: "none", sm: "block" },
        }}
      >
        <StackComponent
          direction="column"
          sx={styles.rightSide({
            isMediumScreen,
            isSmallScreen,
            gradingLevelsList,
            hideOverflow:
              campaignData.currentGradingLevels &&
              campaignData.currentGradingLevels.length > 0,
          })}
        >
          {!isMediumScreen && (
            <>
              {donatePress ? (
                <DonationProgressBarHandle
                  {...donationProgressBarHandleProps}
                />
              ) : (
                <WhiteBackgroundSection direction="column">
                  <DonationProgressBarHandle
                    {...donationProgressBarHandleProps}
                  />
                </WhiteBackgroundSection>
              )}
            </>
          )}

          {!donatePress && campaignData.currentGradingLevels?.length > 0 ? (
            <StackComponent direction="column">
              {!previewMode ? (
                <StackComponent
                  direction="row"
                  justifyContent={{ xs: "flex-end", sm: "flex-end" }}
                  sx={{
                    marginTop: { xs: "-15px", sm: "17px !important" },
                    marginBottom: "15px",
                  }}
                >
                  <BoxComponent sx={{ width: "100px" }}>
                    <Suspense fallback={<LoadingSpinner height="36px" />}>
                      <DropDown
                        disableClearable={true}
                        isLabel={false}
                        placeholder={campaignData.currencyConversion?.units}
                        data={activeCurrencies}
                        onChange={handleDropDownChange}
                        selectedValue={selectedCountry}
                        isHeightCustomizable={true}
                        textColor="#A1A1A8"
                      />
                    </Suspense>
                  </BoxComponent>
                </StackComponent>
              ) : null}

              {campaignData.currentGradingLevels?.length > 0 &&
                (() => {
                  const maxClaims = Math.max(
                    ...campaignData.currentGradingLevels.map(
                      (campaign) => campaign?.usedCount || 0,
                    ),
                  );

                  const givingLevelsWithMaxClaims =
                    campaignData.currentGradingLevels.filter(
                      (campaign) => (campaign?.usedCount || 0) === maxClaims,
                    );

                  let highestAmountWithMaxClaims = 0;
                  if (givingLevelsWithMaxClaims.length > 1 && maxClaims > 0) {
                    highestAmountWithMaxClaims = Math.max(
                      ...givingLevelsWithMaxClaims.map(
                        (campaign) => campaign.amount || 0,
                      ),
                    );
                  }

                  return campaignData.currentGradingLevels.map(
                    (eachCampaign, index) => (
                      <Suspense key={index} fallback={<LoadingSpinner />}>
                        <SingleSimilarCampaign
                          title={eachCampaign.title}
                          donationAmount={formatNumber(eachCampaign.amount)}
                          claimed={eachCampaign?.usedCount || 0}
                          btnClickEvent={() =>
                            givingLevelHandler(eachCampaign, index)
                          }
                          buttonText={`Donate ${
                            campaignData?.currentCurrency ||
                            campaignData?.currencyConversion?.symbol ||
                            "$"
                          }${formatNumber(eachCampaign.amount)}`}
                          recurringType={eachCampaign.recurringType}
                          status={checkStatus}
                          donationType={eachCampaign.donationType}
                          description={eachCampaign.description}
                          isMostNeeded={eachCampaign.isMostNeeded}
                          currencySymbol={
                            campaignData.currentCurrency ||
                            campaignData?.currencyConversion?.symbol ||
                            "$"
                          }
                          isHighestClaimed={
                            campaignData.currentGradingLevels?.length > 1 &&
                            (eachCampaign?.usedCount || 0) === maxClaims &&
                            maxClaims > 0 &&
                            (givingLevelsWithMaxClaims.length === 1 ||
                              eachCampaign.amount ===
                                highestAmountWithMaxClaims)
                          }
                        />
                      </Suspense>
                    ),
                  );
                })()}
            </StackComponent>
          ) : null}
        </StackComponent>
      </BoxComponent>

      {/* Recent Supporters Section - Mobile */}
      <BoxComponent sx={{ display: { xs: "block", sm: "none" } }}>
        {!previewMode && supportersData.supporters.length > 0 && (
          <WhiteBackgroundSection direction="column">
            <TypographyComp
              sx={{
                ...styles.heading,
                ...styles.recentSupportersHeadingOverride,
              }}
            >
              Recent Supporters
            </TypographyComp>
            <StackComponent spacing={0} sx={styles.recentSupportersContainer}>
              {supportersData.supporters.map((eachSupporter, index) => (
                <StackComponent
                  sx={styles.eachRecentSupporterContainer(index, isSmallScreen)}
                  key={eachSupporter.id}
                  alignItems="center"
                >
                  <SafeImage
                    width={46}
                    height={46}
                    style={{
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                    src={
                      eachSupporter.profileImage
                        ? eachSupporter.profileImage
                        : testimonial_1
                    }
                    fallbackSrc={testimonial_1}
                    alt={`${eachSupporter.firstName} ${eachSupporter.lastName}`}
                  />
                  <StackComponent
                    direction="column"
                    sx={{ maxWidth: "100%" }}
                    spacing={0}
                  >
                    <Tooltip
                      enterTouchDelay={0}
                      title={`${formatName(
                        eachSupporter?.firstName,
                      )} ${formatName(eachSupporter?.lastName)}`}
                    >
                      <span>
                        <TypographyComp
                          sx={{
                            fontWeight: 500,
                            fontSize: "18px",
                            lineHeight: "22px",
                            color: "#090909",
                          }}
                        >
                          {getFullName(
                            eachSupporter?.firstName,
                            eachSupporter?.lastName,
                          )}
                        </TypographyComp>
                      </span>
                    </Tooltip>
                    <TypographyComp
                      sx={{
                        color: "#606062",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "20px",
                      }}
                    >
                      {eachSupporter.currencySymbol}
                      {eachSupporter.amount},{" "}
                      {formatTimestamp(eachSupporter.createdAt)}
                    </TypographyComp>
                  </StackComponent>
                </StackComponent>
              ))}
            </StackComponent>
            {recentSupportersCount > supportersData.supporters.length &&
              !supportersData.noSupporters && (
                <BoxComponent sx={{ textAlign: "center" }}>
                  <Suspense fallback={<LoadingBtn loadingState={true} />}>
                    <LoadingBtn
                      sx={{
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: "16px",
                        color: "#6363E6",
                      }}
                      onClick={supportersData.handleViewMoreClick}
                      variant="text"
                      loadingState={supportersData.isLoading}
                      loadingLabel="Loading more supporters..."
                    >
                      View more supporters
                    </LoadingBtn>
                  </Suspense>
                </BoxComponent>
              )}
          </WhiteBackgroundSection>
        )}
      </BoxComponent>
    </StackComponent>
  );
}

ViewCampaignTemplate.propTypes = {
  categoryName: PropTypes.string,
  countryName: PropTypes.string,
  coverMedia: PropTypes.any,
  coverYoutubeUrl: PropTypes.any,
  creator: PropTypes.string,
  currency: PropTypes.string,
  email: PropTypes.string,
  gradingLevelsList: PropTypes.any,
  initialGoal: PropTypes.number,
  isZakatEligible: PropTypes.bool,
  isTaxDeductable: PropTypes.bool,
  organizerPhoto: PropTypes.any,
  previewMode: PropTypes.bool,
  raisedPercentage: PropTypes.any,
  recentSupporters: PropTypes.array,
  story: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string,
  updateDonationValue: PropTypes.func,
  url: PropTypes.string,
  whenPublished: PropTypes.string,
  recurringDonation: PropTypes.bool,
  allowRecurringDonations: PropTypes.bool,
  oneTimeDonation: PropTypes.any,
  meta: PropTypes.any,
  campaignEndDate: PropTypes.string,
};
