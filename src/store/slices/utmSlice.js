import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  utmTerm: null,
  utmContent: null,
  referral: null,
  fbclid: null,
  src: null,
};

export const utmSlice = createSlice({
  name: "utmParameters",
  initialState,
  reducers: {
    setUtmParams: (state, { payload }) => {
      state.utmSource = payload.utmSource;
      state.utmMedium = payload.utmMedium;
      state.utmCampaign = payload.utmCampaign;
      state.utmTerm = payload.utmTerm;
      state.utmContent = payload.utmContent;
      state.referral = payload.referral;
      state.fbclid = payload.fbclid;
      state.src = payload.src;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUtmParams } = utmSlice.actions;

export default utmSlice.reducer;
