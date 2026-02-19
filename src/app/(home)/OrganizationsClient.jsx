"use client";

/**
 * Client Component - Organizations Slider
 *
 * Only the interactive parts are client-side:
 * - Slider navigation buttons
 * - Scroll position state
 *
 * Organization logos are rendered from server-provided data
 */

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";

const PLACEHOLDER_IMAGE = "/assets/images/placeholder.png";

export default function OrganizationsClient({ organizations }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = useCallback(
    (direction) => {
      if (scrollRef.current) {
        const scrollAmount = 300;
        scrollRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
        // Check position after scroll animation
        setTimeout(checkScrollPosition, 350);
      }
    },
    [checkScrollPosition]
  );

  return (
    <div style={{ position: "relative" }}>
      {/* Navigation arrows - hidden on mobile */}
      <div
        className="org-nav-arrows"
        style={{
          position: "absolute",
          top: "-60px",
          right: "0",
          display: "flex",
          gap: "8px",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid #E0E0E0",
            background: canScrollLeft ? "#fff" : "#f5f5f5",
            cursor: canScrollLeft ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: canScrollLeft ? 1 : 0.5,
            transition: "all 0.2s ease",
          }}
          aria-label="Scroll left"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid #E0E0E0",
            background: canScrollRight ? "#fff" : "#f5f5f5",
            cursor: canScrollRight ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: canScrollRight ? 1 : 0.5,
            transition: "all 0.2s ease",
          }}
          aria-label="Scroll right"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Organizations logos slider */}
      <div
        ref={scrollRef}
        onScroll={checkScrollPosition}
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollBehavior: "smooth",
          paddingBottom: "4px",
        }}
        className="org-slider"
      >
        {organizations.map((org, index) => (
          <div
            key={org.id || index}
            style={{
              width: "80px",
              height: "58px",
              minWidth: "80px",
              borderRadius: "8px",
              background: "#F6F6F6",
              padding: "1px",
              position: "relative",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src={org.image || PLACEHOLDER_IMAGE}
              alt={org.payload?.name || "Organization logo"}
              fill
              style={{
                objectFit: "contain",
                borderRadius: "8px",
              }}
              unoptimized={org.image?.startsWith("http")}
            />
          </div>
        ))}
      </div>

      <style>{`
        .org-slider::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 900px) {
          .org-nav-arrows {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
