import React from "react";
import { useRouter } from "next/navigation";

const WidgetLayout = ({ children }) => {
  const router = useRouter();
  const { hideScrollbars } = router.query;
  const shouldHideScrollbars = hideScrollbars === "true";

  return (
    <div
      style={{
        background: "#fbfbfb",
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        overflow: shouldHideScrollbars ? "hidden" : "auto",
      }}
    >
      <main
        style={{
          display: "block",
          width: "100%",
          padding: 0,
          margin: 0,
          minHeight: "100vh",
          overflow: shouldHideScrollbars ? "hidden" : "auto",
        }}
      >
        {children}
      </main>
      {shouldHideScrollbars && (
        <style jsx global>{`
          body {
            overflow: hidden !important;
          }
          html {
            overflow: hidden !important;
          }
          /* Hide all scrollbars in widget mode */
          * {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* Internet Explorer 10+ */
          }
          *::-webkit-scrollbar {
            display: none; /* WebKit */
          }
        `}</style>
      )}
    </div>
  );
};

export default WidgetLayout;
