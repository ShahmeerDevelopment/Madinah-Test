/**
 * YearInHelpReview Section - Static shell with client-side blog fetching
 * 
 * Server Side (Static HTML):
 * - Section wrapper with full styling (white background, shadow, rounded corners)
 * - Layout structure
 * 
 * Client Side:
 * - Blog data fetching (WordPress blocks server requests with 403)
 */
import YearInHelpReviewClient from "./YearInHelpReviewClient";

export default function YearInHelpReviewSection() {
  return (
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
      }}
    >
      {/* Client component handles blog fetching and rendering */}
      <YearInHelpReviewClient />
      
      <style>{`
        @media (max-width: 600px) {
          section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
