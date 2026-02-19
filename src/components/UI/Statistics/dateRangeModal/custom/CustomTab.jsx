"use client";

import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useState } from "react";
import DatePickerComp from "@/components/molecules/datePicker/DatePickerComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import GridComp from "@/components/atoms/GridComp/GridComp";
import CalendarIcon from "../../icons/CalendarIcon";
import StackComponent from "@/components/atoms/StackComponent";
import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { useSelector } from "react-redux";

const CustomTab = ({ customHandler = () => { }, loading }) => {
  const calenderDate = useSelector((state) => state.statistics.calenderDate);
  const minDate = dayjs().subtract(3, "month");
  const [isError, setIsError] = useState(false);
  const [isFromError, setIsFromError] = useState(false);
  const endDate =
    calenderDate.endDate !== undefined
      ? calenderDate.endDate
      : calenderDate.startDate;
  const [selectedStartDate, setSelectedStartDate] = useState(
    dayjs(calenderDate.startDate),
  );
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs(endDate));

  const handleStartDate = (newDate) => setSelectedStartDate(newDate);
  const handleEndDate = (newDate) => setSelectedEndDate(newDate);

  const updateButtonHandler = () => {
    const temp = {
      startDate: selectedStartDate.format("YYYY-MM-DD"),
      endDate: selectedEndDate.format("YYYY-MM-DD"),
      value: "",
    };
    customHandler(temp);
  };

  return (
    <div>
      <GridComp
        container
        columnSpacing={3}
        rowSpacing={1}
        mb={{ xs: 15, sm: 4 }}
      >
        <GridComp item xs={12} sm={6}>
          <DatePickerComp
            value={selectedStartDate}
            onChange={handleStartDate}
            setIsError={setIsFromError}
            isError={isFromError}
            label="From"
            format="MM/DD/YYYY"
            icon={CalendarIcon}
            isRequired={false}
            textColor={"#A1A1A8"}
            displayIsError={false}
            width="100%"
            minDate={minDate}
            disableFuture={true}
          />
        </GridComp>
        <GridComp item xs={12} sm={6}>
          <DatePickerComp
            value={selectedEndDate}
            onChange={handleEndDate}
            setIsError={setIsError}
            isError={isError}
            label="To"
            format="MM/DD/YYYY"
            icon={CalendarIcon}
            isRequired={false}
            textColor={"#A1A1A8"}
            displayIsError={false}
            width="100%"
            minDate={minDate}
            disableFuture={true}
          />
        </GridComp>
      </GridComp>
      <BoxComponent
        sx={{
          width: "100%",
          mt: 3,
          mb: 3,
          display: "flex",
          flexDirection: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      </BoxComponent>
      <BoxComponent
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <ButtonComp
          disabled={isError || isFromError}
          height="46px"
          size="normal"
          sx={{ width: { xs: "100%", sm: "166px" } }}
          onClick={updateButtonHandler}
        >
          {loading ? (
            <StackComponent alignItems="center" component="span">
              <CircularLoader color="white" size="20px" />
              <TypographyComp>Updating...</TypographyComp>
            </StackComponent>
          ) : (
            "Update"
          )}
        </ButtonComp>
      </BoxComponent>
    </div>
  );
};
CustomTab.propTypes = {
  customHandler: PropTypes.func,
  loading: PropTypes.bool,
};

export default CustomTab;
