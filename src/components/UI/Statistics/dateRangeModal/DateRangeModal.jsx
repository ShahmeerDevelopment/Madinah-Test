"use client";

import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";

import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import { theme } from "@/config/customTheme";
// import { getAllStatistics } from "@/api";
import CustomTab from "./custom/CustomTab";
import Presets from "./presets/Presets";
import {
  calenderDateHandler,
  currentDateHandler,
  dateRangeTypeHandler,
  savedDateRangeTypeHandler,
} from "@/store/slices/statisticsSlice";
import { useDispatch } from "react-redux";
// import { useRouter } from "next/router";

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

const DateRangeModal = ({ setCalendarModal }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(
    useSelector((state) =>
      state.statistics.savedDateRangeType === "preset" ? 0 : 1
    )
  );
  const [loading, setLoading] = useState(false);

  // const selectedDate = useSelector((state) => state.statistics.presetsDate);
  const previousPeriod = useSelector(
    (state) => state.statistics.comparePreviousPeriod
  );
  // const router = useRouter;
  // let id;
  // let referralToken;
  // if (router.query) {
  //   id = router.query.id;
  //   referralToken = router.query.referralToken;
  // }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const temp = newValue === 0 ? "preset" : "custom";
    dispatch(dateRangeTypeHandler(temp));
  };

  const getStatisticsFromBackend = async (values) => {
    setLoading(true);
    // selectedDateHandler(values);
    const endDate = values.endDate ? values.endDate : values.startDate;
    // const payload = {
    //   startDate: values.startDate,
    //   endDate: endDate,
    //   value: values.value,
    //   previousPeriod: previousPeriod,
    //   id: id || null,
    //   referralToken: referralToken || null,
    // };
    try {
      // const response = await getAllStatistics(payload);
      // if (
      //   response.data.success === true &&
      //   response.data.message === "Success"
      // ) {
      setCalendarModal(false);
      // setData(response.data.data);
      dispatch(
        calenderDateHandler({
          startDate: values.startDate,
          endDate: endDate,
        })
      );
      dispatch(savedDateRangeTypeHandler(value === 0 ? "preset" : "custom"));
      dispatch(
        currentDateHandler({
          startDate: values.startDate,
          endDate: endDate,
          value: values.value,
          periodTypes: previousPeriod,
          name: values.name,
          index: values.index || 0,
        })
      );
      // }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("error", error);
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
            // selectedDate={selectedDate}
            // selectedDateHandler={selectedDateHandler}
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
DateRangeModal.propTypes = {
  setCalendarModal: PropTypes.func,
  setData: PropTypes.func,
  // selectedDateHandler: PropTypes.func,
};
export default DateRangeModal;
