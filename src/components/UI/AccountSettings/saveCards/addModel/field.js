/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { memo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import TextFieldComp from "../../../../../components/atoms/inputFields/TextFieldComp";
import { useGetAllCountries } from "../../../../../api";
import DropDown from "../../../../../components/atoms/inputFields/DropDown";

export const NameOnCardField = memo(({ formik }) => {
	const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
	const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
	return (
		<div>
			<TextFieldComp
				fontColor={"inherit"}
				isRequired={false}
				id="nameOnCard"
				name="nameOnCard"
				label="Name on card*"
				placeholder="Enter your card name"
				value={formik.values.nameOnCard}
				onChange={handleChange}
				onBlur={handleBlur}
				error={formik.touched.nameOnCard && Boolean(formik.errors.nameOnCard)}
				helperText={formik.touched.nameOnCard && formik.errors.nameOnCard}
				fullWidth
			/>
		</div>
	);
});

NameOnCardField.displayName = "NameOnCardField";
NameOnCardField.propTypes = {
	formik: PropTypes.any,
};

export const StateField = memo(({ formik, isEdit = false }) => {
	const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
	const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
	return (
		<div>
			<TextFieldComp
				fontColor={"inherit"}
				isRequired={false}
				id="stateField"
				name="stateField"
				label="State/Province*"
				placeholder="Enter your card state/province"
				value={formik.values.stateField}
				onChange={handleChange}
				onBlur={handleBlur}
				error={formik.touched.stateField && Boolean(formik.errors.stateField)}
				helperText={formik.touched.stateField && formik.errors.stateField}
				fullWidth
				disabled={isEdit}
			/>
		</div>
	);
});

StateField.displayName = "StateField";
StateField.propTypes = {
	formik: PropTypes.any,
	isEdit: PropTypes.bool,
};

export const CityField = memo(({ formik }) => {
	const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
	const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
	return (
		<div>
			<TextFieldComp
				fontColor={"inherit"}
				isRequired={false}
				id="cityField"
				name="cityField"
				label="City*"
				placeholder="Enter your city"
				value={formik.values.cityField}
				onChange={handleChange}
				onBlur={handleBlur}
				error={formik.touched.cityField && Boolean(formik.errors.cityField)}
				helperText={formik.touched.cityField && formik.errors.cityField}
				fullWidth
			/>
		</div>
	);
});

CityField.displayName = "CityField";
CityField.propTypes = {
	formik: PropTypes.any,
};

export const AddressField = memo(({ formik }) => {
	const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
	const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
	return (
		<div>
			<TextFieldComp
				fontColor={"inherit"}
				isRequired={false}
				id="addressField"
				name="addressField"
				label="Address*"
				placeholder="Enter your address"
				value={formik.values.addressField}
				onChange={handleChange}
				onBlur={handleBlur}
				error={
					formik.touched.addressField && Boolean(formik.errors.addressField)
				}
				helperText={formik.touched.addressField && formik.errors.addressField}
				fullWidth
			/>
		</div>
	);
});

AddressField.displayName = "AddressField";
AddressField.propTypes = {
	formik: PropTypes.any,
};

export const ExpiryDateField = memo(({ formik, isEdit = false }) => {
	const handleExpiryChange = useCallback((event) => {
		let value = event.target.value;
		value = value.replace(/\D/g, ""); // Remove non-digit characters

		// Automatically add "0" before single digit month not equal to "1" (to handle 2-9)
		if (value.length === 1 && value > 1) {
			value = "0" + value;
		}

		if (
			event.target.value.length === 2 &&
			event.nativeEvent.inputType === "deleteContentBackward"
		) {
			value = value.slice(0, 1);
		}

		// Add slash after two digits and limit total length to 5 (including slash)
		if (value.length >= 2) {
			value = value.slice(0, 2) + "/" + value.slice(2, 4);
		}
		formik.setFieldValue("expiryDate", value);
	}, []);

	const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
	return (
		<div>
			<TextFieldComp
				fontColor={"inherit"}
				isRequired={false}
				id="expiryDate"
				name="expiryDate"
				label="Expiry date (MM/YY)*"
				placeholder="MM/YY"
				value={formik.values.expiryDate}
				onChange={handleExpiryChange}
				onBlur={handleBlur}
				error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
				helperText={formik.touched.expiryDate && formik.errors.expiryDate}
				fullWidth
				disabled={isEdit}
			/>
		</div>
	);
});
ExpiryDateField.displayName = "ExpiryDateField";

ExpiryDateField.propTypes = {
	formik: PropTypes.any,
	isEdit: PropTypes.bool,
};

export const CVVField = memo(({ formik, isEdit = false }) => {
	const handleCvvChange = useCallback(
		(event) => {
			const value = event.target.value.replace(/\D/g, ""); // Remove non-digits
			// Determine if the card is an American Express card based on the card number
			const cardNumber = formik.values.cardNumber?.replace(/\s/g, ""); // Remove spaces for check
			const isAmexCard =
				cardNumber.startsWith("34") || cardNumber.startsWith("37");
			const maxLength = isAmexCard ? 4 : 3;
			formik.setFieldValue("cvv", value.slice(0, maxLength)); // Limit based on card type
		},
		[formik.values.cardNumber]
	);

	const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
	return (
		<div>
			<TextFieldComp
				fontColor={"inherit"}
				isRequired={false}
				id="cvv"
				name="cvv"
				label="CVV*"
				placeholder="Enter CVV"
				onChange={handleCvvChange}
				value={isEdit ? "***" : formik.values.cvv}
				onBlur={handleBlur}
				error={formik.touched.cvv && Boolean(formik.errors.cvv)}
				helperText={formik.touched.cvv && formik.errors.cvv}
				fullWidth
				disabled={isEdit}
			/>
		</div>
	);
});

CVVField.displayName = "CVVField";
CVVField.propTypes = {
	formik: PropTypes.any,
	isEdit: PropTypes.bool,
};

export const CountriesField = memo(
	({ countryHandler, previousSelectedCountry, isEdit = false }) => {
		const [selectedCountry, setSelectedCountry] = useState(
			isEdit ? previousSelectedCountry : null
		);
		// const countriesList = useSelector((state) => state.meta.countries);
		const { data: allCountriesList } = useGetAllCountries();
		const allCountries = allCountriesList?.data.data.countries;

		const handleCountry = useCallback((e) => {
			setSelectedCountry(e);
			countryHandler(e);
		}, []);

		return (
			<div>
				<DropDown
					label="Country*"
					placeholder={"Select Country"}
					data={allCountries}
					onChange={(e) => handleCountry(e)}
					selectedValue={selectedCountry}
					disabled={isEdit}
					isDisabledText={isEdit}
				/>
			</div>
		);
	}
);

CountriesField.displayName = "CountriesField";
CountriesField.propTypes = {
	countryHandler: PropTypes.func,
	previousSelectedCountry: PropTypes.string,
	isEdit: PropTypes.bool,
};

export const PostalCodeField = memo(({ formik }) => {
	const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
	const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);

	return (
		<TextFieldComp
			fontColor={"inherit"}
			isRequired={false}
			id="postalCode"
			name="postalCode"
			label="Postal Code*"
			placeholder="Enter postal code"
			onChange={handleChange}
			value={formik.values.postalCode}
			onBlur={handleBlur}
			error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
			helperText={formik.touched.postalCode && formik.errors.postalCode}
			fullWidth
		/>
	);
});
PostalCodeField.displayName = "PostalCodeField";
PostalCodeField.propTypes = {
	formik: PropTypes.any,
};

