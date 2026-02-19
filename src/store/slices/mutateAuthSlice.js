import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
	firstName: "",
	lastName: "",
	email: "",
	phoneNumber: "",
	profileImage: null,
	state: "",
	city: "",
	countryId: "",
	paymentCardLength: 0,
	pixelId : "",
	pixelAccessToken: "",
	gtmId: "",
};

const changeMade = (updatedState) => {
	updatedState.isChanged = true;
	return updatedState;
};

export const mutateAuthSlice = createSlice({
	name: "mutate-auth",
	initialState,
	reducers: {
		updateAuthValues: (state, { payload }) => {
			return payload;
		},
		resetProfileValues: () => {
			return initialState; // Reset campaignValues to an empty object
		},
		updatePaymentCardLength: (state, { payload }) => {
			state.paymentCardLength = payload;
		},
		updateFirstName: (state, { payload }) => {
			state.firstName = payload;
			return changeMade(state);
		},
		updateLastName: (state, { payload }) => {
			state.lastName = payload;
			return changeMade(state);
		},
		updatePixelId: (state, { payload }) => {
			state.pixelId = payload;
			return changeMade(state);
		},
		updatePixelApiKey: (state, { payload }) => {
			state.pixelAccessToken = payload;
			return changeMade(state);
		},
		updateGtmId: (state, { payload }) => {
			state.gtmId = payload;
			return changeMade(state);
		},
		updateState: (state, { payload }) => {
			state.state = payload;
			return changeMade(state);
		},
		updateCity: (state, { payload }) => {
			state.city = payload;
			return changeMade(state);
		},
		updateCountry: (state, { payload }) => {
			state.countryId = payload;
			return changeMade(state);
		},
		updateEmail: (state, { payload }) => {
			state.email = payload;
			return changeMade(state);
		},
		updatePhoneNumber: (state, { payload }) => {
			state.phoneNumber = payload;
			return changeMade(state);
		},
		updateProfileImage: (state, { payload }) => {
			state.profileImage = payload;
			return changeMade(state);
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	updateAuthValues,
	resetProfileValues,
	updatePaymentCardLength,
	updateFirstName,
	updateLastName,
	updatePixelId,
	updatePixelApiKey,
	updateGtmId,
	updateState,
	updateCity,
	updateCountry,
	updateEmail,
	updatePhoneNumber,
	updateProfileImage,
} = mutateAuthSlice.actions;

export default mutateAuthSlice.reducer;
