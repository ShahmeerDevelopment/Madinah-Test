"use client";

/**
 * CampaignSupporters - Client Component for recent supporters section
 * Handles lazy loading more supporters
 * 
 * TBT Optimization: Uses CSS-based responsive styles instead of useResponsiveScreen
 */

import { useState, useCallback, lazy, Suspense } from "react";
import Tooltip from "@mui/material/Tooltip";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import SafeImage from "@/components/atoms/SafeImage";
import { formatTimestamp } from "@/utils/helpers";
import { getRecentSupporters } from "@/api/get-api-services";
import { ASSET_PATHS } from "@/utils/assets";
// Removed useResponsiveScreen - using CSS-based responsive design for better TBT

const testimonial_1 =
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

const styles = {
  heading: {
    color: "rgba(9, 9, 9, 1)",
    fontWeight: 500,
    fontSize: "32px",
    lineHeight: "48px",
    wordBreak: "auto-phrase",
    overflowWrap: "break-word",
  },
  recentSupportersHeadingOverride: {
    // marginBottom: '12px !important',
  },
  recentSupportersContainer: {
    flexWrap: "wrap",
  },
  // CSS-based responsive styles (better for TBT than useResponsiveScreen)
  eachRecentSupporterContainer: {
    marginTop: "22px",
    width: { xs: "100%", sm: "50%" },
    minWidth: { xs: "auto", sm: "176px" },
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

export default function CampaignSupporters({
  recentSupporters = [],
  recentSupportersCount = 0,
  randomToken,
}) {
  // Removed useResponsiveScreen - using CSS sx props for responsive design
  const [supporters, setSupporters] = useState(recentSupporters);
  const [isLoading, setIsLoading] = useState(false);
  const [noMoreSupporters, setNoMoreSupporters] = useState(false);
  const [offset, setOffset] = useState(recentSupporters.length);

  const handleViewMoreClick = useCallback(async () => {
    if (!randomToken || isLoading || noMoreSupporters) return;

    setIsLoading(true);
    try {
      const response = await getRecentSupporters(randomToken, 4, offset);
      const newSupporters = response?.data?.data?.recentSupporters || [];

      if (newSupporters.length === 0) {
        setNoMoreSupporters(true);
      } else {
        setSupporters((prev) => [...prev, ...newSupporters]);
        setOffset((prev) => prev + newSupporters.length);
      }
    } catch (error) {
      console.error("Error fetching more supporters:", error);
    } finally {
      setIsLoading(false);
    }
  }, [randomToken, offset, isLoading, noMoreSupporters]);

  if (!supporters || supporters.length === 0) {
    return null;
  }

  return (
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
        {supporters.map((eachSupporter, index) => (
          <StackComponent
            sx={styles.eachRecentSupporterContainer}
            key={eachSupporter.id || index}
            alignItems="center"
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
                      eachSupporter?.lastName
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

      {/* Load More Button */}
      {recentSupportersCount > supporters.length && !noMoreSupporters && (
        <BoxComponent sx={{ textAlign: "center" }}>
          <Suspense fallback={<LoadingSpinner height="36px" />}>
            <LoadingBtn
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "16px",
                color: "#6363E6",
              }}
              onClick={handleViewMoreClick}
              variant="text"
              loadingState={isLoading}
              loadingLabel="Loading more supporters..."
            >
              View more supporters
            </LoadingBtn>
          </Suspense>
        </BoxComponent>
      )}
    </WhiteBackgroundSection>
  );
}
