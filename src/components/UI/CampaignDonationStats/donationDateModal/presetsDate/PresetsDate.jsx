"use client";

import React, { memo } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import StackComponent from "@/components/atoms/StackComponent";
import GridComp from "@/components/atoms/GridComp/GridComp";
import { CARDS_DATA } from "@/components/UI/Statistics/constant";

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
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns";
import { donationPresetsDateHandler } from "@/store/slices/donorSlice";

const PresetsDate = memo(({ presetsHandler, loading, selectedDate }) => {
  const dispatch = useDispatch();

  const onClickHandler = (index, value) => {
    // setSelectedCard({ index, value }); // Create a new object to update the state
    handleDateDisplay(value);
  };

  const updateButtonHandler = () => presetsHandler();

  const today = format(startOfToday(), "yyyy-MM-dd");

  const handleDateDisplay = (value) => {
    let startDate, endDate;
    switch (value) {
      case "today":
        {
          const today = format(startOfToday(), "yyyy-MM-dd");
          dispatch(
            donationPresetsDateHandler({
              startDate: today,
              endDate: undefined,
              value: "today",
              name: "Today",
              index: 0,
            })
          );
        }
        break;

      case "yesterday":
        {
          const yesterday = format(subDays(startOfToday(), 1), "yyyy-MM-dd");
          dispatch(
            donationPresetsDateHandler({
              startDate: yesterday,
              endDate: undefined,
              value: "yesterday",
              name: "Yesterday",
              index: 1,
            })
          );
        }
        break;

      case "week_to_date":
        {
          startDate = format(startOfWeek(new Date()), "yyyy-MM-dd");
          endDate = format(startOfToday(), "yyyy-MM-dd");
          dispatch(
            donationPresetsDateHandler({
              startDate,
              endDate,
              value: "week-to-date",
              name: "Week to Date",
              index: 2,
            })
          );
        }
        break;

      case "last_week":
        startDate = format(subDays(startOfWeek(new Date()), 7), "yyyy-MM-dd");
        endDate = format(subDays(endOfWeek(new Date()), 7), "yyyy-MM-dd");
        dispatch(
          donationPresetsDateHandler({
            startDate,
            endDate,
            value: "last-week",
            name: "Last Week",
            index: 3,
          })
        );
        break;

      case "month_to_date":
        startDate = format(startOfMonth(new Date()), "yyyy-MM-dd");
        endDate = format(startOfToday(), "yyyy-MM-dd");
        dispatch(
          donationPresetsDateHandler({
            startDate,
            endDate,
            value: "month-to-date",
            name: "Month to Date",
            index: 4,
          })
        );
        break;

      case "last_month":
        startDate = format(
          startOfMonth(subDays(startOfMonth(new Date()), 1)),
          "yyyy-MM-dd"
        );
        endDate = format(
          endOfMonth(subDays(startOfMonth(new Date()), 1)),
          "yyyy-MM-dd"
        );
        dispatch(
          donationPresetsDateHandler({
            startDate,
            endDate,
            value: "last-month",
            name: "Last Month",
            index: 5,
          })
        );
        break;
      case "quarter_to_date":
        startDate = format(startOfQuarter(new Date()), "yyyy-MM-dd");
        endDate = format(startOfToday(), "yyyy-MM-dd");
        dispatch(
          donationPresetsDateHandler({
            startDate,
            endDate,
            value: "quarter-to-date",
            name: "Month to Date",
            index: 6,
          })
        );
        break;

      case "last_quarter":
        {
          let currentQuarterStart = startOfQuarter(new Date());
          startDate = format(
            startOfQuarter(subDays(currentQuarterStart, 1)),
            "yyyy-MM-dd"
          );
          endDate = format(
            endOfQuarter(subDays(currentQuarterStart, 1)),
            "yyyy-MM-dd"
          );
          dispatch(
            donationPresetsDateHandler({
              startDate,
              endDate,
              value: "last-quarter",
              name: "Last Quarter",
              index: 7,
            })
          );
        }
        break;

      case "year_to_date":
        startDate = format(startOfYear(new Date()), "yyyy-MM-dd");
        endDate = format(startOfToday(), "yyyy-MM-dd");
        dispatch(
          donationPresetsDateHandler({
            startDate,
            endDate,
            value: "year-to-date",
            name: "Year to Date",
            index: 8,
          })
        );
        break;

      case "last_year":
        startDate = format(
          startOfYear(subDays(startOfYear(new Date()), 1)),
          "yyyy-MM-dd"
        );
        endDate = format(
          endOfYear(subDays(startOfYear(new Date()), 1)),
          "yyyy-MM-dd"
        );
        dispatch(
          donationPresetsDateHandler({
            startDate,
            endDate,
            value: "last-year",
            name: "Last Year",
            index: 9,
          })
        );
        break;
      case "lifetime":
        startDate = "2024-01-01";
        endDate = today;
        dispatch(
          donationPresetsDateHandler({
            startDate,
            endDate,
            value: "lifetime",
            name: "Lifetime",
            index: 10,
          })
        );
        break;

      default: {
        const today = format(startOfToday(), "yyyy-MM-dd");
        dispatch(
          donationPresetsDateHandler({
            startDate: today,
            endDate: undefined,
            value: "today",
            name: "Today",
            index: 0,
          })
        );
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
                  selectedDate.index === index
                    ? theme.palette.primary.main
                    : theme.palette.primary.lightGray
                } `,
              }}
            >
              <Paragraph
                textColor={
                  selectedDate.index === index
                    ? theme.palette.primary.dark
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
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <ButtonComp
          disabled={selectedDate.index === null ? true : false}
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
});
PresetsDate.propTypes = {
  presetsHandler: PropTypes.func,
  loading: PropTypes.bool,
  selectedDate: PropTypes.any,
};
PresetsDate.displayName = "PresetsDate";
export default PresetsDate;
