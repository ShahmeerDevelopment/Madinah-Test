"use client";

/**
 * MobileBottomBar - Client Component for mobile fixed bottom donation bar
 * This component renders only the fixed bottom bar with Donate Now and Share buttons
 * The donation progress bar and giving levels are now rendered inside CampaignLeftSide
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

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";

import { createSearchParams, getUTMParams } from "@/utils/helpers";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { setUtmParams } from "@/store/slices/utmSlice";
import { announcementTokenHandler } from "@/store/slices/donationSlice";
import { useInjectDonationSlices } from "@/hooks/useInjectReducers";
import { loadPaymentScripts } from "@/utils/loadPaymentScripts";

import {
  donateCurrencyHandler,
  currencySymbolHandler,
} from "@/store/slices/donationSlice";

import ShareAbleIcon from "@/assets/iconComponent/ShareAbleIcon";

// Lazy load modal components
const ModalComponent = lazy(
  () => import("@/components/molecules/modal/ModalComponent"),
);
const SocialShare = lazy(
  () => import("@/components/molecules/socialShare/SocialShare"),
);

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

// Loading component - minimal skeleton for modals
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

export default function MobileBottomBar({
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

  const [showShareModel, setShowShareModel] = useState(false);

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
    url,
    checkStatus,
    campaignEndDate,
    slugPath,
    meta = [],
  } = campaignData;

  // Initialize UTM params and announcement token - defer to reduce TBT
  useEffect(() => {
    const run = () => {
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
    };

    if (typeof window === "undefined") return;
    // Increase timeout significantly to reduce TBT during initial load
    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(run, { timeout: 3000 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = setTimeout(run, 500);
    return () => clearTimeout(timeoutId);
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

  const donateHandler = useCallback(async () => {
    if (preview === "true") {
      const { default: toast } = await import("react-hot-toast");
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

      const [{ handlePosthog }, { enhancedHandlePosthog }] = await Promise.all([
        import("@/api/post-api-services"),
        import("@/utils/posthogHelper"),
      ]);

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

  const shareButtonHandler = useCallback(async () => {
    if (preview === "true") {
      const { default: toast } = await import("react-hot-toast");
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

      const [{ handlePosthog }, { enhancedHandlePosthog }] = await Promise.all([
        import("@/api/post-api-services"),
        import("@/utils/posthogHelper"),
      ]);

      enhancedHandlePosthog(handlePosthog, payload, title || "Campaign Page");
    }
    setShowShareModel(true);
  }, [preview, parsedConsent, title]);

  return (
    <>
      {/* Fixed Mobile Bottom Bar with Donate and Share buttons */}
      <StackComponent
        direction="row"
        sx={{
          display: { xs: "flex", md: "none" },
          width: "100%",
          background: "#ffffff",
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 15,
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
          p: "10px 16px",
          // Add padding at bottom for safe area on iOS
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
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

      {/* Spacer to prevent content from being hidden behind fixed bar */}
      <BoxComponent sx={{ height: "80px" }} />

      {/* Share Modal */}
      {showShareModel && (
        <Suspense fallback={<LoadingSpinner />}>
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
    </>
  );
}
