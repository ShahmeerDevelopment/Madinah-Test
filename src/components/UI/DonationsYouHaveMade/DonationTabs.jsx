"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import Tab from "@mui/material/Tab";

import { CustomTabs } from "./style";
import { theme } from "@/config/customTheme";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CustomTabPanel from "@/components/molecules/Tabs/CustomTabPanel";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import StackComponent from "@/components/atoms/StackComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import SimpleTableContainer from "@/components/molecules/table/simpleTable/SimpleTableContainer";
import HistoryTable from "./HistoryTable";
import { useRouter } from "next/navigation";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function DonationTabs({
  onTabChange,
  error,
  isError,
  data,
  isLoading,
  setSortBy,
  setOffSet,
  setPerPageLimit,
}) {
  const router = useRouter();
  const { isMobile } = useResponsiveScreen();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onTabChange) {
      onTabChange(newValue); // Invoke the callback with the new tab value
    }
  };
  const TABS_VALUE = ["Recurring donations", "Donation history"];

  return (
    <BoxComponent sx={{ width: "100%", mb: 2 }}>
      <StackComponent justifyContent="space-between" alignItems="center">
        <BoxComponent
          sx={{
            width: { xs: "327px", sm: "327px" },
            border: 1,
            borderRadius: "38px",
            p: 0.2,
            borderColor: theme.palette.primary.gray,
          }}
        >
          <CustomTabs
            variant={isMobile ? "fullWidth" : "scrollable"}
            scrollButtons={false}
            indicatorColor="primary"
            textColor="inherit"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {TABS_VALUE.map((item, index) => (
              <Tab key={index} label={item} {...a11yProps(index)} />
            ))}
          </CustomTabs>
        </BoxComponent>
        <BoxComponent
          sx={{
            display: { xs: "block", sm: "block" },
            position: { xs: "absolute", sm: "relative" },
            top: { xs: "53px", sm: "unset" },
            right: { xs: "30px", sm: "unset" },
          }}
        >
          <ButtonComp
            size="normal"
            variant="outlined"
            height="34px"
            padding="10px 19px 8px 19px"
            sx={{ width: "84px" }}
            onClick={() => router.push("your-donations/receipt")}
          >
            Receipts
          </ButtonComp>
        </BoxComponent>
      </StackComponent>
      <CustomTabPanel value={value} index={0}>
        {isError ? (
          <p>Error: {error.message} </p>
        ) : (
          <SimpleTableContainer
            tableName={
              value === 0 ? "recurring_table" : "donation_history_table"
            }
            data={data?.payments}
            totalRows={data?.totalPaymentsCount}
            setSortBy={setSortBy}
            setOffSet={setOffSet}
            setPerPageLimit={setPerPageLimit}
            isLoading={isLoading}
            isNext={true}
          />
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <HistoryTable tableName="donation_history_table" />
      </CustomTabPanel>
    </BoxComponent>
  );
}
DonationTabs.propTypes = {
  onTabChange: PropTypes.func,
  error: PropTypes.any,
  isError: PropTypes.bool,
  data: PropTypes.any,
  isLoading: PropTypes.bool,
  setSortBy: PropTypes.func,
  setOffSet: PropTypes.func,
  setPerPageLimit: PropTypes.func,
};
