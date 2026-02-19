import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  successDonationValues: {},
  feedbackTokens: {},
  yourDonationData: {},
  cardHolderValues: "",
  isSaveCardContinueSell: false,
  thankYouPageData: {},
};

export const successDonationSlice = createSlice({
  name: "successDonation",
  initialState,
  reducers: {
    successDonationHandler: (state, action) => {
      state.successDonationValues = {
        ...state.successDonationValues,
        ...action.payload,
      };
    },
    feedbackTokensHandler: (state, action) => {
      state.feedbackTokens = {
        ...state.feedbackTokens,
        ...action.payload,
      };
    },
    yourDonationDataHandler: (state, action) => {
      state.yourDonationData = {
        ...state.yourDonationData,
        ...action.payload,
      };
    },thankYouPageDataHandler: (state, action) => {
      state.thankYouPageData = {
        ...state.thankYouPageData,
        ...action.payload,
      };
    },
    cardHolderValuesHandler: (state, action) => {
      state.cardHolderValues = action.payload;
    },
    isSaveCardContinueSellHandler: (state, action) => {
      state.isSaveCardContinueSell = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  successDonationHandler,
  feedbackTokensHandler,
  yourDonationDataHandler,
  cardHolderValuesHandler,
  isSaveCardContinueSellHandler,
  thankYouPageDataHandler
} = successDonationSlice.actions;

export default successDonationSlice.reducer;
