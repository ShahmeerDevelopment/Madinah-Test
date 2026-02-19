"use client";

/**
 * LoadMoreButton - Client Component for loading more content
 * Handles the load more functionality for updates and supporters
 */

import { useState, useCallback, lazy, Suspense } from "react";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const LoadingBtn = lazy(() => import("@/components/advance/LoadingBtn"));

const LoadingSpinner = ({ height = "36px" }) => (
  <BoxComponent
    sx={{ display: "flex", justifyContent: "center", p: 2, height }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>Loading...</div>
  </BoxComponent>
);

export default function LoadMoreButton({
  onClick,
  hasMore,
  loadingLabel = "Loading...",
  children,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onClick?.();
    } finally {
      setIsLoading(false);
    }
  }, [onClick, isLoading]);

  if (!hasMore) return null;

  return (
    <BoxComponent sx={{ textAlign: "center" }}>
      <Suspense fallback={<LoadingSpinner />}>
        <LoadingBtn
          sx={{
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "16px",
            color: "#6363E6",
          }}
          onClick={handleClick}
          variant="text"
          loadingState={isLoading}
          loadingLabel={loadingLabel}
        >
          {children}
        </LoadingBtn>
      </Suspense>
    </BoxComponent>
  );
}
