/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import * as Yup from "yup";

export const bankInformationSchema = (countryList, payoutMethod) => {
	return Yup.object().shape({
		accountName: Yup.string().required("Required field"),
		bankName: Yup.string().required("Required field"),
		accountNumber:
			countryList?.name === "United States" || countryList?.name === "Canada"
				? Yup.string()
					.required("Required field")
					.matches(/^\d{3,}$/, "Account number must be at least 3 digits")
				: countryList?.name === "United Kingdom"
					? Yup.string()
						.required("Required field")
						.matches(/^\d{8}$/, "Account number must be exactly 8 digits")
					: null,

		routingNumber:
			countryList?.name === "United States"
				? Yup.string().required("Required field")
				: null,
		iban:
			countryList?.name === "United States" ||
				countryList?.name === "United Kingdom" ||
				countryList?.name === "Canada"
				? null
				: Yup.string()
					.required("Required field"),
		// .matches(
		// 	/^[A-Z]{2}\d{7}[0-9A-Z]{17}$/,
		// 	"Invalid IBAN format: Must start with 2 letters, followed by 7 digits, then 17 letters or numbers"
		// )
		// .test(
		// 	"is-uppercase",
		// 	"IBAN must be uppercase",
		// 	(value) => value === value?.toUpperCase()
		// ),

		swift:
			countryList?.name === "United States" ||
				countryList?.name === "United Kingdom" ||
				countryList?.name === "Canada"
				? null
				: Yup.string()
					.required("Required field"),
		// .matches(
		// 	/^[A-Z]{6}[0-9A-Z]{5}$/,
		// 	"Invalid format: Use this format \"AAAAAA11111\" with all uppercase letters"
		// )
		// .test(
		// 	"is-uppercase",
		// 	"SWIFT code must be uppercase",
		// 	(value) => value === value?.toUpperCase()
		// ),
		sortCode:
			countryList?.name === "United Kingdom"
				? Yup.string()
					.required("Required field")
					.matches(/^\d{6}$/, "Sort code must be exactly 6 digits")
				: null,
		instituteNumber:
			countryList?.name === "Canada" && payoutMethod?.name === "EFT"
				? Yup.string()
					.required("Required field")
					.matches(/^\d{3}$/, "Institute number must be exactly 3 digits")
				: null,
		transitNumber:
			countryList?.name === "Canada" && payoutMethod?.name === "EFT"
				? Yup.string()
					.required("Required field")
					.matches(/^\d{5}$/, "Transit number must be exactly 5 digits")
				: null,
	});
};
