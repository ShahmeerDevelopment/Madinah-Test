"use client";

/**
 * CampaignUpdatesInteractive - Client Component for interactive updates functionality
 * Only handles expand/collapse and load more - content is rendered server-side
 */

import { useState, useCallback, lazy, Suspense } from "react";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { getAnnouncements } from "@/api/get-api-services";

const LoadingBtn = lazy(() => import("@/components/advance/LoadingBtn"));

const LoadingSpinner = ({ height = "36px" }) => (
  <BoxComponent
    sx={{ display: "flex", justifyContent: "center", p: 2, height }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>Loading...</div>
  </BoxComponent>
);

export default function CampaignUpdatesInteractive({
  announcements = [],
  campaignId,
  totalAnnouncements = 0,
}) {
  const [loadingMore, setLoadingMore] = useState(false);
  const [additionalAnnouncements, setAdditionalAnnouncements] = useState([]);
  const [offset, setOffset] = useState(announcements.length);
  const [hasMore, setHasMore] = useState(
    announcements.length < totalAnnouncements
  );

  const loadMoreAnnouncements = useCallback(async () => {
    if (!campaignId || loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const response = await getAnnouncements(campaignId, 10, offset);
      const newAnnouncements = response?.data?.data || [];
      if (newAnnouncements.length > 0) {
        setAdditionalAnnouncements((prev) => [...prev, ...newAnnouncements]);
        setOffset((prev) => prev + newAnnouncements.length);
      }
      if (newAnnouncements.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [campaignId, offset, loadingMore, hasMore]);

  // Only render load more button if there are more announcements
  if (!hasMore && additionalAnnouncements.length === 0) {
    return null;
  }

  return (
    <>
      {/* Additional announcements loaded client-side would go here */}
      {hasMore && (
        <BoxComponent sx={{ textAlign: "center", mt: 2 }}>
          <Suspense fallback={<LoadingSpinner />}>
            <LoadingBtn
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "16px",
                color: "#6363E6",
              }}
              onClick={loadMoreAnnouncements}
              variant="text"
              loadingState={loadingMore}
              loadingLabel="Loading more updates..."
            >
              Show more updates
            </LoadingBtn>
          </Suspense>
        </BoxComponent>
      )}
    </>
  );
}
