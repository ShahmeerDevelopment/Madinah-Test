/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
"use client";

import React, { memo, useCallback, useState } from "react";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import {
	CANADA_PAYOUT_METHOD,
	DROPDOWN_BANK_ACCOUNT_TYPE,
	DROPDOWN_BANK_CLASS,
	PAYOUT_METHOD,
	USA_PAYOUT_METHOD,
} from "@/config/constant";
import BankFileUpload from "./BankFileUpload";
import DropDown from "@/components/atoms/inputFields/DropDown";
import { FieldWrapper } from "../PersonalInformation";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { theme } from "@/config/customTheme";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { bankInformationSchema } from "./formValidation";
import FastTextField from "@/components/molecules/FastTextField/FastTextField";
import { useSelector } from "react-redux";

const findDefaultValueForArray = (arr, key, iterator = "_id") => {
	return arr.find((eachItem) => eachItem[iterator] === key);
};

const getDefaultPayoutMethod = (countryName, key) => {
	const handleDefaultValue = (arr) => {
		return findDefaultValueForArray(arr, key);
	};
	switch (countryName) {
		case "United States": {
			return handleDefaultValue(USA_PAYOUT_METHOD);
		}
		case "Canada": {
			return handleDefaultValue(CANADA_PAYOUT_METHOD);
		}
		default: {
			return handleDefaultValue(PAYOUT_METHOD);
		}
	}
};

