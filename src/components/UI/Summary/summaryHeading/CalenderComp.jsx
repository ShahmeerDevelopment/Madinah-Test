"use client";

import React, { memo, useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import CalenderButton from "@/components/molecules/calenderButton/CalenderButton";
import { startOfMonth } from "date-fns";

const CalenderComp = memo(({ onDateChange, isFinancialSummary = false }) => {
  const [openCalendar, setOpenCalendar] = useState(null);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [view, setView] = useState("day");

  useEffect(() => {
    if (isFinancialSummary) {
      setStartDate(dayjs(startOfMonth(new Date())));
      setEndDate(dayjs());
    }
  }, [isFinancialSummary]);

  const handleCalendarOpen = (calendar) => {
    setOpenCalendar((prev) => (prev === calendar ? null : calendar));
    setView("day");
  };

  const handleDateChange = (date, calendarType) => {
    if (view !== "day") {
      // If we're not in day view, just update the date without closing
      if (calendarType === "start") {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      return;
    }

    // Only close and update final date when in day view
    if (calendarType === "start") {
      setStartDate(date);
      onDateChange({ startDate: date, endDate });
    } else {
      setEndDate(date);
      onDateChange({ startDate, endDate: date });
    }
    setOpenCalendar(null);
  };

  const handleClickAway = () => {
    setOpenCalendar(null);
    setView("day");
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BoxComponent
        sx={{
          display: "flex",
          gap: 1,
          position: "relative",
        }}
      >
        <CalenderButton
          content={`Starting: ${startDate.format("MMM D, YYYY")}`}
          onClickHandler={() => handleCalendarOpen("start")}
        />
        {openCalendar === "start" && (
          <BoxComponent
            sx={{ position: "absolute", top: { xs: 40, sm: 40, md: 40 } }}
          >
            <ClickAwayListener onClickAway={handleClickAway}>
              <DateCalendar
                value={startDate}
                onChange={(date) => handleDateChange(date, "start")}
                disableFuture={true}
                views={["year", "month", "day"]}
                openTo="day"
                view={view}
                onViewChange={handleViewChange}
                sx={{
                  background: "#ffffff",
                  position: "absolute",
                  zIndex: "9999",
                  "& .MuiPickersCalendarHeader-label": {
                    cursor: "pointer",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#6363E6 !important",
                    "&:hover": {
                      backgroundColor: "#6363E6 !important",
                    },
                    "&:focus": {
                      backgroundColor: "#6363E6 !important",
                    },
                  },
                  "& .MuiPickersDay-root.Mui-selected": {
                    backgroundColor: "#6363E6 !important",
                    color: "#ffffff !important",
                  },
                }}
              />
            </ClickAwayListener>
          </BoxComponent>
        )}
        <CalenderButton
          content={`Ending: ${endDate.format("MMM D, YYYY")}`}
          onClickHandler={() => handleCalendarOpen("end")}
        />
        {openCalendar === "end" && (
          <BoxComponent
            sx={{ position: "absolute", top: { xs: 40, sm: 40, md: 40 } }}
          >
            <ClickAwayListener onClickAway={handleClickAway}>
              <DateCalendar
                value={endDate}
                disableFuture={true}
                onChange={(date) => handleDateChange(date, "end")}
                views={["year", "month", "day"]}
                openTo="day"
                view={view}
                onViewChange={handleViewChange}
                sx={{
                  background: "#ffffff",
                  position: "absolute",
                  zIndex: "9999",
                  "& .MuiPickersCalendarHeader-label": {
                    cursor: "pointer",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#6363E6 !important",
                    "&:hover": {
                      backgroundColor: "#6363E6 !important",
                    },
                    "&:focus": {
                      backgroundColor: "#6363E6 !important",
                    },
                  },
                  "& .MuiPickersDay-root.Mui-selected": {
                    backgroundColor: "#6363E6 !important",
                    color: "#ffffff !important",
                  },
                }}
              />
            </ClickAwayListener>
          </BoxComponent>
        )}
      </BoxComponent>
    </LocalizationProvider>
  );
});

CalenderComp.displayName = "CalenderComp";
CalenderComp.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  isFinancialSummary: PropTypes.bool,
};

export default CalenderComp;
