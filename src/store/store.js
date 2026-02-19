"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { format, startOfToday, startOfWeek } from "date-fns";

// ============================================
// CORE SLICES - Always loaded
// ============================================
import authSlice from "./slices/authSlice";
import campaignSlice from "./slices/campaignSlice";
import mutateCampaignSlice from "./slices/mutateCampaignSlice";
import mutateAuthSlice from "./slices/mutateAuthSlice";
import utmSlice from "./slices/utmSlice";
import loaderSlice from "./slices/loaderSlice";
import metaSlice from "./slices/metaSlice";

// ============================================
// PLACEHOLDER REDUCERS FOR LAZY SLICES
// ============================================
const createPlaceholderReducer =
  (initialState = {}) =>
  (state = initialState) =>
    state;

const staticReducers = {
  auth: authSlice,
  campaign: campaignSlice,
  mutateCampaign: mutateCampaignSlice,
  mutateAuth: mutateAuthSlice,
  utmParameters: utmSlice,
  loader: loaderSlice,
  meta: metaSlice,
};

const placeholderReducers = {
  donation: createPlaceholderReducer({
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
  }),
  sellConfigs: createPlaceholderReducer({ paymentPayload: {} }),
  successDonation: createPlaceholderReducer({ yourDonationData: {} }),
  statistics: createPlaceholderReducer({
    selectedCard: { value: "visitCount", index: 0 },
    currentDate: {
      startDate: format(startOfWeek(new Date()), "yyyy-MM-dd"),
      endDate: format(startOfToday(), "yyyy-MM-dd"),
      value: "week-to-date",
      periodTypes: "previous-period",
      name: "Week to Date",
      index: 2,
    },
    comparePreviousPeriod: "previous-period",
    dateRangeType: "preset",
    savedDateRangeType: "preset",
    calenderDate: {
      startDate: format(startOfWeek(new Date()), "yyyy-MM-dd"),
      endDate: format(startOfToday(), "yyyy-MM-dd"),
    },
  }),
  donations: createPlaceholderReducer({
    donationPresetsDate: {
      startDate: format(startOfToday(), "yyyy-MM-dd"),
      endDate: format(startOfToday(), "yyyy-MM-dd"),
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
      startDate: format(startOfToday(), "yyyy-MM-dd"),
      endDate: format(startOfToday(), "yyyy-MM-dd"),
    },
  }),
  dashboard: createPlaceholderReducer({
    paginatedData: 1,
    paginationNumber: { _id: 1, name: "5 per page", value: 5 },
  }),
  donationTable: createPlaceholderReducer({}),
};

let asyncReducers = {};

const createReducer = (injectedReducers = {}) =>
  combineReducers({
    ...staticReducers,
    ...placeholderReducers,
    ...injectedReducers,
  });

// ✅ SINGLETON store (required in App Router)
export const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Support async reducer injection (same as before)
store.asyncReducers = asyncReducers;

store.injectReducer = (key, reducer) => {
  if (!store.asyncReducers[key]) {
    store.asyncReducers[key] = reducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  }
  return store;
};

// ============================================
// LAZY SLICE INJECTION HELPERS
// ============================================
export const injectDonationSlices = async () => {
  const [
    { default: donationSlice },
    { default: sellConfigSlice },
    { default: successDonationSlice },
    { default: metaSlice },
  ] = await Promise.all([
    import("./slices/donationSlice"),
    import("./slices/sellConfigSlice"),
    import("./slices/successDonationSlice"),
    import("./slices/metaSlice"),
  ]);

  store.injectReducer("donation", donationSlice);
  store.injectReducer("sellConfigs", sellConfigSlice);
  store.injectReducer("successDonation", successDonationSlice);
  store.injectReducer("meta", metaSlice);
};

export const injectDashboardSlices = async () => {
  const { default: dashboardSlice } = await import("./slices/dashboardSlice");
  store.injectReducer("dashboard", dashboardSlice);
};

export const injectStatisticsSlices = async () => {
  const { default: statisticsSlice } = await import("./slices/statisticsSlice");
  store.injectReducer("statistics", statisticsSlice);
};

export const injectCampaignManagementSlices = async () => {
  const [{ default: donorSlice }, { default: donationTableSlice }] =
    await Promise.all([
      import("./slices/donorSlice"),
      import("./slices/donationTableSlice"),
    ]);

  store.injectReducer("donations", donorSlice);
  store.injectReducer("donationTable", donationTableSlice);
};

export const injectMetaSlice = async () => {
  const { default: metaSlice } = await import("./slices/metaSlice");
  store.injectReducer("meta", metaSlice);
};
