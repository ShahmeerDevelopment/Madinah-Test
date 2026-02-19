"use client";

/**
 * LazySupportersSection - Client Component for lazy loading supporters
 *
 * Uses Intersection Observer for viewport-based lazy loading
 * Renders skeleton until the component enters viewport
 */

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import Tooltip from "@mui/material/Tooltip";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import { formatTimestamp } from "@/utils/helpers";
import { SupportersSkeleton } from "./CampaignSkeletons";

const testimonial_1 = "/assets/images/avatar-placeholder.png";

// Lazy load the interactive component
const CampaignSupportersInteractive = dynamic(
  () => import("./CampaignSupportersInteractive.client"),
  { ssr: false }
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

export default function LazySupportersSection({
  recentSupporters = [],
  recentSupportersCount = 0,
  randomToken,
  isSmallScreen = false,
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

  if (!recentSupporters || recentSupporters.length === 0) return null;

  return (
    <BoxComponent 
      ref={containerRef}
      sx={{ 
        // CLS Prevention: Reserve minimum height for supporters section
        minHeight: recentSupporters?.length > 0 ? '200px' : '0px',
      }}
    >
      {!isVisible ? (
        <SupportersSkeleton />
      ) : (
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
                <NextImage
                  width={46}
                  height={46}
                  style={{
                    borderRadius: "8px",
                    objectFit: "cover",
                    aspectRatio: '1/1',
                  }}
                  src={eachSupporter.profileImage || testimonial_1}
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

          <CampaignSupportersInteractive
            initialCount={recentSupporters.length}
            recentSupportersCount={recentSupportersCount}
            randomToken={randomToken}
          />
        </WhiteBackgroundSection>
      )}
    </BoxComponent>
  );
}
