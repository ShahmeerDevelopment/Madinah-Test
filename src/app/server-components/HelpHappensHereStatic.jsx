/**
 * Server Component - Help Happens Here (Fully Static)
 *
 * Uses Next.js 15+ Suspense streaming strategy:
 * - Static shell renders immediately (HTML in initial response)
 * - Animation component is client-side only
 * - Zero MUI dependencies for the static parts
 */
import { Suspense } from "react";

// Import client wrapper that handles the animation
import HelpHappensHereAnimationWrapper from "./HelpHappensHereAnimationWrapper.client";

// Static placeholder - shows immediately, no JS needed
const AnimationPlaceholder = () => (
  <div
    style={{
      width: "100%",
      height: "300px",
      background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Animated gradient effect using CSS only */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "200%",
        height: "100%",
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
        animation: "shimmer 2s infinite",
      }}
    />
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(0); }
        100% { transform: translateX(50%); }
      }
    `}</style>
    {/* Static map placeholder - visible in HTML */}
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      fill="none"
      style={{ opacity: 0.3 }}
    >
      <ellipse
        cx="60"
        cy="40"
        rx="55"
        ry="35"
        stroke="#ccc"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M20 40 Q40 20 60 40 Q80 60 100 40"
        stroke="#ccc"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="30" cy="35" r="4" fill="#6363E6" opacity="0.5" />
      <circle cx="70" cy="30" r="4" fill="#6363E6" opacity="0.5" />
      <circle cx="90" cy="45" r="4" fill="#6363E6" opacity="0.5" />
    </svg>
  </div>
);

// Main component - fully static, no MUI
const HelpHappensHereStatic = () => {
  return (
    <section
      style={{
        height: "max-content",
        zIndex: 1,
        boxShadow: "0px 0px 100px 0px #0000000F",
        borderRadius: "40px",
        backgroundColor: "#FFFFFF",
        padding: "32px",
      }}
    >
      {/* Heading - static HTML */}
      <h2
        style={{
          fontFamily: "var(--font-league-spartan)",
          fontSize: "32px",
          fontWeight: 500,
          lineHeight: "38px",
          letterSpacing: "-0.41px",
          color: "#090909",
          margin: 0,
          marginBottom: "8px",
        }}
      >
        Help happens here
      </h2>

      {/* Content container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          marginTop: "8px",
        }}
      >
        {/* Static text - rendered in HTML immediately */}
        <p
          style={{
            color: "#A1A1A8",
            fontSize: "18px",
            lineHeight: "22px",
            letterSpacing: "-0.41px",
            margin: 0,
          }}
        >
          Madinah is a platform where communities from around the world come
          together to make a difference.
          <br />
          Explore cities that are receiving the most donations right now.
        </p>

        {/* Animation with Suspense for streaming */}
        <Suspense fallback={<AnimationPlaceholder />}>
          <HelpHappensHereAnimationWrapper />
        </Suspense>
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 600px) {
          section {
            padding: 24px 16px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HelpHappensHereStatic;
