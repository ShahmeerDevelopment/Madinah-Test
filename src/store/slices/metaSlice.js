import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	countries: [],
	categories: [],
	validatePhoneNumber: false,
};

export const metaSlice = createSlice({
	name: "meta",
	initialState,
	reducers: {
		configureCountries: (state, { payload }) => {
			state.countries = payload;
		},
		configureCategories: (state, { payload }) => {
			state.categories = payload;
		},
		phoneNumberFormatValidator: (state, { payload }) => {
			state.validatePhoneNumber = payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	configureCountries,
	configureCategories,
	phoneNumberFormatValidator,
} = metaSlice.actions;

export default metaSlice.reducer;
