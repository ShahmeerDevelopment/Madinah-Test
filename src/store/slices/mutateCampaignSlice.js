import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isChanged: false,
  id: "",
  title: "",
  subTitle: "",
  initialGoal: 0,
  startingAmount: 0,
  coverMedia: "",
  coverYoutubeUrl: "",
  story: "",
  fundraiserCustomUrl: "",
  category: null,
  medium: {
    _id: 1,
    name: "Organic",
    value: "organic",
  },
  location_country: null,
  location_zipCode: "",
  allowRecurringDonations: true,
  promoteRecurringDonations: false,
  zakatEligible: false,
  taxDeductable: false,
  allowCustomDonation: true,
  allowOneTimeDonations: true,
  currency: "",
  allowFundraiserToAcceptDonations: true,
  allowAppearInSearchResultsAndSuggestedLists: true,
  allowSuggestedToAppearInFundraiserPage: true,
  scriptValues: {
    viewPageScript: "",
    donationButtonScript: "",
  },
  milestoneNotifications: [],
  creator: "",
  creatorEmail: "",
  emailCount: 0,
  team: [],
  gradingLevelsList: [],
  status: "",
  upSellLevel: [],
  teamMembers: [],
  /* not in phase 1 */
  referralLinks: [],
  currencySymbol: "",
  minimumDonationValue: 0,
  allowCampaignTimeline: false,
  campaignTimelineDate: "",
  isCommentAllowed: false,
  commentboxHeading: "",
};

const changeMade = (updatedState) => {
  updatedState.isChanged = true;
  return updatedState;
};

