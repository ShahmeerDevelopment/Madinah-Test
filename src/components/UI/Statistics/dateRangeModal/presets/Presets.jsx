"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import GridComp from "@/components/atoms/GridComp/GridComp";
import { CARDS_DATA } from "../constant";
import { theme } from "@/config/customTheme";
import {
  format,
  startOfToday,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
} from "date-fns";

import StackComponent from "@/components/atoms/StackComponent";
import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { useSelector } from "react-redux";

const Presets = ({
  presetsHandler,
  loading,
  // selectedDate,
  // selectedDateHandler = () => {},
}) => {
  const previousSelection = useSelector(
    (state) => state.statistics.currentDate
  );


  const [dates, setDates] = useState({
    startDate: previousSelection.startDate,
    endDate: previousSelection.endDate,
    value: previousSelection.value,
    name: previousSelection.name,
    index: previousSelection.index,
  });

  // useEffect(() => {
  //   selectedDateHandler(dates);
  // }, [dates]);

  const updateButtonHandler = () => {
    // dispatch(
    //   presetsDateHandler({
    //     startDate: dates.startDate,
    //     endDate: dates.endDate,
    //     value: dates.value,
    //     name: dates.name,
    //     index: dates.index,
    //   }),
    // );
    presetsHandler(dates);
  };

  // useEffect(() => {
  //   if (selectedDate.index === dates.index) {
  //     setDates({
  //       startDate: "",
  //       endDate: "",
  //       value: "",
  //       name: "",
  //       index: "",
  //     });
  //     presetsHandler();
  //   }
  // }, [selectedDate]);

  const onClickHandler = (index, value) => handleDateDisplay(value);

  const handleDateDisplay = (value) => {
    let startDate, endDate; // Declare variables outside the switch to use them across multiple cases if needed
    switch (value) {
      case "today": {
        const today = format(startOfToday(), "yyyy-MM-dd");
        setDates({
          startDate: today,
          endDate: undefined,
          value: "today",
          name: "Today",
          index: 0,
        });
        break;
      }

      case "yesterday": {
        const yesterday = format(subDays(startOfToday(), 1), "yyyy-MM-dd");
        setDates({
          startDate: yesterday,
          endDate: undefined,
          value: "yesterday",
          name: "Yesterday",
          index: 1,
        });
        break;
      }

      case "week_to_date": {
        startDate = format(startOfWeek(new Date()), "yyyy-MM-dd");
        endDate = format(startOfToday(), "yyyy-MM-dd");
        setDates({
          startDate,
          endDate,
          value: "week-to-date",
          name: "Week to Date",
          index: 2,
        });
        break;
      }

      case "last_week": {
        startDate = format(subDays(startOfWeek(new Date()), 7), "yyyy-MM-dd");
        endDate = format(subDays(endOfWeek(new Date()), 7), "yyyy-MM-dd");
        setDates({
          startDate,
          endDate,
          value: "last-week",
          name: "Last Week",
          index: 3,
        });
        break;
      }

      case "month_to_date": {
        startDate = format(startOfMonth(new Date()), "yyyy-MM-dd");
        endDate = format(startOfToday(), "yyyy-MM-dd");
        setDates({
          startDate,
          endDate,
          value: "month-to-date",
          name: "Month to Date",
          index: 4,
        });
        break;
      }

      case "last_month": {
        startDate = format(
          startOfMonth(subDays(startOfMonth(new Date()), 1)),
          "yyyy-MM-dd"
        );
        endDate = format(
          endOfMonth(subDays(startOfMonth(new Date()), 1)),
          "yyyy-MM-dd"
        );
        setDates({
          startDate,
          endDate,
          value: "last-month",
          name: "Last Month",
          index: 5,
        });
        break;
      }

      case "quarter_to_date": {
        startDate = format(startOfQuarter(new Date()), "yyyy-MM-dd");
        endDate = format(startOfToday(), "yyyy-MM-dd");
        setDates({
          startDate,
          endDate,
          value: "quarter-to-date",
          name: "Quarter to Date",
          index: 6,
        });
        break;
      }

      default: {
        const today = format(startOfToday(), "yyyy-MM-dd");
        setDates({
          startDate: today,
          endDate: undefined,
          value: "today",
          name: "Today",
          index: 0,
        });
      }
    }
  };

  return (
    <div>
      <GridComp container columnSpacing={3} rowSpacing={1}>
        {CARDS_DATA.map((item, index) => (
          <GridComp item key={item._id} xs={6}>
            <BoxComponent
              onClick={() => onClickHandler(index, item.value)}
              sx={{
                width: "100%",
                height: "44px",
                borderRadius: "14px",
                padding: "12px 16px",
                cursor: "pointer",
                border: `1px solid ${
                  // dates.index !== undefined &&
                  // dates.index !== null &&
                  // dates.index !== ""
                  //   ? dates.index === index
                  //     ? theme.palette.primary.main
                  //     : theme.palette.primary.lightGray
                  //   : selectedDate.index === index
                  //     ? theme.palette.primary.main
                  //     : theme.palette.primary.lightGray
                  dates.index !== undefined &&
                    dates.index !== null &&
                    dates.index !== ""
                    ? dates.index === index
                      ? theme.palette.primary.main
                      : theme.palette.primary.lightGray
                    : theme.palette.primary.lightGray
                  }`,
              }}
            >
              <Paragraph
                // textColor={
                //   dates.index !== undefined &&
                //   dates.index !== null &&
                //   dates.index !== ""
                //     ? dates.index === index
                //       ? theme.palette.primary.dark
                //       : theme.palette.primary.gray
                //     : selectedDate.index === index
                //       ? theme.palette.primary.dark
                //       : theme.palette.primary.gray
                // }
                textColor={
                  dates.index !== undefined &&
                    dates.index !== null &&
                    dates.index !== ""
                    ? dates.index === index
                      ? theme.palette.primary.dark
                      : theme.palette.primary.gray
                    : theme.palette.primary.gray
                }
              >
                {item.name}
              </Paragraph>
            </BoxComponent>
          </GridComp>
        ))}
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
          disabled={dates.index === null ? true : false}
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
Presets.propTypes = {
  presetsHandler: PropTypes.func,
  loading: PropTypes.bool,
  // selectedDate: PropTypes.any,
  // selectedDateHandler: PropTypes.func,
};

export default Presets;
