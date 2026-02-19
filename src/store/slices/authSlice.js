import { createSlice } from "@reduxjs/toolkit";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const userDetailsTemplate = {
  addressDetails: {
    address: "",
    city: "",
    countryId: "",
    state: "",
    zipCode: "",
  },
  bankInfo: {
    sortCode: "",
    isUrgent: false,
    accountClass: "",
    accountName: "",
    accountNumber: "",
    accountType: "",
    bankDocuments: [],
    bankName: "",
    countryId: "",
    currencyId: "",
    payoutMethod: "",
    routingNumber: "",
    ibanNumber: "",
    swiftCode: "",
    transitNumber: "",
    instituteNumber: "",
  },
  recurlyCode: "",
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  alternateEmail: "",
  dateOfBirth: "",
  campaignTitle: "",
};

const initialState = {
  value: 0,
  isLogin: false,
  isLoginModal: false,
  isSignUpModal: false,
  currentNumber: 0,
  invitedUser: false,
  resetEmailAddress: "",
  username: "",
  emailAddress: "",
  userDetails: userDetailsTemplate,
  isAdminLogin: false,
  token: null, // Token is set client-side via login action, not at initialization
};

// const shouldUpdateStorage = (prevState, nextState) => {
//   console.log("Coming here");
//   // Only update if relevant values have changed
//   return (
//     prevState.isLogin !== nextState.isLogin ||
//     prevState.token !== nextState.token ||
//     prevState.isAdminLogin !== nextState.isAdminLogin ||
//     prevState.emailAddress !== nextState.emailAddress ||
//     JSON.stringify(prevState.userDetails) !==
//       JSON.stringify(nextState.userDetails)
//   );
// };

// const syncToStorage = (state, prevState = null) => {
//   try {
//     // If prevState exists, check if we really need to update
//     if (prevState && !shouldUpdateStorage(prevState, state)) {
//       return;
//     }

//     console.log("state", state.emailAddress);

//     const stateToStore = {
//       isLogin: state.isLogin,
//       token: state.token,
//       isAdminLogin: state.isAdminLogin,
//       userDetails: state.userDetails,
//       emailAddress: state.emailAddress,
//     };

//     const stateString = JSON.stringify(stateToStore);
//     const currentStored = localStorage.getItem("auth_state");

//     // console.log("currentStored", stateString);

//     // Only update storage if the value is different
//     if (currentStored !== stateString) {
//       localStorage.setItem("auth_state", stateString);
//     }
//   } catch (error) {
//     console.error("Error syncing to localStorage:", error);
//   }
// };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      state.isLogin = true;
      setCookie("token", action.payload, { path: "/" });
      // syncToStorage(state);
    },
    logout: (state) => {
      state.token = null;
      state.isLogin = false;
      state.userDetails = userDetailsTemplate;
      state.emailAddress = "";
      state.isAdminLogin = false;
      deleteCookie("token", { path: "/" });
      // syncToStorage(state);
    },
    invitedUser: (state, action) => {
      state.invitedUser = action.payload;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    isLoginHandler: (state, action) => {
      state.isLogin = action.payload;
    },
    isAdminLogin: (state, action) => {
      state.isAdminLogin = action.payload;
      // syncToStorage(state); // Add sync here
    },
    isLoginModalOpen: (state, action) => {
      state.isLoginModal = action.payload;
    },
    isSignUpModalOpen: (state, action) => {
      state.isSignUpModal = action.payload;
    },
    changeModal: (state, action) => {
      state.currentNumber = action.payload;
    },
    resetEmail: (state, action) => {
      state.resetEmailAddress = action.payload;
    },
    userNameHandler: (state, action) => {
      state.username = action.payload;
      // syncToStorage(state);
    },
    addUserDetails: (state, action) => {
      state.userDetails = action.payload;
      state.emailAddress = action.payload.email;
      // syncToStorage(state); // Add sync here
    },
    resetUserDetails: (state) => {
      state.userDetails = userDetailsTemplate;
    },
    titleHandler: (state, action) => {
      state.campaignTitle = action.payload;
    },
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // syncF
  },
});

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  incrementByAmount,
  isLoginHandler,
  isAdminLogin,
  isLoginModalOpen,
  isSignUpModalOpen,
  changeModal,
  resetEmail,
  userNameHandler,
  addUserDetails,
  resetUserDetails,
  titleHandler,
  login,
  logout,
  invitedUser,
  // syncFromStorage,
} = authSlice.actions;

export default authSlice.reducer;
