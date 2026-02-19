import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  paginatedData: 1,
  paginationNumber: { _id: 1, name: "5 per page", value: 5 },
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updatePaginationData: (state, { payload }) => {
      state.paginatedData = payload;
    },
    updatePaginationNumber: (state, { payload }) => {
      state.paginationNumber = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updatePaginationData, updatePaginationNumber } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
