/**
 * CachedUpdatesSection - Server Component with Next.js 16 Cache Components
 *
 * Uses 'use cache' directive to create a static shell with cached content.
 * The updates content rarely changes, making it ideal for caching.
 *
 * Cache Strategy:
 * - Static shell rendered at build time
 * - Content cached for 1 day (campaignContent profile)
 * - On-demand revalidation via cacheTag('campaign-updates-{campaignId}')
 * - Interactive "View All" button passed through as children pattern
 */

import { cacheLife, cacheTag } from "next/cache";
import NextImage from "next/image";
import Badge from "@mui/material/Badge";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import { themeColors } from "@/config/themeColors";

// Client component for interactive elements (View All button)
import CampaignUpdatesInteractive from "./CampaignUpdatesInteractive.client";

const DEFAULT_IMG = "/assets/images/avatar-placeholder.png";

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

/**
 * CachedUpdatesSection - Async Server Component with 'use cache'
 *
 * Creates a static shell for updates that is cached for 1 day.
 * The content inside (announcements list) rarely changes, making
 * this ideal for caching to improve performance.
 */
export default async function CachedUpdatesSection({
  announcements = [],
  organizerPhoto,
  creator,
  campaignId,
}) {
  "use cache";

  // Use campaignContent cache profile (1 day cache)
  cacheLife("campaignContent");
  
  // Tag for on-demand revalidation when updates are added/edited
  cacheTag(`campaign-updates-${campaignId}`);
  cacheTag(`campaign-${campaignId}`);

  if (!announcements || announcements.length === 0) return null;

  const totalAnnouncements = announcements.length;

  return (
    <BoxComponent
      sx={{
        // CLS Prevention: Reserve minimum height for updates section
        minHeight: totalAnnouncements > 0 ? "200px" : "0px",
      }}
    >
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
            <BoxComponent key={index} sx={{ marginBottom: "20px !important" }}>
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
                <TypographyComp component="h4" sx={styles.announcementHeading}>
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

        {/* Interactive component passed through - not cached but rendered inside cached shell */}
        <CampaignUpdatesInteractive
          announcements={announcements}
          campaignId={campaignId}
          totalAnnouncements={totalAnnouncements}
        />
      </WhiteBackgroundSection>
    </BoxComponent>
  );
}
