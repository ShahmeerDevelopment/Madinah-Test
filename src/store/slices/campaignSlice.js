import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  campaignValues: {},
  imageDataUrl: "",
  campaignList: [],
  isCreateCampaign: false,
  activeStep: 0,
  currentIndex: 0,
  personalInformation: {},
  homeAddress: {},
  homeCountry: {},
  bankInformation: {},
  bankInfoImages: [],
  documentsInformation: {},
  answers: {
    title1: "",
    title2: "",
    title3: "",
    title4: "",
    title5: "",
    title6: "",
    title7: "",
    title8: "",
    title9: "",
  },
};

export const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    createCampaignHandler: (state, action) => {
      state.campaignValues = { ...state.campaignValues, ...action.payload };
    },
    imageUrlHandler: (state, action) => {
      state.imageDataUrl = action.payload;
    },
    isCreateCampaignHandler: (state, action) => {
      state.isCreateCampaign = action.payload;
    },
    resetCampaignValues: (state) => {
      state.campaignValues = {}; // Reset campaignValues to an empty object
      state.campaignList = [];
    },
    personalInformationHandler: (state, action) => {
      state.personalInformation = action.payload;
    },
    homeAddressHandler: (state, action) => {
      state.homeAddress = action.payload;
    },
    homeCountryHandler: (state, action) => {
      state.homeCountry = action.payload;
    },
    bankInformationHandler: (state, action) => {
      state.bankInformation = action.payload;
    },
    bankInfoImagesHandler: (state, action) => {
      state.bankInfoImages = action.payload;
    },
    documentsInformationHandler: (state, action) => {
      state.documentsInformation = action.payload;
    },
    campaignListHandler: (state, action) => {
      state.campaignList = action.payload;
    },
    campaignStepperIncrementHandler: (state, action) => {
      state.activeStep = state.activeStep + action.payload;
      state.currentIndex = state.activeStep;
    },
    campaignStepperDecrementHandler: (state, action) => {
      state.activeStep = state.activeStep - action.payload;
      state.currentIndex = state.activeStep - action.payload;
    },
    resetActiveStepper: (state, action) => {
      state.activeStep = action.payload;
      state.currentIndex = action.payload;
    },
    setAnswer: (state, action) => {
      const { name, value } = action.payload;
      state.answers[name] = value;
    },
    setAllAnswers: (state, action) => {
      state.answers = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  createCampaignHandler,
  imageUrlHandler,
  isCreateCampaignHandler,
  resetCampaignValues,
  campaignListHandler,
  personalInformationHandler,
  homeAddressHandler,
  bankInformationHandler,
  homeCountryHandler,
  bankInfoImagesHandler,
  documentsInformationHandler,
  imageDataHandler,
  campaignStepperIncrementHandler,
  campaignStepperDecrementHandler,
  resetActiveStepper,
  setAnswer,
  setAllAnswers,
} = campaignSlice.actions;

export default campaignSlice.reducer;
