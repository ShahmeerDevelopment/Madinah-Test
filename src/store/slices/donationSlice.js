import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  donationValues: {
    totalAmount: 0,
    recurringDonation: 0,
  },
  randomToken: "",
  paymentType: "credit_card",
  announcementToken: "",
  email: "",
  tipAmount: 0,
  orderBump: 0,
  processingFee: 0,
  currencySymbol: "",
  isSaveCardForFuture: false,
  isBillingName: false,
  isRecurring: false,
  isSaveCardContinue: false,
  cardHolderName: {},
  campaignId: "",
  selectedBoxData: null,
  cardType: 2,
  creditCardDetails: null,
  oneTimeDonation: false,
  monthlyDonation: false,
  currency: null,
  paginationNumber: 1,
  campaignDetails: {},
  customDonationCheckbox: "oneTimeDonation",
  provideNameAndEmail: true,
  provideNumber: true,
  isLevel: false,
  packageValues: [],
  cardToken: null,
  publicVisibility: false,
  isSelectedRecurringPage: false,
  donatePress: false,
  isHelpUmmahCheckedRedux: true,
  tipSliderValueRedux: 16,
  isCustomAmountRedux: false,
  desktopLevelIndex: null,
  selectedTipRedux: 2,
  saveCardHolderName: {},
  donationBack: false,
  donationComment: "",
  recurringType: "",
  donationType: "giveOnce",
  donationValueBack: 0,
  donorUserDetails: {},
};

export const donationSlice = createSlice({
  name: "donation",
  initialState,
  reducers: {
    donationHandler: (state, action) => {
      state.donationValues = { ...state.donationValues, ...action.payload };
    },
    updateOrderBump: (state, action) => {
      state.orderBump = action.payload;
    },
    updateProcessingFee: (state, action) => {
      state.processingFee = action.payload;
    },
    updateDonationType: (state, action) => {
      state.donationType = action.payload;
    },
    updateDonationEmail: (state, action) => {
      state.email = action.payload;
    },
    updateCardType: (state, action) => {
      state.cardType = action.payload;
    },
    updateCampaignDetails: (state, action) => {
      state.campaignDetails = action.payload;
    },
    updateCustomDonation: (state, action) => {
      state.customDonationCheckbox = action.payload;
    },
    updateDOnationValueBlock: (state, action) => {
      state.donationValueBack = action.payload;
    },
    randomTokenHandler: (state, action) => {
      state.randomToken = action.payload;
    },
    donationBackHandler: (state, action) => {
      state.donationBack = action.payload;
    },
    isBillingNameHandler: (state, action) => {
      state.isBillingName = action.payload;
    },
    donateCurrencyHandler: (state, action) => {
      state.currency = action.payload;
    },
    paymentTypeHandler: (state, action) => {
      state.paymentType = action.payload;
    },
    isHelpUmmahCheckedReduxHandler: (state, action) => {
      state.isHelpUmmahCheckedRedux = action.payload;
    },
    tipSliderValueReduxHandler: (state, action) => {
      state.tipSliderValueRedux = action.payload;
    },
    isCustomAmountReduxHandler: (state, action) => {
      state.isCustomAmountRedux = action.payload;
    },
    selectedTipReduxHandler: (state, action) => {
      state.selectedTipRedux = action.payload;
    },
    announcementTokenHandler: (state, action) => {
      state.announcementToken = action.payload;
    },
    tipAmountHandler: (state, action) => {
      state.tipAmount = action.payload;
    },
    cardTokenHandler: (state, action) => {
      state.cardToken = action.payload;
    },
    desktopLevelIndexHandler: (state, action) => {
      state.desktopLevelIndex = action.payload;
    },
    currencySymbolHandler: (state, action) => {
      state.currencySymbol = action.payload;
    },
    publicVisibilityHandler: (state, action) => {
      state.publicVisibility = action.payload;
    },
    saveCardHandler: (state, action) => {
      state.isSaveCardForFuture = action.payload;
    },
    isRecurringHandler: (state, action) => {
      state.isRecurring = action.payload;
    },
    donatePressHandler: (state, action) => {
      state.donatePress = action.payload;
    },
    isSelectedRecurringPageHandler: (state, action) => {
      state.isSelectedRecurringPage = action.payload;
    },
    isSavedCardContinueHandler: (state, action) => {
      state.isSaveCardContinue = action.payload;
    },
    isLevelHandler: (state, action) => {
      state.isLevel = action.payload;
    },
    packageValuesHandler: (state, action) => {
      state.packageValues = action.payload;
    },
    cardHolderNameHandler: (state, action) => {
      state.cardHolderName = action.payload;
    },
    saveCardHolderNameHandler: (state, action) => {
      state.saveCardHolderName = action.payload;
    },
    donationCommentHandler: (state, action) => {
      state.donationComment = action.payload;
    },
    campaignIdHandler: (state, action) => {
      state.campaignId = action.payload;
    },
    selectedBoxDataHandler: (state, action) => {
      state.selectedBoxData = action.payload;
    },
    creditCardDetailsHandler: (state, action) => {
      state.creditCardDetails = action.payload;
    },
    donorUserDetailsHandler: (state, action) => {
      state.donorUserDetails = action.payload;
    },
    oneTimeDonationHandler: (state, action) => {
      state.oneTimeDonation = action.payload;
    },
    monthlyDonationHandler: (state, action) => {
      state.monthlyDonation = action.payload;
    },
    provideNameAndEmailHandler: (state, action) => {
      state.provideNameAndEmail = action.payload;
    },
    provideNumberHandler: (state, action) => {
      state.provideNumber = action.payload;
    },
    resetDonationState: () => {
      return initialState;
    },
    paginationHandler: (state, action) => {
      state.paginationNumber = action.payload;
    },
    recurringTypeHandler: (state, action) => {
      state.recurringType = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  donationHandler,
  donateCurrencyHandler,
  updateCustomDonation,
  updateOrderBump,
  updateProcessingFee,
  updateDonationType,
  publicVisibilityHandler,
  randomTokenHandler,
  paymentTypeHandler,
  donationBackHandler,
  tipAmountHandler,
  cardTokenHandler,
  announcementTokenHandler,
  donationCommentHandler,
  isLevelHandler,
  updateDOnationValueBlock,
  selectedTipReduxHandler,
  packageValuesHandler,
  isBillingNameHandler,
  currencySymbolHandler,
  saveCardHandler,
  isRecurringHandler,
  desktopLevelIndexHandler,
  donatePressHandler,
  isSelectedRecurringPageHandler,
  isSavedCardContinueHandler,
  isHelpUmmahCheckedReduxHandler,
  tipSliderValueReduxHandler,
  isCustomAmountReduxHandler,
  cardHolderNameHandler,
  saveCardHolderNameHandler,
  campaignIdHandler,
  selectedBoxDataHandler,
  creditCardDetailsHandler,
  donorUserDetailsHandler,
  resetDonationState,
  monthlyDonationHandler,
  oneTimeDonationHandler,
  paginationHandler,
  updateDonationEmail,
  updateCampaignDetails,
  updateCardType,
  provideNameAndEmailHandler,
  provideNumberHandler,
  recurringTypeHandler,
} = donationSlice.actions;

export default donationSlice.reducer;
