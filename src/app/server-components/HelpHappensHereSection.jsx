/**
 * Server Component - Help Happens Here
 * Static HTML for section shell, heading, and text
 * Animation is lazy loaded when user scrolls to it
 */
import HelpHappensHereAnimationWrapper from "./HelpHappensHereAnimationWrapper.client";

const HelpHappensHereSection = () => {
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
      {/* Static heading - rendered as HTML */}
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
        Help happens here
      </h2>

      {/* Static content container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          marginTop: "8px",
        }}
      >
        {/* Static text - rendered as HTML */}
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

        {/* Lazy loaded animation - loads when user scrolls to it */}
        <HelpHappensHereAnimationWrapper />
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

export default HelpHappensHereSection;
