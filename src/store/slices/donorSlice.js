import { createSlice } from "@reduxjs/toolkit";
import { format, startOfMonth, startOfToday } from "date-fns";

const startDate = format(startOfMonth(new Date()), "yyyy-MM-dd");
const endDate = format(startOfToday(), "yyyy-MM-dd");

const initialState = {
  donationPresetsDate: {
    startDate: startDate,
    endDate: endDate,
    value: "month-to-date",
    name: "Month to Date",
    index: 4,
  },
  paymentType: "offline",
  isEdit: false,
  dateRangeType: "preset",
  savedDateRangeType: "preset",
  openAddDonorModal: false,
  singleDonorData: {},
  calenderDate: {
    startDate: startDate,
    endDate: endDate,
  },
};

export const donorSlice = createSlice({
  name: "donations",
  initialState,
  reducers: {
    donationPresetsDateHandler: (state, { payload }) => {
      state.donationPresetsDate = payload;
    },

    tabTypeHandler: (state, { payload }) => {
      state.dateRangeType = payload;
    },
    savedDateRangeTypeHandler: (state, { payload }) => {
      state.savedDateRangeType = payload;
    },
    paymentTypeHandler: (state, { payload }) => {
      state.paymentType = payload.paymentType;
      state.isEdit = payload.isEdit;
    },
    openAddDonorModalHandler: (state, { payload }) => {
      state.openAddDonorModal = payload;
    },
    singleDonorDataHandler: (state, { payload }) => {
      state.singleDonorData = payload;
    },
    calenderDateHandler: (state, { payload }) => {
      state.calenderDate.startDate = payload.startDate;
      state.calenderDate.endDate = payload.endDate;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  donationPresetsDateHandler,
  tabTypeHandler,
  paymentTypeHandler,
  savedDateRangeTypeHandler,
  openAddDonorModalHandler,
  singleDonorDataHandler,
  calenderDateHandler,
} = donorSlice.actions;

export default donorSlice.reducer;
