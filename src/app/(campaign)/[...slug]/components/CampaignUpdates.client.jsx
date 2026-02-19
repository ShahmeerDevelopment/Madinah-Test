"use client";

/**
 * CampaignUpdates - Client Component for campaign announcements/updates
 * Handles expandable content and lazy loading more updates
 */

import { useState, useCallback, lazy, Suspense } from "react";
import Badge from "@mui/material/Badge";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import SafeImage from "@/components/atoms/SafeImage";
import { theme } from "@/config/customTheme";
import { getAnnouncements } from "@/api/get-api-services";
import { ASSET_PATHS } from "@/utils/assets";

const DEFAULT_IMG =
  ASSET_PATHS.testimonials?.avatarPlaceholder ||
  "/assets/images/avatar-placeholder.png";

// Lazy load components
const LoadingBtn = lazy(() => import("@/components/advance/LoadingBtn"));

// Loading component
const LoadingSpinner = ({ height = "50px" }) => (
  <BoxComponent
    sx={{ display: "flex", justifyContent: "center", p: 2, height }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>Loading...</div>
  </BoxComponent>
);

// Import styles from ViewCampaignTemplate for consistency
const styles = {
  heading: {
    color: "rgba(9, 9, 9, 1)",
    fontWeight: 500,
    fontSize: "32px",
    lineHeight: "48px",
    wordBreak: "auto-phrase",
    overflowWrap: "break-word",
  },
  announcementHeading: {
    color: "rgba(9,9,9,1)",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "32px",
    wordBreak: "auto-phrase",
    overflowWrap: "break-word",
  },
};

// Helper to truncate HTML content
function truncateHTML(html, maxLength = 900) {
  if (!html || html.length <= maxLength) return html;
  return html.substring(0, maxLength) + "...";
}

// Helper to get time ago string
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
}

export default function CampaignUpdates({
  announcements = [],
  organizerPhoto,
  creator,
  campaignId,
}) {
  const [expandedAnnouncements, setExpandedAnnouncements] = useState({});
  const [displayedAnnouncements, setDisplayedAnnouncements] =
    useState(announcements);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(announcements.length);
  const totalAnnouncements = announcements.length;

  const toggleAnnouncement = useCallback((index) => {
    setExpandedAnnouncements((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const loadMoreAnnouncements = useCallback(async () => {
    if (!campaignId || loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await getAnnouncements(campaignId, 10, offset);
      const newAnnouncements = response?.data?.data || [];
      if (newAnnouncements.length > 0) {
        setDisplayedAnnouncements((prev) => [...prev, ...newAnnouncements]);
        setOffset((prev) => prev + newAnnouncements.length);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [campaignId, offset, loadingMore]);

  const getReadMoreText = (isExpanded, item) => {
    if (isExpanded) return "Read less";
    return "Read more";
  };

  if (!displayedAnnouncements || displayedAnnouncements.length === 0) {
    return null;
  }

  return (
    <BoxComponent>
      <WhiteBackgroundSection direction="column">
        <TypographyComp sx={{ ...styles.heading }}>
          Updates{" "}
          <Badge
            sx={{ marginLeft: "10px" }}
            color="primary"
            badgeContent={totalAnnouncements}
          />
        </TypographyComp>

        {displayedAnnouncements.map((item, index) => {
          const isExpanded = expandedAnnouncements[index];
          const truncatedBody = truncateHTML(item.body);

          return (
            <BoxComponent key={index} sx={{ marginBottom: "20px !important" }}>
              {/* Author Info */}
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
                  • {getTimeAgo(item.userUpdatedAt || item.createdAt)}
                </TypographyComp>
              </StackComponent>

              {/* Announcement Title */}
              <StackComponent direction="column">
                <TypographyComp component="h4" sx={styles.announcementHeading}>
                  {item.title}
                </TypographyComp>
              </StackComponent>

              {/* Announcement Body */}
              <StackComponent direction="column">
                <BoxComponent
                  sx={{
                    "& p": { marginBottom: "16px" },
                    "& img": {
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    },
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: isExpanded ? item.body : truncatedBody,
                    }}
                    style={{
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#333",
                    }}
                  />
                </BoxComponent>
                {item?.body?.length > 900 && (
                  <ButtonComp
                    variant="text"
                    onClick={() => toggleAnnouncement(index)}
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

        {/* Load More Button */}
        {displayedAnnouncements.length < totalAnnouncements && (
          <BoxComponent sx={{ textAlign: "center", mt: 2 }}>
            <Suspense fallback={<LoadingSpinner height="36px" />}>
              <LoadingBtn
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "16px",
                  color: "#6363E6",
                }}
                onClick={loadMoreAnnouncements}
                variant="text"
                loadingState={loadingMore}
                loadingLabel="Loading more updates..."
              >
                Show more updates
              </LoadingBtn>
            </Suspense>
          </BoxComponent>
        )}
      </WhiteBackgroundSection>
    </BoxComponent>
  );
}
