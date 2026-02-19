/**
 * Fully Static Server Component - Fundraise For Anyone Section
 *
 * Pure HTML/CSS - No JavaScript hydration needed
 * Uses next/link for client-side navigation optimization
 *
 * Benefits:
 * - Zero JavaScript hydration for static content
 * - Instant render (no MUI overhead)
 * - SEO-friendly
 * - Accessible (semantic HTML)
 * - Client-side navigation with next/link for better UX
 */

import Link from "next/link";

// Static data for fundraise options
const FUNDRAISE_OPTIONS = [
  {
    id: "myself",
    heading: "Yourself",
    title: "Funds are delivered to your bank account for your own use",
    href: "/create-campaign?option=myself",
  },
  {
    id: "someone-else",
    heading: "Friends & Family",
    title:
      "You'll invite a beneficiary to receive funds or distribute them yourself",
    href: "/create-campaign?option=someone-else",
  },
  {
    id: "charity-organization",
    heading: "Charity",
    title: "Funds are delivered to your chosen nonprofit for you",
    href: "/create-campaign?option=charity-organization",
  },
];

// Arrow icon SVG (inline for zero network requests)
function ArrowIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FundraiseCard({ option }) {
  return (
    <Link
      href={option.href}
      prefetch={false}
      className="fundraise-card"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        minHeight: "80px",
        borderRadius: "28px",
        border: "2px solid rgba(233, 233, 235, 1)",
        backgroundColor: "#ffffff",
        textDecoration: "none",
        cursor: "pointer",
        boxSizing: "border-box",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div style={{ width: "85%" }}>
        <h3
          style={{
            fontFamily: "var(--font-league-spartan)",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: "28px",
            color: "#090909",
            margin: 0,
            marginBottom: "4px",
          }}
        >
          {option.heading}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-league-spartan)",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "20px",
            color: "#606062",
            margin: 0,
          }}
        >
          {option.title}
        </p>
      </div>
      <div
        style={{
          color: "#090909",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ArrowIcon />
      </div>
    </Link>
  );
}

export default function FundraiseForAnyoneServer() {
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
      {/* Section Header */}
      <h2
        style={{
          fontFamily: "var(--font-league-spartan)",
          fontSize: "32px",
          fontWeight: 500,
          lineHeight: "38px",
          letterSpacing: "-0.41px",
          color: "#090909",
          margin: 0,
          marginBottom: "24px",
        }}
      >
        Fundraise for anyone
      </h2>

      {/* Fundraise Options */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {FUNDRAISE_OPTIONS.map((option) => (
          <FundraiseCard key={option.id} option={option} />
        ))}
      </div>

      {/* Hover styles */}
      <style>{`
        .fundraise-card:hover {
          border-color: transparent;
          background: linear-gradient(white, white) padding-box, 
                      linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .fundraise-card:focus-visible {
          outline: 2px solid #6363E6;
          outline-offset: 2px;
        }
        @media (max-width: 600px) {
          .fundraise-card {
            min-height: 104px !important;
          }
          section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
