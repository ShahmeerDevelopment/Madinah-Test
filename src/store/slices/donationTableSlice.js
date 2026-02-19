import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  donations: [],
};

export const donationTableSlice = createSlice({
  name: "donation-table",
  initialState,
  reducers: {
    updateDonationTable: (state, action) => {
      state.donations = action.payload;
    },
    resetDonationTable: () => {
      return initialState; // Reset campaignValues to an empty object
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDonationTable, resetDonationTable } =
  donationTableSlice.actions;

export default donationTableSlice.reducer;