const BankInformationForm = memo(
	({ countriesData, onUpload, isLoading, defaultFormState, createCampaign = false }) => {
		const bankInformation = useSelector((state) => state?.campaign?.bankInformation);
		const bankInfoImages = useSelector((state) => state?.campaign?.bankInfoImages);
		const countryCurrency = countriesData.map((item) => {
			return {
				_id: item._id,
				name: `${item.name} ${item.currency.code}`,
			};
		});

		const defaultCurrency = findDefaultValueForArray(
			countryCurrency,
			createCampaign ? bankInformation?.currencyId : defaultFormState?.bankInfo?.currencyId,
		);

		const defaultCountry = findDefaultValueForArray(
			countriesData,
			createCampaign ? bankInformation?.countryId : defaultFormState?.bankInfo?.countryId,
		);

		const defaultClass = findDefaultValueForArray(
			DROPDOWN_BANK_CLASS,
			createCampaign ? bankInformation?.accountClass : defaultFormState?.bankInfo?.accountClass,
		);

		const defaultAccountType = findDefaultValueForArray(
			DROPDOWN_BANK_ACCOUNT_TYPE,
			createCampaign ? bankInformation?.accountType : defaultFormState?.bankInfo?.accountType,
		);

		const [selectedValue, setSelectedValue] = useState(defaultCurrency || null);
		const [accountClass, setAccountClass] = useState(defaultClass || null);
		const [countryList, setCountryList] = useState(defaultCountry || null);

		const defaultPayoutMethod = getDefaultPayoutMethod(
			countryList?.name,
			createCampaign ? bankInformation?.payoutMethod : defaultFormState?.bankInfo?.payoutMethod,
		);

		const [accountType, setAccountType] = useState(defaultAccountType || null);
		const [payoutMethod, setPayoutMethod] = useState(
			defaultPayoutMethod || null,
		);

		const [imagesData, setImagesData] = useState(createCampaign ? bankInfoImages : null);
		const imagesDataUrlHandler = (value) => {
			setImagesData(value);
		};

		const initialValues = {
			accountName: createCampaign ? bankInformation?.accountName : defaultFormState?.bankInfo?.accountName,
			bankName: createCampaign ? bankInformation?.bankName : defaultFormState?.bankInfo?.bankName,
			routingNumber: createCampaign ? bankInformation?.routingNumber : defaultFormState?.bankInfo?.routingNumber,
			sortCode: createCampaign ? bankInformation?.sortCode : defaultFormState?.bankInfo?.sortCode,
			swift: createCampaign ? bankInformation?.swiftCode : defaultFormState?.bankInfo?.swift || defaultFormState?.bankInfo?.swiftCode,
			accountNumber: createCampaign ? bankInformation?.accountNumber : defaultFormState?.bankInfo?.accountNumber,
			iban: createCampaign ? bankInformation?.ibanNumber : defaultFormState?.bankInfo?.ibanNumber,
			instituteNumber: createCampaign ? bankInformation?.instituteNumber : defaultFormState?.bankInfo?.instituteNumber,
			transitNumber: createCampaign ? bankInformation?.transitNumber : defaultFormState?.bankInfo?.transitNumber,
		};

		const submitHandler = (values) => {
			if (accountClass === null) {
				return;
			}
			if (payoutMethod === null) {
				return;
			}
			if (accountType === null) {
				return;
			}
			onUpload(
				values,
				selectedValue,
				accountClass,
				countryList,
				accountType,
				payoutMethod,
				imagesData,
			);
		};
		const isFormEmpty =
			accountClass === null ||
			selectedValue === null ||
			countryList === null ||
			accountType === null ||
			payoutMethod === null ||
			accountClass === null ||
			!imagesData ||
			imagesData.length < 1;

		const countryCurrencyHandler = useCallback(
			(value) => setSelectedValue(value),
			[],
		);
		const countryHandler = useCallback((value) => setCountryList(value), []);
		const bankAccountClassHandler = useCallback(
			(value) => setAccountClass(value),
			[],
		);
		const bankAccountTypeHandler = useCallback(
			(value) => setAccountType(value),
			[],
		);
		const payoutMethodHandler = useCallback(
			(value) => setPayoutMethod(value),
			[],
		);

		return (
			<Formik
				initialValues={initialValues}
				validationSchema={bankInformationSchema(countryList, payoutMethod)}
				onSubmit={submitHandler}
			>
				{({ isValid }) => {
					return (
						<Form>
							<DropDown
								label="Bank Account Settlement Currency*"
								placeholder={"Select an option"}
								isLabel={true}
								data={countryCurrency}
								onChange={countryCurrencyHandler}
								selectedValue={selectedValue}
								showError={true}
							/>
							<TypographyComp
								sx={{
									fontSize: "14px",
									color: theme.palette.primary.gray,
									lineHeight: "16px",
									letterSpacing: "-0.41px",
									mb: 2,
									mt: selectedValue === null ? 0 : -1,
									align: "left",
								}}
							>
								This is the currency you will be paid in. If your local currency
								is not supported, please choose one that you know your bank
								supports. US Dollar is likely a good choice.
							</TypographyComp>
							<FieldWrapper>
								<FastTextField
									name="accountName"
									label={"Name on the Account"}
									isRequired
									placeholder={"Must match bank records"}
									fullWidth
								/>
								<DropDown
									label="Country*"
									isLabel={true}
									placeholder={"Select an option"}
									data={countriesData}
									onChange={countryHandler}
									selectedValue={countryList}
									showError={true}
								/>
							</FieldWrapper>
							<FieldWrapper>
								<FastTextField
									placeholder={"Enter Bank Name "}
									name="bankName"
									label={"Bank Name"}
									isRequired
									fullWidth
								/>
								<DropDown
									label="Bank Account Class*"
									isLabel={true}
									placeholder={"Select an option"}
									data={DROPDOWN_BANK_CLASS}
									onChange={bankAccountClassHandler}
									selectedValue={accountClass}
									showError={true}
								/>
							</FieldWrapper>
							<FieldWrapper>
								<DropDown
									label="Bank Account Type*"
									isLabel={true}
									placeholder={"Select an option"}
									data={DROPDOWN_BANK_ACCOUNT_TYPE}
									onChange={bankAccountTypeHandler}
									selectedValue={accountType}
									showError={true}
								/>
								<DropDown
									label="Payout method*"
									placeholder={"Select an option"}
									isLabel={true}
									data={
										countryList?.name === "United States"
											? USA_PAYOUT_METHOD
											: countryList?.name === "Canada"
												? CANADA_PAYOUT_METHOD
												: PAYOUT_METHOD
									}
									// onChange={(value) => setPayoutMethod(value)}
									onChange={payoutMethodHandler}
									selectedValue={payoutMethod}
									showError={true}
								/>
							</FieldWrapper>
							<FieldWrapper>
								{countryList?.name === "United States" ? (
									<>
										<FastTextField
											placeholder={
												"9 digits and is found on the front of your check"
											}
											name="routingNumber"
											label={"Routing number"}
											isRequired
											fullWidth
										/>
									</>
								) : countryList?.name === "United Kingdom" ? (
									<>
										<FastTextField
											placeholder={"Enter sort code "}
											name="sortCode"
											label={"Sort Code"}
											isRequired
											fullWidth
										/>
									</>
								) : countryList?.name === "Canada" &&
									payoutMethod?.name === "EFT" ? null : (
									<>
										<FastTextField
											name="swift"
											placeholder={"Enter Swift/BIC here "}
											label={"Swift/BIC"}
											isRequired
											fullWidth
										/>
									</>
								)}
								{countryList?.name === "United States" ||
									countryList?.name === "United Kingdom" ||
									(countryList?.name === "Canada" &&
										payoutMethod?.name === "Wire") ? (
									<>
										<FastTextField
											placeholder={
												countryList?.name === "United Kingdom"
													? "Enter account number"
													: "3 or more digits and is found on the front of your check"
											}
											name="accountNumber"
											label={"Account number"}
											isRequired
											fullWidth
										/>
									</>
								) : countryList?.name === "Canada" &&
									payoutMethod?.name === "EFT" ? (
									<>
										<FastTextField
											placeholder={"Institute number"}
											name="instituteNumber"
											label={"Institute Number"}
											isRequired
											fullWidth
										/>
										<FastTextField
											name="transitNumber"
											label={"Transit Number"}
											isRequired
											fullWidth
										/>
										<FastTextField
											placeholder={
												"3 or more digits and is found on the front of your check"
											}
											name="accountNumber"
											label={"Account number"}
											isRequired
											fullWidth
										/>
									</>
								) : (
									<>
										<FastTextField
											name="iban"
											placeholder={"Enter IBAN"}
											label={"IBAN"}
											isRequired
											fullWidth
										/>
									</>
								)}
							</FieldWrapper>
							<BoxComponent sx={{ mb: { xs: 3, sm: 0 } }}>
								<BankFileUpload
									imagesDataUrl={imagesDataUrlHandler}
									defaultFormState={defaultFormState}
									createCampaign={createCampaign}
								/>
							</BoxComponent>
							<SubmitButton
								type="submit"
								isContinueButtonDisabled={isFormEmpty || isLoading || !isValid}
							>
								{isLoading ? "Updating..." : "Continue"}
							</SubmitButton>
						</Form>
					);
				}}
			</Formik>
		);
	},
);

BankInformationForm.displayName = "BankInformationForm";
BankInformationForm.propTypes = {
	countriesData: PropTypes.array,
	defaultFormState: PropTypes.any,
	isLoading: PropTypes.bool,
	onUpload: PropTypes.func,
	createCampaign: PropTypes.bool,
};
export default BankInformationForm;
