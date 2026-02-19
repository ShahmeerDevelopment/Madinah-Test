"use client";

/**
 * MobileDonation - Client Component for mobile donation UI
 * Handles mobile-specific donation progress and buttons
 */

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import SafeImage from "@/components/atoms/SafeImage";
import Tooltip from "@mui/material/Tooltip";

import { formatNumber } from "@/utils/formatNumber";
import {
  formatTimestamp,
  createSearchParams,
  getUTMParams,
} from "@/utils/helpers";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { handlePosthog } from "@/api/post-api-services";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";
// Removed useResponsiveScreen - using CSS-based responsive visibility for better TBT
import { setUtmParams } from "@/store/slices/utmSlice";
import { announcementTokenHandler } from "@/store/slices/donationSlice";
import { useInjectDonationSlices } from "@/hooks/useInjectReducers";
import { loadPaymentScripts } from "@/utils/loadPaymentScripts";

import {
  donatePressHandler,
  donateCurrencyHandler,
  currencySymbolHandler,
} from "@/store/slices/donationSlice";

import ShareAbleIcon from "@/assets/iconComponent/ShareAbleIcon";
import { ASSET_PATHS } from "@/utils/assets";

const testimonial_1 =
  ASSET_PATHS.testimonials?.avatarPlaceholder ||
  "/assets/images/avatar-placeholder.png";

// Lazy load components
const NewDonationProgressBar = lazy(
  () =>
    import("@/components/advance/DonationProgressBar/NewDonationProgressBar"),
);
const ModalComponent = lazy(
  () => import("@/components/molecules/modal/ModalComponent"),
);
const SocialShare = lazy(
  () => import("@/components/molecules/socialShare/SocialShare"),
);
const LoadingBtn = lazy(() => import("@/components/advance/LoadingBtn"));

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

// Progress Bar Skeleton for mobile
const ProgressBarSkeleton = () => (
  <BoxComponent sx={{ width: "100%", p: 2 }}>
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
    {/* Amount and percentage row */}
    <StackComponent
      direction="row"
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "28px",
          width: "120px",
        }}
      />
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "18px",
          width: "60px",
        }}
      />
    </StackComponent>
    {/* Supporters count */}
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "16px",
        width: "150px",
      }}
    />
  </BoxComponent>
);

// Button Skeleton for load more button
const ButtonSkeleton = () => (
  <BoxComponent
    sx={{
      ...skeletonBase,
      height: "36px",
      width: "200px",
      borderRadius: "8px",
      margin: "0 auto",
    }}
  />
);

// Modal Skeleton for share modal
const ModalSkeleton = () => (
  <BoxComponent sx={{ p: 3 }}>
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: "32px",
        width: "70%",
        mb: 3,
      }}
    />
    <StackComponent direction="column" spacing={2}>
      {[1, 2, 3, 4].map((i) => (
        <BoxComponent
          key={i}
          sx={{
            ...skeletonBase,
            height: "48px",
            width: "100%",
            borderRadius: "8px",
          }}
        />
      ))}
    </StackComponent>
  </BoxComponent>
);

