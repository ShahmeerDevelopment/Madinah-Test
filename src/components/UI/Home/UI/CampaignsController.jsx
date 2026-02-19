"use client";

import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";
import AlertComponent from "../../../../components/atoms/AlertComponent";
import SkeletonComponent from "../../../../components/atoms/SkeletonComponent";
import CampaignOption from "./CampaignOption";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { handlePosthog } from "@/api/post-api-services";
import { CONSENT_COOKIE_NAME } from "@/config/constant";
import { enhancedHandlePosthog } from "@/utils/posthogHelper";

const CampaignsController = ({
  hasError,
  campaignItem,
  isLoading,
  height = "259px",
  ratio,
  searchPage = false,
  priority = false, // For LCP optimization
  ...props
}) => {
  const router = useRouter();

  // Memoize consent parsing to avoid parsing JSON on every render
  const hasAnalyticsConsent = useMemo(() => {
    const consentCookie = getCookie(CONSENT_COOKIE_NAME);
    if (consentCookie) {
      try {
        const parsed = JSON.parse(consentCookie);
        return parsed?.analytics || false;
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  // Memoize click handler to prevent creating new function on each render
  const handleCampaignClick = useCallback(() => {
    if (campaignItem) {
      // Defer analytics to not block navigation
      if (hasAnalyticsConsent) {
        // Use requestIdleCallback for non-critical tracking
        const trackClick = () => {
          const userId = getCookie("distinctId");
          const payload = {
            distinctId: userId,
            event: "Campaign Clicked From Home",
            properties: {
              $current_url: `https://www.madinah.com/${campaignItem.id}?src=internal_website`,
            },
          };
          enhancedHandlePosthog(
            handlePosthog,
            payload,
            campaignItem?.title || "Campaign Page"
          );
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          requestIdleCallback(trackClick, { timeout: 1000 });
        } else {
          setTimeout(trackClick, 0);
        }
      }
      router.push(`/${campaignItem.id}?src=internal_website`);
    }
  }, [campaignItem, hasAnalyticsConsent, router]);

  return (
    <>
      {isLoading ? (
        <SkeletonComponent
          width="100%"
          height={height}
          sx={{ borderRadius: "12px" }}
        />
      ) : (
        <>
          <>
            {hasError ? (
              <AlertComponent severity="error">
                Error while fetching Campaigns
              </AlertComponent>
            ) : (
              <>
                {!campaignItem ? null : (
                  <CampaignOption
                    isLoading={isLoading}
                    ratio={ratio}
                    height={height}
                    priority={priority}
                    containerStyleOverrides={{ cursor: "pointer" }}
                    searchPage={searchPage}
                    discoverPage
                    containerProps={{
                      onClick: handleCampaignClick,
                    }}
                    {...campaignItem}
                    {...props}
                  />
                )}
              </>
            )}
          </>
        </>
      )}
    </>
  );
};

CampaignsController.propTypes = {
  campaignItem: PropTypes.shape({
    id: PropTypes.any,
  }),
  hasError: PropTypes.any,
  height: PropTypes.any,
  isLoading: PropTypes.any,
  ratio: PropTypes.any,
  priority: PropTypes.bool,
};

export default CampaignsController;
