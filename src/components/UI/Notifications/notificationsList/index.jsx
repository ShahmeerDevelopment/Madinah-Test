"use client";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import Image from "@/components/atoms/imageComponent/Image";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
import { BOX_SHADOW_STYLE } from "@/config/constant";
import { theme } from "@/config/customTheme";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { getVideoThumbnail } from "@/utils/helpers";
import NextImage from "next/image";
import { ASSET_PATHS } from "@/utils/assets";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

const NotificationsList = ({
  notificationData,
  campaignData,
  disableClick = false,
}) => {
  // Support both notification data and campaign data for backward compatibility
  const data = notificationData || campaignData;
  const router = useRouter();

  // Extract campaign data from the nested structure
  const campaignInfo = data?.campaign || data;

  const [thumbnailUrl, setThumbnailUrl] = useState(
    campaignInfo?.coverImageUrl || ASSET_PATHS.images.placeholder
  );
  const { isSmallScreen } = useResponsiveScreen();

  useEffect(() => {
    const fetchThumbnail = async () => {
      const coverImage = campaignInfo?.coverImageUrl;
      const videoLinks = campaignInfo?.videoLinks;

      if (!coverImage && videoLinks?.[0]?.url) {
        const thumbnail = await getVideoThumbnail(videoLinks[0].url);
        setThumbnailUrl(thumbnail);
      }
    };

    fetchThumbnail();
  }, [campaignInfo]);

  const validThumbnailUrl = thumbnailUrl || ASSET_PATHS.images.placeholder;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "1 min ago";
    try {
      return dayjs(dateString).fromNow();
    } catch {
      return "1 min ago";
    }
  };

  // Extract notification-specific data from the new response structure
  const campaignTitle = campaignInfo?.title || "Unknown Campaign";
  const notificationHeading = data?.heading || "Notification";
  const message = data?.label || "Admin rejected the campaign";
  const createdAt = formatDate(data?.createdAt || data?.timestamp);
  const coverImageUrl = campaignInfo?.coverImageUrl;
  const isUnreadMessageExist = data?.isUnreadMessageExist || false;

  // Handle click to navigate to campaign-specific notifications
  const handleCardClick = () => {
    if (!disableClick && campaignInfo?._id) {
      router.push(`/notifications/${campaignInfo._id}`);
    }
  };

  console.log("NotificationData", data);
  console.log("isUnreadMessageExist", isUnreadMessageExist);

  return (
    <BoxComponent
      onClick={handleCardClick}
      sx={{
        height: { xs: "208px", sm: "132px" },
        borderRadius: "32px",
        padding: { xs: "16px", sm: "35px" },
        backgroundColor: theme.palette.primary.light,
        mb: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "space-between",
        boxShadow: BOX_SHADOW_STYLE,
        cursor: !disableClick && campaignInfo?._id ? "pointer" : "default",
        "&:hover": {
          backgroundColor:
            !disableClick && campaignInfo?._id
              ? "#f5f5f5"
              : theme.palette.primary.light,
        },
      }}
    >
      <BoxComponent
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          height: "60px",
          justifyContent: { xs: "flex-start", sm: "space-between" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1, sm: 3 },
          boxSizing: "border-box",
        }}
      >
        <BoxComponent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 3 },
            order: { xs: 2, sm: 1 },
            height: "60px",
            width: "100%",
          }}
        >
          <BoxComponent
            sx={{
              minWidth: "92px",
              maxWidth: "92px",
              height: "60px",
              display: { xs: "none", sm: "block" },
            }}
          >
            {coverImageUrl ? (
              <Image
                source={validThumbnailUrl}
                alt="campaign_image"
                width="100%"
                height="100%"
                borderRadius="12px"
                objectFit="cover"
              />
            ) : (
              <NextImage
                src={validThumbnailUrl}
                alt="campaign_image"
                width="92"
                height="58"
                style={{ borderRadius: "12px", objectFit: "cover" }}
              />
            )}
          </BoxComponent>

          <div style={{ width: "100%" }}>
            <LimitedParagraph
              align="left"
              fontSize={isSmallScreen ? "22px" : "32px"}
              line={1}
              fontWeight={500}
              sx={{
                lineHeight: { xs: "22px", sm: "38px" },
                mt: 0.3,
                mb: 0.3,
                color: theme.palette.primary.dark,
                wordBreak: "break-all",
                overflowWrap: "break-word",
              }}
            >
              {campaignTitle}
            </LimitedParagraph>
            <LimitedParagraph
              fontSize={"16px"}
              sx={{
                color: theme.palette.primary.darkGray,
                mb: 0.5,
                fontWeight: 400,
              }}
            >
              {notificationHeading}
            </LimitedParagraph>
            <LimitedParagraph
              fontSize={"14px"}
              sx={{ color: theme.palette.primary.gray }}
            >
              {message}
            </LimitedParagraph>
            <LimitedParagraph
              fontSize={"12px"}
              sx={{ color: theme.palette.primary.gray }}
            >
              {createdAt}
            </LimitedParagraph>
          </div>
        </BoxComponent>
        <BoxComponent
          className="menu-items"
          sx={{
            width: { xs: "100%", sm: "auto" },
            display: "flex",
            alignItems: "flex-end",
            order: { xs: 1, sm: 2 },
            gap: 1.5,
            mb: { xs: 0, sm: -1.5 },
          }}
        >
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              width: { xs: "100%", sm: "auto" },
              gap: 1,
              mb: { xs: 0.6, sm: 0 },
            }}
          >
            <BoxComponent
              sx={{
                minWidth: "92px",
                maxWidth: "92px",
                height: "60px",
                display: { xs: "block", sm: "none" },
                marginBottom: "10px",
              }}
            >
              <Image
                source={validThumbnailUrl}
                alt="campaign_image"
                width="100%"
                height="100%"
                borderRadius="12px"
                objectFit="cover"
              />
            </BoxComponent>
            <BoxComponent
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {/* Red round chip - only show if unread messages exist */}
              {isUnreadMessageExist && (
                <BoxComponent
                  sx={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#ff4444",
                    borderRadius: "50%",
                    border: "2px solid #ffffff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
              )}
            </BoxComponent>
          </BoxComponent>
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
};

export default NotificationsList;