export const mutateCampaignSlice = createSlice({
  name: "mutate-campaign",
  initialState,
  reducers: {
    updateValues: (state, { payload }) => {
      return payload;
    },
    resetValues: () => {
      return initialState; // Reset campaignValues to an empty object
    },
    updateTitle: (state, { payload }) => {
      state.title = payload;
      return changeMade(state);
    },
    updateSubTitle: (state, { payload }) => {
      state.subTitle = payload;
      return changeMade(state);
    },
    updateCategory: (state, { payload }) => {
      state.category = payload;
      return changeMade(state);
    },
    updateMedium: (state, { payload }) => {
      state.medium = payload;
      return changeMade(state);
    },
    updateCreator: (state, { payload }) => {
      state.creator = payload;
      return changeMade(state);
    },
    updateCreatorEmail: (state, { payload }) => {
      state.creatorEmail = payload;
      return changeMade(state);
    },
    updateEmailCount: (state, { payload }) => {
      state.emailCount = payload;
      return changeMade(state);
    },
    updateInitialGoal: (state, { payload }) => {
      state.initialGoal = payload;
      return changeMade(state);
    },
    updateStartingAmount: (state, { payload }) => {
      state.startingAmount = payload;
      return changeMade(state);
    },
    updateCurrency: (state, { payload }) => {
      state.currency = payload;
      return changeMade(state);
    },
    updateCurrencySymbol: (state, { payload }) => {
      state.currencySymbol = payload;
      return changeMade(state);
    },
    updateCoverMedia: (state, { payload }) => {
      state.coverYoutubeUrl = "";
      state.coverMedia = payload;
      return changeMade(state);
    },
    updateCoverYoutubeUrl: (state, { payload }) => {
      state.coverMedia = "";
      state.coverYoutubeUrl = payload;
      return changeMade(state);
    },
    updateStory: (state, { payload }) => {
      state.story = payload;
      return changeMade(state);
    },
    updateFundraiserCustomUrl: (state, { payload }) => {
      state.fundraiserCustomUrl = payload;
      return changeMade(state);
    },
    updateLocation_country: (state, { payload }) => {
      state.location_country = payload;
      return changeMade(state);
    },
    updateLocation_zipCode: (state, { payload }) => {
      state.location_zipCode = payload;
      return changeMade(state);
    },
    updateAllowRecurringDonations: (state, { payload }) => {
      state.allowRecurringDonations = payload;
      return changeMade(state);
    },
    updatePromoteRecurringDonations: (state, { payload }) => {
      state.promoteRecurringDonations = payload;
      return changeMade(state);
    },
    updateAllowOneTimeDonations: (state, { payload }) => {
      state.allowOneTimeDonations = payload;
      return changeMade(state);
    },
    minimumDonationValueHandler: (state, { payload }) => {
      state.minimumDonationValue = payload;
      return changeMade(state);
    },

    updateZakatEligible: (state, { payload }) => {
      state.zakatEligible = payload;
      return changeMade(state);
    },
    updateTaxDeductAble: (state, { payload }) => {
      state.taxDeductable = payload;
      return changeMade(state);
    },
    updateIsCommentAllowed: (state, { payload }) => {
      state.isCommentAllowed = payload;
      return changeMade(state);
    },
    updateCommentBoxHeading: (state, { payload }) => {
      state.commentboxHeading = payload;
      return changeMade(state);
    },
    updateCustomDonationHandler: (state, { payload }) => {
      state.allowCustomDonation = payload;
      return changeMade(state);
    },
    updateAllowCampaignTimelineHandler: (state, { payload }) => {
      state.allowCampaignTimeline = payload;
      return changeMade(state);
    },
    updateCampaignTimelineHandler: (state, { payload }) => {
      state.campaignTimelineDate = payload;
      return changeMade(state);
    },
    // allowCustomDonation
    toggleAllowFundraiserToAcceptDonations: (state) => {
      state.allowFundraiserToAcceptDonations =
        !state.allowFundraiserToAcceptDonations;
    },
    manageAllowFundraiserToAcceptDonations: (state, { payload }) => {
      state.allowFundraiserToAcceptDonations = payload;
    },
    toggleAllowAppearInSearchResultsAndSuggestedLists: (state) => {
      state.allowAppearInSearchResultsAndSuggestedLists =
        !state.allowAppearInSearchResultsAndSuggestedLists;
    },
    manageAllowAppearInSearchResultsAndSuggestedLists: (state, { payload }) => {
      state.allowAppearInSearchResultsAndSuggestedLists = payload;
    },
    toggleAllowSuggestedToAppearInFundraiserPage: (state) => {
      state.allowSuggestedToAppearInFundraiserPage =
        !state.allowSuggestedToAppearInFundraiserPage;
    },
    updateViewPageScript: (state, { payload }) => {
      state.scriptValues.viewPageScript = payload;
      return changeMade(state);
    },
    updateDonationButtonScript: (state, { payload }) => {
      state.scriptValues.donationButtonScript = payload;
      return changeMade(state);
    },
    manageAllowSuggestedToAppearInFundraiserPage: (state, { payload }) => {
      state.allowSuggestedToAppearInFundraiserPage = payload;
    },
    configureMilestoneNotifications: (state, { payload }) => {
      let temp = [...state.milestoneNotifications];
      const milestoneAlreadyExists = temp.findIndex(
        (eachMilestoneNotification) => eachMilestoneNotification === payload
      );

      if (milestoneAlreadyExists === -1) {
        // If the milestone doesn't exist, add it
        temp.push(payload);
      } else {
        // If the milestone already exists, remove it
        temp = temp.filter(
          (eachMilestoneNotification) => eachMilestoneNotification !== payload
        );
      }

      state.milestoneNotifications = temp;
    },

    addTeamMember: (state, { payload }) => {
      // let temp = [...state.team];
      // temp.push(payload);
      // state.team = temp;
      state.team = [...payload];
      return state;
    },
    addGradingLevel: (state, { payload }) => {
      let temp = [...state.gradingLevelsList];
      temp.push(payload);
      state.gradingLevelsList = temp;
    },
    deleteGradingLevel: (state, { payload }) => {
      let temp = [...state.gradingLevelsList];
      temp.splice(payload, 1);
      state.gradingLevelsList = temp;
    },
    buildGradingLevels: (state, { payload }) => {
      state.gradingLevelsList = [...payload];
      return state;
    },
    addUpSellLevel: (state, { payload }) => {
      state.upSellLevel = [...payload];
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateValues,
  resetValues,
  updateTitle,
  updateSubTitle,
  updateInitialGoal,
  updateStartingAmount,
  updateCoverMedia,
  updateCoverYoutubeUrl,
  updateStory,
  updateFundraiserCustomUrl,
  updateLocation_country,
  updateLocation_zipCode,
  updateAllowRecurringDonations,
  updatePromoteRecurringDonations,
  updateAllowOneTimeDonations,
  updateZakatEligible,
  updateTaxDeductAble,
  updateIsCommentAllowed,
  updateCommentBoxHeading,
  updateAllowCampaignTimelineHandler,
  updateCampaignTimelineHandler,
  toggleAllowFundraiserToAcceptDonations,
  toggleAllowAppearInSearchResultsAndSuggestedLists,
  toggleAllowSuggestedToAppearInFundraiserPage,
  configureMilestoneNotifications,
  addTeamMember,
  addGradingLevel,
  updateCategory,
  updateMedium,
  manageAllowFundraiserToAcceptDonations,
  manageAllowAppearInSearchResultsAndSuggestedLists,
  manageAllowSuggestedToAppearInFundraiserPage,
  updateCurrency,
  updateCurrencySymbol,
  deleteGradingLevel,
  buildGradingLevels,
  addUpSellLevel,
  updateCustomDonationHandler,
  minimumDonationValueHandler,
  updateViewPageScript,
  updateDonationButtonScript,
} = mutateCampaignSlice.actions;

export default mutateCampaignSlice.reducer;