export const CardNumberField = memo(({ formik, isEdit = false }) => {
	const handleCardNumberChange = useCallback(
		(event) => {
			let value = event.target.value.replace(/\D/g, ""); // Remove non-digits
			const isAmexCard = value.startsWith("34") || value.startsWith("37");
			const isDinersClub = value.startsWith("30") || value.startsWith("38");
			const isVisaCardStartWith42 = value.startsWith("42");
			const maxLength = isAmexCard
				? 15
				: isDinersClub
					? 14
					: isVisaCardStartWith42
						? 16
						: 16;

			value = value.slice(0, maxLength); // Limit based on card type
			value = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Add space every 4 digits

			formik.setFieldValue("cardNumber", value);
		},
		[formik.setFieldValue]
	);
	const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
	return (
		<div>
			<TextFieldComp
				fontColor={"inherit"}
				isRequired={false}
				id="cardNumber"
				name="cardNumber"
				label="Card number*"
				autoComplete="cardNumber"
				placeholder="Enter your card number"
				value={formik.values.cardNumber}
				onChange={handleCardNumberChange}
				onBlur={handleBlur}
				error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
				helperText={formik.touched.cardNumber && formik.errors.cardNumber}
				fullWidth
				disabled={isEdit}
			/>
		</div>
	);
});

CardNumberField.displayName = "CardNumberField";
CardNumberField.propTypes = {
	formik: PropTypes.any,
	isEdit: PropTypes.bool,
};
