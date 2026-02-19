/**
 * CachedSupportersSection - Server Component with Next.js 16 Cache Components
 *
 * Uses 'use cache' directive to create a static shell with cached content.
 * Supporters list can be cached as it doesn't change frequently for viewing.
 *
 * Cache Strategy:
 * - Static shell rendered at build time
 * - Content cached using 'supporters' profile (30 min cache, 5 min revalidation)
 * - On-demand revalidation via cacheTag('supporters-{randomToken}')
 * - Interactive "See All" button passed through for client-side loading
 */

import { cacheLife, cacheTag } from "next/cache";
import Tooltip from "@mui/material/Tooltip";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import SafeImage from "@/components/atoms/SafeImage";
import { formatDate } from "@/utils/helpers";

// Client component for interactive elements (See All button with pagination)
import CampaignSupportersInteractive from "./CampaignSupportersInteractive.client";
import ASSET_PATHS from "@/utils/assets";

const testimonial_1 =
  ASSET_PATHS.testimonials?.avatarPlaceholder ||
  "/assets/images/avatar-placeholder.png";

const styles = {
  heading: {
    color: "rgba(9, 9, 9, 1)",
    fontWeight: 500,
    fontSize: "32px",
    lineHeight: "48px",
    wordBreak: "auto-phrase",
    overflowWrap: "break-word",
  },
};

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

/**
 * CachedSupportersSection - Async Server Component with 'use cache'
 *
 * Creates a static shell for supporters that is cached.
 * The initial supporters list rarely changes, making this
 * ideal for caching to improve performance.
 */
export default async function CachedSupportersSection({
  recentSupporters = [],
  recentSupportersCount = 0,
  randomToken,
  isSmallScreen = false,
}) {
  "use cache";

  // Use supporters cache profile (30 min cache, 5 min revalidation)
  cacheLife("supporters");

  // Tag for on-demand revalidation when new donations are made
  cacheTag(`supporters-${randomToken}`);
  cacheTag(`campaign-${randomToken}`);
  cacheTag("supporters");

  if (!recentSupporters || recentSupporters.length === 0) return null;

  return (
    <BoxComponent
      sx={{
        // CLS Prevention: Reserve minimum height for supporters section
        minHeight: recentSupporters?.length > 0 ? "200px" : "0px",
      }}
    >
      <WhiteBackgroundSection direction="column">
        <TypographyComp sx={{ ...styles.heading }}>
          Recent Supporters
        </TypographyComp>

        <StackComponent spacing={0} sx={{ flexWrap: "wrap" }}>
          {recentSupporters.map((eachSupporter, index) => (
            <StackComponent
              sx={{
                marginTop: "22px",
                width: isSmallScreen ? "100%" : "50%",
                minWidth: isSmallScreen ? "auto" : "176px",
              }}
              key={eachSupporter.id || index}
              alignItems="center"
            >
              <SafeImage
                width={46}
                height={46}
                style={{
                  borderRadius: "8px",
                  objectFit: "cover",
                  aspectRatio: "1/1",
                }}
                src={eachSupporter.profileImage || testimonial_1}
                fallbackSrc={testimonial_1}
                alt={`${eachSupporter.firstName || ""} ${eachSupporter.lastName || ""}`}
              />
              <StackComponent
                direction="column"
                sx={{ maxWidth: "100%" }}
                spacing={0}
              >
                <Tooltip
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
                  {eachSupporter.amount} {eachSupporter.currency},{" "}
                  {formatDate(eachSupporter.createdAt)}
                </TypographyComp>
              </StackComponent>
            </StackComponent>
          ))}
        </StackComponent>

        {/* Interactive component passed through - not cached but rendered inside cached shell */}
        <CampaignSupportersInteractive
          initialCount={recentSupporters.length}
          recentSupportersCount={recentSupportersCount}
          randomToken={randomToken}
        />
      </WhiteBackgroundSection>
    </BoxComponent>
  );
}
