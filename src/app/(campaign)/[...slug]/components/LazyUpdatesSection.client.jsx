"use client";

/**
 * LazyUpdatesSection - Client Component for lazy loading updates
 *
 * Uses Intersection Observer for viewport-based lazy loading
 * Renders skeleton until the component enters viewport
 */

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import Badge from "@mui/material/Badge";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import { themeColors } from "@/config/themeColors";
import { UpdatesSkeleton } from "./CampaignSkeletons";

const DEFAULT_IMG = "/assets/images/avatar-placeholder.png";

// Lazy load the interactive component
const CampaignUpdatesInteractive = dynamic(
  () => import("./CampaignUpdatesInteractive.client"),
  { ssr: false }
);

// Helper function to truncate HTML
function truncateHTML(html, maxLength = 300) {
  if (!html) return "";
  const strippedText = html.replace(/<[^>]*>/g, "");
  if (strippedText.length <= maxLength) return html;
  const truncated = strippedText.substring(0, maxLength);
  return `<p>${truncated}...</p>`;
}

// Helper function to get time ago
function getTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears}y ago`;
  if (diffMonths > 0) return `${diffMonths}mo ago`;
  if (diffWeeks > 0) return `${diffWeeks}w ago`;
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "just now";
}

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

export default function LazyUpdatesSection({
  announcements = [],
  organizerPhoto,
  creator,
  campaignId,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!announcements || announcements.length === 0) return null;

  const totalAnnouncements = announcements.length;

  return (
    <BoxComponent 
      ref={containerRef}
      sx={{ 
        minHeight: totalAnnouncements > 0 ? '200px' : '0px',
      }}
    >
      {!isVisible ? (
        <UpdatesSkeleton />
      ) : (
        <WhiteBackgroundSection direction="column">
          <TypographyComp sx={{ ...styles.heading }}>
            Updates{" "}
            <Badge
              sx={{ marginLeft: "10px" }}
              color="primary"
              badgeContent={totalAnnouncements}
            />
          </TypographyComp>

          {announcements.map((item, index) => {
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
                  <NextImage
                    src={organizerPhoto || DEFAULT_IMG}
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
                      color: themeColors.primary.dark,
                    }}
                  >
                    {creator}
                  </TypographyComp>
                  <TypographyComp
                    sx={{
                      fontSize: "14px",
                      color: themeColors.primary.gray,
                    }}
                  >
                    • {getTimeAgo(item.userUpdatedAt || item.createdAt)}
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
                      dangerouslySetInnerHTML={{ __html: truncatedBody }}
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#333",
                      }}
                    />
                  </BoxComponent>
                </StackComponent>
              </BoxComponent>
            );
          })}

          <CampaignUpdatesInteractive
            announcements={announcements}
            campaignId={campaignId}
            totalAnnouncements={totalAnnouncements}
          />
        </WhiteBackgroundSection>
      )}
    </BoxComponent>
  );
}
