"use client";

import React, { memo, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import StackComponent from "../../atoms/StackComponent";
import CalenderIcon from "../../../assets/iconComponent/CalenderIcon";
import PropTypes from "prop-types";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const DatePickerComp = memo(
  ({
    value,
    onChange,
    label = "Date of birth",
    isLabel = true,
    isError,
    format = "DD.MM.YYYY",
    setIsError = () => console.error("Error set"),
    isRequired = true,
    icon = CalenderIcon,
    textColor = "rgb(40% 40% 40%)",
    width = "49.2%",
    disableFuture = true,
    minDate,
    open,
    onClose,
    ...sx
  }) => {
    const [view, setView] = useState("day");

    const errorHandler = (error) => {
      if (error === "invalidDate" || error === "disableFuture") {
        setIsError(true);
      } else {
        setIsError(false);
      }
    };

    const handleDateChange = (newDate) => {
      // Ensure we preserve the exact date selected without timezone conversion
      // Create a new dayjs object with just the date components
      const localDate = newDate ? newDate.clone().hour(12).minute(0).second(0).millisecond(0) : null;

      onChange(localDate);

      // Progress to next view after selection
      if (view === "year") {
        setView("month");
      } else if (view === "month") {
        setView("day");
      }
    };

    const handleViewChange = (newView) => {
      setView(newView);
    };

    return (
      <div>
        <StackComponent
          spacing="4px"
          direction="column"
          alignItems="flex-start"
          sx={{ width: { xs: "100%", sm: width } }}
        >
          {isLabel ? (
            <label
              htmlFor="datepicker"
              style={{
                color: "#A1A1A8",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              {label}
              {isRequired ? "*" : null}
            </label>
          ) : null}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              open={open}
              onClose={onClose}
              disableFuture={disableFuture}
              minDate={minDate}
              htmlFor="datepicker"
              onError={errorHandler}
              value={value}
              onChange={handleDateChange}
              slotProps={{
                desktopPaper: {
                  sx: {
                    "& .MuiPickersDay-root.Mui-selected": {
                      backgroundColor: "#6363E6 !important",
                      color: "#ffffff !important",
                      "&:hover": {
                        backgroundColor: "#6363E6 !important",
                      },
                      "&:focus": {
                        backgroundColor: "#6363E6 !important",
                      },
                    },
                    "& .MuiPickersYear-yearButton.Mui-selected": {
                      backgroundColor: "#6363E6 !important",
                      color: "#ffffff !important",
                    },
                    "& .MuiPickersMonth-monthButton.Mui-selected": {
                      backgroundColor: "#6363E6 !important",
                      color: "#ffffff !important",
                    },
                  },
                },
              }}
              format={format}
              slots={{ openPickerIcon: icon }}
              views={["year", "month", "day"]}
              openTo="day"
              view={view}
              onViewChange={handleViewChange}
              sx={{
                borderRadius: "16px",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  width: "100%",
                  height: "42px",
                  color: textColor,
                },
                "& .MuiPickersCalendarHeader-label": {
                  cursor: "pointer",
                },
                ...sx,
              }}
            />
          </LocalizationProvider>
          {isError && (
            <p style={{ color: "red", fontSize: "11px" }}>Required field</p>
          )}
        </StackComponent>
      </div>
    );
  }
);

DatePickerComp.displayName = "DatePickerComp";
DatePickerComp.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  label: PropTypes.string,
  isLabel: PropTypes.bool,
  sx: PropTypes.object,
  isError: PropTypes.bool,
  setIsError: PropTypes.func,
  format: PropTypes.string,
  icon: PropTypes.any,
  isRequired: PropTypes.bool,
  textColor: PropTypes.string,
  width: PropTypes.string,
  disableFuture: PropTypes.bool,
  minDate: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default DatePickerComp;
