"use client";

import { Wrapper } from "./style";
// import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import NotificationsSkeleton from "./skeleton/NotificationsSkeleton";
import NotificationsList from "./notificationsList";
import { useGetNotificationsList } from "@/api";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
import SimplePaginationComp from "@/components/molecules/paginationComp/SimplePaginationComp";
import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { theme } from "@/config/customTheme";

// Custom styled tabs component
const CustomTabs = styled(Tabs)(() => ({
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .MuiTab-root": {
    textTransform: "capitalize",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
    color: theme.palette.primary.darkGray,
    padding: "0px 24px",
  },
  "& .MuiTab-root.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.light,
    height: "40px",
    padding: "0px 24px",
    borderRadius: "32px",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
  },
}));

// Tab panel component
function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <BoxComponent sx={{ pt: 2 }}>{children}</BoxComponent>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const NotificationsUI = () => {
  //   const { isSmallScreen } = useResponsiveScreen();
  const notificationsPerPage = 10;
  const [tabValue, setTabValue] = useState(0);
  const [paginationNumber, setPaginationNumber] = useState(1);

  // State for campaign-wise notifications
  const [campaignNotificationParams, setCampaignNotificationParams] = useState({
    limit: notificationsPerPage,
    offset: 0,
    type: "campaign-wise",
    campaignId: "",
  });

  // State for general notifications
  const [generalNotificationParams, setGeneralNotificationParams] = useState({
    limit: notificationsPerPage,
    offset: 0,
    type: "general",
    campaignId: "",
  });

  // Get notifications based on current tab
  const currentParams =
    tabValue === 0 ? campaignNotificationParams : generalNotificationParams;

  const {
    data: notificationListResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetNotificationsList(
    currentParams.limit,
    currentParams.offset,
    currentParams.type,
    currentParams.campaignId,
  );

  // Set up polling every minute (60000 ms)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      refetch();
    }, 60000);

    return () => clearInterval(pollInterval);
  }, [refetch, tabValue]); // Include tabValue to restart polling when tab changes

  if (isError) return <p>Error: {error.message}</p>;

  const notificationData = notificationListResponse?.data?.data;
  const notifications = notificationData?.notifications || [];
  const totalNotifications = notificationData?.total || 0;
  const totalPages = Math.ceil(totalNotifications / notificationsPerPage);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPaginationNumber(1); // Reset pagination when switching tabs

    // Reset offsets when switching tabs
    if (newValue === 0) {
      setCampaignNotificationParams((prev) => ({ ...prev, offset: 0 }));
    } else {
      setGeneralNotificationParams((prev) => ({ ...prev, offset: 0 }));
    }
  };

  const paginateHandler = (page) => {
    setPaginationNumber(page);
    const newOffset = (page - 1) * notificationsPerPage;

    if (tabValue === 0) {
      setCampaignNotificationParams((prev) => ({ ...prev, offset: newOffset }));
    } else {
      setGeneralNotificationParams((prev) => ({ ...prev, offset: newOffset }));
    }
  };

  const tabsValue = ["Campaigns", "All"];

  return (
    <Wrapper>
      {/* Tabs Section */}
      <BoxComponent sx={{ mb: 3 }}>
        <BoxComponent
          sx={{
            width: { xs: "100%", sm: "300px" },
            border: 1,
            borderRadius: "38px",
            p: 0.3,
            borderColor: theme.palette.primary.gray,
          }}
        >
          <CustomTabs
            variant="fullWidth"
            indicatorColor="primary"
            value={tabValue}
            onChange={handleTabChange}
            aria-label="notification tabs"
          >
            {tabsValue.map((item, index) => (
              <Tab key={index} label={item} {...a11yProps(index)} />
            ))}
          </CustomTabs>
        </BoxComponent>
      </BoxComponent>

      {/* Tab Panels */}
      <CustomTabPanel value={tabValue} index={0}>
        {/* Campaign Notifications Tab Content */}
        {isLoading ? (
          <NotificationsSkeleton />
        ) : (
          notifications?.map((item, index) => (
            <div key={item._id || index}>
              <NotificationsList notificationData={item} />
            </div>
          ))
        )}
        {isLoading ? null : notifications?.length === 0 ? (
          <LimitedParagraph
            align={"center"}
            sx={{ mt: 2, color: theme.palette.primary.gray }}
          >
            No campaign notifications available
          </LimitedParagraph>
        ) : (
          <SimplePaginationComp
            totalPage={totalPages}
            page={paginationNumber}
            onChange={(event, page) => paginateHandler(page)}
          />
        )}
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        {/* General Notifications Tab Content */}
        {isLoading ? (
          <NotificationsSkeleton />
        ) : (
          notifications?.map((item, index) => (
            <div key={item._id || index}>
              <NotificationsList notificationData={item} />
            </div>
          ))
        )}
        {isLoading ? null : notifications?.length === 0 ? (
          <LimitedParagraph
            align={"center"}
            sx={{ mt: 4, color: theme.palette.primary.gray }}
          >
            No general notifications available
          </LimitedParagraph>
        ) : (
          <SimplePaginationComp
            totalPage={totalPages}
            page={paginationNumber}
            onChange={(event, page) => paginateHandler(page)}
          />
        )}
      </CustomTabPanel>
    </Wrapper>
  );
};

export default NotificationsUI;
