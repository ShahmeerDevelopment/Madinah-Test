"use client";

/**
 * RightSideButtons - Client Component for interactive donation buttons
 *
 * These buttons require:
 * - User interaction (onClick handlers)
 * - Redux dispatch
 * - Router navigation
 * - Cookie access
 * - Analytics tracking
 * 
 * TBT Optimization: Removed useResponsiveScreen - using CSS-based responsive design
 */

import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

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
} from "@/store/slices/donationSlice";

// Lazy load modal components
const ModalComponent = lazy(
  () => import("@/components/molecules/modal/ModalComponent"),
);
const SocialShare = lazy(
  () => import("@/components/molecules/socialShare/SocialShare"),
);

// Loading component
const LoadingSpinner = ({ height = "50px" }) => (
  <BoxComponent
    sx={{ display: "flex", justifyContent: "center", p: 2, height }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>Loading...</div>
  </BoxComponent>
);

export function DonateButton({
  title,
  checkStatus,
  campaignEndDate,
  randomToken,
  meta = [],
  url,
  previewMode = false,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // Removed useResponsiveScreen - using CSS sx props for responsive design

  const consentCookie = getCookie(CONSENT_COOKIE_NAME);
  const experimentalFeature = getCookie("abtesting");

  const isAdminLogin = useSelector((state) =>
    state.auth.userDetails?.loginAs === "admin" ? true : false,
  );

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

  if (isAdminLogin) {
    return null;
  }

  return (
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
  );
}

export function ShareButton({ title, url, previewMode = false }) {
  const [showShareModel, setShowShareModel] = useState(false);

  const consentCookie = getCookie(CONSENT_COOKIE_NAME);

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

  return (
    <>
      <ButtonComp
        onClick={shareButtonHandler}
        size="normal"
        variant="outlined"
        sx={{ mt: 1 }}
      >
        Share
      </ButtonComp>

      {/* Share Modal */}
      {showShareModel && (
        <Suspense fallback={<LoadingSpinner />}>
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
    </>
  );
}
