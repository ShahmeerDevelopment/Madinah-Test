"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import { theme } from "@/config/customTheme";
import CustomTab from "./customDate/CustomDate";
import Presets from "./presetsDate/PresetsDate";
import { getDonationData } from "@/api";
import {
  calenderDateHandler,
  tabTypeHandler,
  savedDateRangeTypeHandler,
} from "@/store/slices/donorSlice";

const tabsValue = ["Presets", "Custom"];

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <BoxComponent sx={{ pt: 4 }}>{children}</BoxComponent>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export const CustomTabs = styled(Tabs)(() => ({
  "& .MuiTabs-indicator": {
    display: "none",

    // Hide the default indicator line
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
    backgroundColor: theme.palette.primary.main, // Background color for the selected tab
    color: theme.palette.primary.light,
    height: "40px",
    padding: "0px 24px",
    borderRadius: "32px",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
  },
}));

const DonationDateModal = ({
  setCalendarModal,
  setData,
  loading,
  setLoading,
}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(
    useSelector((state) =>
      state.donations.savedDateRangeType === "preset" ? 0 : 1
    )
  );

  const selectedDate = useSelector(
    (state) => state.donations.donationPresetsDate
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const temp = newValue === 0 ? "preset" : "custom";
    dispatch(tabTypeHandler(temp));
  };

  const getStatisticsFromBackend = async () => {
    setLoading(true);
    const endDate = selectedDate.endDate
      ? selectedDate.endDate
      : selectedDate.startDate;

    try {
      const response = await getDonationData(selectedDate.startDate, endDate);
      if (
        response.data.success === true ||
        response.data.message === "Success"
      ) {
        const res = response.data.data;
        const tableData = res.donations;

        const totalAmount = res.totalDonationAmount;
        const donationAmount = res.donationsCount;

        // Generate unique arrays from the new data
        const uniqueDonorNames = new Set(
          tableData.map((donation) => donation.donorName).filter((name) => name)
        );
        const uniqueDonorNamesArray = Array.from(uniqueDonorNames);

        const uniqueCampaigns = new Set(
          tableData
            .map((donation) =>
              donation.campaignId
                ? { id: donation.campaignId, title: donation.campaignTitle }
                : null
            )
            .filter(Boolean)
            .map(JSON.stringify)
        );
        const uniqueCampaignsArray = Array.from(uniqueCampaigns).map(
          JSON.parse
        );

        const uniqueDonorEmails = new Set(
          tableData
            .map((donation) => donation.donorEmail)
            .filter((email) => email)
        );
        const uniqueDonorEmailsArray = Array.from(uniqueDonorEmails);

        const uniqueGivingLevels = new Set(
          tableData
            .map((donation) => {
              if (donation.givingLevelId && donation.givingLevelTitle) {
                return `${donation.givingLevelTitle}`;
              }
              return null;
            })
            .filter((item) => item)
        );
        const uniqueGivingLevelsArray = Array.from(uniqueGivingLevels);

        dispatch(
          calenderDateHandler({
            startDate: selectedDate.startDate,
            endDate: endDate,
          })
        );
        dispatch(savedDateRangeTypeHandler(value === 0 ? "preset" : "custom"));
        setData((prevData) => ({
          ...prevData,
          tableData: tableData,
          totalAmount: totalAmount,
          numberOfDonations: donationAmount,
          uniqueDonorNames: uniqueDonorNamesArray,
          uniqueCampaigns: uniqueCampaignsArray,
          uniqueDonorEmails: uniqueDonorEmailsArray,
          uniqueGivingLevels: uniqueGivingLevelsArray,
        }));
        setCalendarModal(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StackComponent direction={"column"} alignItems="center">
      <CampaignHeading>Select a date range</CampaignHeading>
      <BoxComponent sx={{ marginTop: "16px !important" }}>
        <BoxComponent
          sx={{
            width: { xs: "100%", sm: "548px" },
            border: 1,
            borderRadius: "38px",
            p: 0.3,
            borderColor: theme.palette.primary.gray,
          }}
        >
          <CustomTabs
            variant="fullWidth"
            indicatorColor="primary"
            scrollButtons="auto"
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
        <CustomTabPanel value={value} index={0}>
          <Presets
            loading={loading}
            setCalendarModal={setCalendarModal}
            presetsHandler={getStatisticsFromBackend}
            selectedDate={selectedDate}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <CustomTab
            loading={loading}
            setCalendarModal={setCalendarModal}
            customHandler={getStatisticsFromBackend}
          />
        </CustomTabPanel>
      </BoxComponent>
    </StackComponent>
  );
};
DonationDateModal.propTypes = {
  setCalendarModal: PropTypes.func,
  setData: PropTypes.func,
  setLoading: PropTypes.func,
  loading: PropTypes.bool,
};
export default DonationDateModal;
