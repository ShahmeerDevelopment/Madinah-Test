"use client";

import { Wrapper } from "./style";
import NotificationsSkeleton from "./skeleton/NotificationsSkeleton";
import NotificationsList from "./notificationsList";
import { useGetNotificationsList } from "@/api";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
import SimplePaginationComp from "@/components/molecules/paginationComp/SimplePaginationComp";
import { useState, useEffect } from "react";
import { theme } from "@/config/customTheme";

const CampaignNotificationsUI = ({ campaignId }) => {
  const notificationsPerPage = 10;
  const [paginationNumber, setPaginationNumber] = useState(1);

  // State for campaign-specific notifications
  const [notificationParams, setNotificationParams] = useState({
    limit: notificationsPerPage,
    offset: 0,
    type: "", // Remove type and use campaignId instead
    campaignId: campaignId,
  });

  const {
    data: notificationListResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetNotificationsList(
    notificationParams.limit,
    notificationParams.offset,
    notificationParams.type,
    notificationParams.campaignId
  );

  // Set up polling every minute (60000 ms)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      refetch();
    }, 60000);

    return () => clearInterval(pollInterval);
  }, [refetch]);

  if (isError) return <p>Error: {error.message}</p>;

  const notificationData = notificationListResponse?.data?.data;
  const notifications = notificationData?.notifications || [];
  const totalNotifications = notificationData?.total || 0;
  const totalPages = Math.ceil(totalNotifications / notificationsPerPage);

  const paginateHandler = (page) => {
    setPaginationNumber(page);
    const newOffset = (page - 1) * notificationsPerPage;
    setNotificationParams((prev) => ({ ...prev, offset: newOffset }));
  };

  return (
    <Wrapper>
      {/* Notifications List */}
      {isLoading ? (
        <NotificationsSkeleton />
      ) : (
        notifications?.map((item, index) => (
          <div key={item._id || index}>
            <NotificationsList
              notificationData={item}
              disableClick={true} // Disable click since we're already on the detail page
            />
          </div>
        ))
      )}

      {/* Empty state or pagination */}
      {isLoading ? null : notifications?.length === 0 ? (
        <LimitedParagraph
          align={"center"}
          sx={{ mt: 4, color: theme.palette.primary.gray }}
        >
          No notifications available for this campaign
        </LimitedParagraph>
      ) : (
        <SimplePaginationComp
          totalPage={totalPages}
          page={paginationNumber}
          onChange={(event, page) => paginateHandler(page)}
        />
      )}
    </Wrapper>
  );
};

export default CampaignNotificationsUI;
