/**
 * Server Component - Static sections of the homepage
 * These sections are pre-rendered on the server for better performance and SEO
 */
import SectionServer from "./SectionServer";
import HowMadinahWorksServer from "./HowMadinahWorksServer";
import ExternalLinkServer from "./ExternalLinkServer";
import HeroServer from "./HeroServer";
import VoicesOfMadinahServer from "./VoicesOfMadinahServer";
import Link from "next/link";

// Server-rendered static sections

// Fully static Help Happens Here (only animation is client-side)
export { default as HelpHappensHereSection } from "./HelpHappensHereSection";

// Blog section with 1 day cache
export { default as YearInHelpReviewSection } from "./YearInHelpReviewSection";

// Fully static How Madinah Works - pure HTML/CSS
export const HowMadinahWorksSection = ({ showLearnMore = true }) => (
  <section
    style={{
      width: "100%",
      height: "max-content",
      zIndex: 1,
      boxShadow: "0px 0px 100px 0px #0000000F",
      borderRadius: "40px",
      backgroundColor: "#FFFFFF",
      padding: "32px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "0px",
    }}
  >
    {/* Header with Learn More link */}
    <div
      className="how-madinah-header"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-league-spartan)",
          fontSize: "32px",
          fontWeight: 500,
          lineHeight: "38px",
          letterSpacing: "-0.41px",
          color: "#090909",
          margin: 0,
        }}
      >
        How Madinah Works
      </h2>
      {showLearnMore && (
        <Link
          prefetch={false}
          href="/how-it-works"
          className="learn-more-desktop"
          style={{
            fontFamily: "var(--font-league-spartan)",
            color: "#6363e6",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "16px",
            letterSpacing: "-0.41px",
            textDecoration: "none",
          }}
        >
          Learn More
        </Link>
      )}
    </div>

    {/* Content */}
    <HowMadinahWorksServer />

    {/* Learn More button for mobile - below content */}
    {showLearnMore && (
      <div
        className="learn-more-mobile"
        style={{ display: "none", textAlign: "center", marginTop: "24px" }}
      >
        <Link
          prefetch={false}
          href="/how-it-works"
          style={{
            fontFamily: "var(--font-league-spartan)",
            color: "#6363e6",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "16px",
            letterSpacing: "-0.41px",
            textDecoration: "none",
          }}
        >
          Learn More
        </Link>
      </div>
    )}

    <style>{`
      @media (max-width: 768px) {
        .how-madinah-header {
          justify-content: center !important;
        }
        .learn-more-desktop {
          display: none !important;
        }
        .learn-more-mobile {
          display: block !important;
        }
      }
      @media (max-width: 600px) {
        section {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
      }
    `}</style>
  </section>
);

export const VoicesOfMadinahSection = () => <VoicesOfMadinahServer />;

// Re-export individual components
export { default as SectionServer } from "./SectionServer";
export { default as HowMadinahWorksServer } from "./HowMadinahWorksServer";
export { default as ExternalLinkServer } from "./ExternalLinkServer";
export { default as HeroServer } from "./HeroServer";
export { default as VoicesOfMadinahServer } from "./VoicesOfMadinahServer";
export { default as FundraiseForAnyoneServer } from "./FundraiseForAnyoneServer";
