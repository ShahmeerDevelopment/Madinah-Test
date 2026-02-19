import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellConfigs: [],
  paymentPayload: {},
  campaignId: "",
};

export const sellConfigSlice = createSlice({
  name: "sellConfigs",
  initialState,
  reducers: {
    updateSellConfigs: (state, action) => {
      state.sellConfigs = action.payload;
    },
    updateAmountCurrency: (state, action) => {
      state.amountCurrency = action.payload;
    },
    updateCampaignId: (state, action) => {
      state.campaignId = action.payload;
    },
    updatePaymentPayload: (state, action) => {
      state.paymentPayload = action.payload;
    },
    resetSellConfigState: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateSellConfigs,
  updateAmountCurrency,
  updatePaymentPayload,
  updateCampaignId,
  resetSellConfigState,
} = sellConfigSlice.actions;

export default sellConfigSlice.reducer;