// Helper functions
function formatName(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function getFullName(firstName, lastName) {
  const fn = formatName(firstName);
  const ln = formatName(lastName);
  const fullName = `${fn} ${ln}`.trim();
  if (fullName.length > 15) {
    return fullName.substring(0, 15) + "...";
  }
  return fullName || "Anonymous";
}

export default function MobileDonation({
  campaignData,
  cfCountry,
  utmParams,
  preview,
  announcementToken,
}) {
  // Inject donation flow slices
  useInjectDonationSlices();

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // Removed useResponsiveScreen - using CSS display: { xs: 'block', sm: 'none' } for visibility

  const [showShareModel, setShowShareModel] = useState(false);
  const [supportersLoading, setSupportersLoading] = useState(false);
  const [displayedSupporters, setDisplayedSupporters] = useState(
    campaignData.recentSupporters || [],
  );

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

  const {
    title,
    currency,
    initialGoal,
    raisedPercentage = 0,
    recentSupportersCount = 0,
    oneTimeDonation,
    recurringDonation,
    url,
    checkStatus,
    campaignEndDate,
    slugPath,
    meta = [],
  } = campaignData;

  const defaultValue = Math.round(initialGoal * raisedPercentage);

  // Initialize UTM params and announcement token
  useEffect(() => {
    const utmData = {
      utmSource: utmParams.utm_source,
      utmMedium: utmParams.utm_medium,
      utmCampaign: utmParams.utm_campaign,
      utmTerm: utmParams.utm_term,
      utmContent: utmParams.utm_content,
      referral: utmParams.referral,
      fbclid: utmParams.fbclid,
      src: utmParams.src,
    };
    dispatch(setUtmParams(utmData));
    dispatch(announcementTokenHandler(announcementToken));

    // Save cfCountry to localStorage
    if (cfCountry && typeof window !== "undefined") {
      localStorage.setItem("cfCountry", cfCountry);
    }
  }, [dispatch, utmParams, announcementToken, cfCountry]);

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
    if (preview === "true") {
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
      const urlUtmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Donate Button Clicked",
        properties: {
          $current_url: window.location.href,
          ...urlUtmParams,
        },
      };
      enhancedHandlePosthog(handlePosthog, payload, title || "Campaign Page");
    }

    const id = slugPath || pathname?.split("/").filter(Boolean).join("/");
    const src = query?.src;

    const params = {
      id: id,
      ...query,
      intentional: "true", // Add URL parameter as backup
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
    preview,
    experimentalFeature,
    dispatch,
    router,
    url,
    meta,
    query,
    slugPath,
    pathname,
    parsedConsent,
    title,
  ]);

  const shareButtonHandler = useCallback(() => {
    if (preview === "true") {
      toast("Not Functional in Preview Mode", { duration: 1000 });
      return;
    }

    if (parsedConsent?.analytics) {
      const userId = getCookie("distinctId");
      const urlUtmParams = getUTMParams(window.location.href);
      const payload = {
        distinctId: userId,
        event: "Share Button Clicked",
        properties: {
          $current_url: window.location.href,
          ...urlUtmParams,
        },
      };
      enhancedHandlePosthog(handlePosthog, payload, title || "Campaign Page");
    }
    setShowShareModel(true);
  }, [preview, parsedConsent, title]);

  const handleViewMoreSupporters = useCallback(async () => {
    setSupportersLoading(true);
    // Here you would fetch more supporters
    // For now, this is a placeholder
    setSupportersLoading(false);
  }, []);

  // Mobile-only component - visibility controlled by CSS (display: { xs: 'block', sm: 'none' })
  // No JS check needed here

  const isPreviewMode = preview === "true";

  return (
    <BoxComponent sx={{ display: { xs: "block", sm: "none" }, width: "100%" }}>
      {/* Mobile Donation Progress Bar */}
      <WhiteBackgroundSection direction="column">
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
            currency={isPreviewMode ? "$" : currency}
            status={checkStatus}
            getValue={() => {}}
          />
        </Suspense>

        {/* Mobile Buttons */}
        <StackComponent
          direction="row"
          sx={{
            width: "100%",
            background: "#ffffff",
            position: "fixed",
            bottom: 0,
            left: 0,
            zIndex: 15,
            border: "1px solid #ffffff",
            p: "10px",
          }}
        >
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
              sx={{ flexGrow: 1 }}
            >
              {getButtonText()}
            </ButtonComp>
          )}

          <ButtonComp
            variant="outlined"
            size="normal"
            sx={{
              width: "77px",
              padding: "12px 19px 6px 19px !important",
              ml: 1,
            }}
            onClick={shareButtonHandler}
          >
            <ShareAbleIcon />
          </ButtonComp>
        </StackComponent>
      </WhiteBackgroundSection>

      {/* Recent Supporters Section - Mobile */}
      {!isPreviewMode && displayedSupporters.length > 0 && (
        <WhiteBackgroundSection direction="column" sx={{ mt: 2 }}>
          <TypographyComp
            sx={{
              color: "rgba(9, 9, 9, 1)",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              mb: 2,
            }}
          >
            Recent Supporters
          </TypographyComp>
          <StackComponent spacing={0}>
            {displayedSupporters.map((eachSupporter, index) => (
              <StackComponent
                sx={{
                  py: 2,
                  borderTop: index > 0 ? "1px solid #f0f0f0" : "none",
                }}
                key={eachSupporter.id || index}
                alignItems="center"
                direction="row"
                spacing={2}
              >
                <SafeImage
                  width={46}
                  height={46}
                  style={{
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                  src={eachSupporter.profileImage || testimonial_1}
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
                    title={`${formatName(eachSupporter?.firstName)} ${formatName(eachSupporter?.lastName)}`}
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
          {recentSupportersCount > displayedSupporters.length && (
            <BoxComponent sx={{ textAlign: "center", mt: 2 }}>
              <Suspense fallback={<ButtonSkeleton />}>
                <LoadingBtn
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "16px",
                    color: "#6363E6",
                  }}
                  onClick={handleViewMoreSupporters}
                  variant="text"
                  loadingState={supportersLoading}
                  loadingLabel="Loading more supporters..."
                >
                  View more supporters
                </LoadingBtn>
              </Suspense>
            </BoxComponent>
          )}
        </WhiteBackgroundSection>
      )}

      {/* Share Modal */}
      {showShareModel && (
        <Suspense fallback={<ModalSkeleton />}>
          <ModalComponent
            onClose={() => setShowShareModel(false)}
            open={showShareModel}
            width={380}
          >
            <SocialShare
              customUrlData={url}
              customTitle={title}
              setSocialShareModal={setShowShareModel}
            />
          </ModalComponent>
        </Suspense>
      )}
    </BoxComponent>
  );
}
