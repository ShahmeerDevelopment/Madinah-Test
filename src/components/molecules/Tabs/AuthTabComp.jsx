"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import Tab from "@mui/material/Tab";
import { theme } from "@/config/customTheme";
import { CustomTabs } from "./TabComp.style";
import UserDetails from "@/components/UI/AccountSettings/userDetails";
import CustomTabPanel from "./CustomTabPanel";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import Notifications from "@/components/UI/AccountSettings/notifications";
import SaveCards from "@/components/UI/AccountSettings/saveCards";
import MemoizedSettings from "@/components/UI/AccountSettings/campaignSettings";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function BasicTabs({
  singleCampaignDetails,
  tabSearch,
  isEdit,
  openEditModal,
  setIsEdit,
  setOpenEditModal,
  onTabChange,
}) {
  const getTabValue = () => {
    if (tabSearch === "settings") {
      return 1;
    }
    if (tabSearch === "givingLevel") {
      return 2;
    }
    return 0;
  };
  const [value, setValue] = useState(getTabValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onTabChange) {
      onTabChange(newValue); // Invoke the callback with the new tab value
    }
  };
  const tabsValue = [
    "Account",
    "Notifications",
    "Saved cards",
    "Campaign Settings",
  ];

  return (
    <BoxComponent sx={{ width: "100%", mb: 2 }}>
      <BoxComponent>
        <BoxComponent
          sx={{
            maxWidth: "95%",
            width: { xs: "100%", sm: "542px" },
            border: 1,
            borderRadius: "38px",
            p: 0.2,
            borderColor: theme.palette.primary.gray,
          }}
        >
          <CustomTabs
            variant="scrollable"
            scrollButtons={false}
            indicatorColor="primary"
            textColor="inherit"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {tabsValue.map((item, index) => (
              <Tab
                key={index}
                // wrapped={true}
                label={item}
                {...a11yProps(index)}
              />
            ))}
          </CustomTabs>
        </BoxComponent>
      </BoxComponent>
      <CustomTabPanel value={value} index={0}>
        <UserDetails singleCampaignDetails={singleCampaignDetails} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Notifications />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SaveCards
          isEdit={isEdit}
          openEditModal={openEditModal}
          setIsEdit={setIsEdit}
          setOpenEditModal={setOpenEditModal}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <MemoizedSettings />
      </CustomTabPanel>
    </BoxComponent>
  );
}
BasicTabs.propTypes = {
  handleAction: PropTypes.any,
  singleCampaignDetails: PropTypes.object,
  tabSearch: PropTypes.any,
  isEdit: PropTypes.any,
  openEditModal: PropTypes.any,
  setIsEdit: PropTypes.any,
  setOpenEditModal: PropTypes.any,
  onTabChange: PropTypes.any,
};
