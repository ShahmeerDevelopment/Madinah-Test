"use client";

/**
 * CampaignSupportersInteractive - Client Component for interactive supporters functionality
 * Only handles load more - initial content is rendered server-side
 * 
 * TBT Optimization: Uses CSS-based responsive styles instead of useResponsiveScreen
 */

import { useState, useCallback, lazy, Suspense } from "react";
import Tooltip from "@mui/material/Tooltip";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import SafeImage from "@/components/atoms/SafeImage";
import { formatTimestamp } from "@/utils/helpers";
import { getRecentSupporters } from "@/api/get-api-services";
import { ASSET_PATHS } from "@/utils/assets";
// Removed useResponsiveScreen - using CSS-based responsive design for better TBT

const testimonial_1 =
  ASSET_PATHS.testimonials?.avatarPlaceholder ||
  "/assets/images/avatar-placeholder.png";

const LoadingBtn = lazy(() => import("@/components/advance/LoadingBtn"));

const LoadingSpinner = ({ height = "36px" }) => (
  <BoxComponent
    sx={{ display: "flex", justifyContent: "center", p: 2, height }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>Loading...</div>
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

export default function CampaignSupportersInteractive({
  initialCount = 0,
  recentSupportersCount = 0,
  randomToken,
}) {
  // Removed useResponsiveScreen - using CSS sx props for responsive design
  const [additionalSupporters, setAdditionalSupporters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(initialCount);
  const [hasMore, setHasMore] = useState(initialCount < recentSupportersCount);

  const handleViewMoreClick = useCallback(async () => {
    if (!randomToken || isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await getRecentSupporters(randomToken, 4, offset);
      const newSupporters = response?.data?.data?.recentSupporters || [];

      if (newSupporters.length === 0) {
        setHasMore(false);
      } else {
        setAdditionalSupporters((prev) => [...prev, ...newSupporters]);
        setOffset((prev) => prev + newSupporters.length);
        if (offset + newSupporters.length >= recentSupportersCount) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more supporters:", error);
    } finally {
      setIsLoading(false);
    }
  }, [randomToken, offset, isLoading, hasMore, recentSupportersCount]);

  return (
    <>
      {/* Additional supporters loaded client-side */}
      {additionalSupporters.length > 0 && (
        <StackComponent spacing={0} sx={{ flexWrap: "wrap" }}>
          {additionalSupporters.map((eachSupporter, index) => (
            <StackComponent
              sx={{
                marginTop: "22px",
                // CSS-based responsive width (better for TBT than useResponsiveScreen)
                width: { xs: "100%", sm: "50%" },
                minWidth: { xs: "auto", sm: "176px" },
              }}
              key={eachSupporter.id || `additional-${index}`}
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
      )}

      {/* Load More Button */}
      {hasMore && (
        <BoxComponent sx={{ textAlign: "center" }}>
          <Suspense fallback={<LoadingSpinner />}>
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
    </>
  );
}
