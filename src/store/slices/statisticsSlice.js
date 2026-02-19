import { createSlice } from "@reduxjs/toolkit";
import { format, startOfToday, startOfWeek } from "date-fns";

// const today = format(startOfToday(), "yyyy-MM-dd");
const startDate = format(startOfWeek(new Date()), "yyyy-MM-dd");
const endDate = format(startOfToday(), "yyyy-MM-dd");

const initialState = {
  // presetsDate: {
  //   startDate: today,
  //   endDate: null,
  //   value: "today",
  //   name: "Today",
  //   index: 0,
  // },
  selectedCard: { value: "visitCount", index: 0 },
  currentDate: {
    startDate: startDate,
    endDate: endDate,
    value: "week-to-date",
    periodTypes: "previous-period",
    name: "Week to Date",
    index: 2,
  },
  comparePreviousPeriod: "previous-period",
  dateRangeType: "preset",
  savedDateRangeType: "preset",
  calenderDate: {
    startDate: startDate,
    endDate: endDate,
  },
  // customDate: {},
  // comparePreviousCustomDate: 'previousYear',
};

export const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    // presetsDateHandler: (state, { payload }) => {
    //   state.presetsDate = payload;
    // },
    comparePreviousPeriodHandler: (state, { payload }) => {
      state.comparePreviousPeriod = payload;
    },
    selectedCardHandler: (state, { payload }) => {
      state.selectedCard = payload;
    },
    calenderDateHandler: (state, { payload }) => {
      state.calenderDate.startDate = payload.startDate;
      state.calenderDate.endDate = payload.endDate;
    },
    currentDateHandler: (state, { payload }) => {
      state.currentDate = payload;
    },
    dateRangeTypeHandler: (state, { payload }) => {
      state.dateRangeType = payload;
    },
    savedDateRangeTypeHandler: (state, { payload }) => {
      state.savedDateRangeType = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  // presetsDateHandler,
  comparePreviousPeriodHandler,
  selectedCardHandler,
  currentDateHandler,
  dateRangeTypeHandler,
  calenderDateHandler,
  savedDateRangeTypeHandler,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
