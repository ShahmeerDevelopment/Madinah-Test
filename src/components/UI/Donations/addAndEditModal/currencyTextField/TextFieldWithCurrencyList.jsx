"use client";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import DropDownText from "./DropDownText";
import { formatNumberWithCommas } from "@/utils/helpers";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const TextFieldWithCurrencyList = ({ amountHandler, data, disabled }) => {
	const [value, setValue] = useState({
		_id: "",
		dropdownValue: null,
		inputValue: "",
		displayValue: null,
	});

	useEffect(() => {
		if (value.dropdownValue && value.inputValue) {
			const selectedCurrency = data.find(
				(currency) => currency.code === value.dropdownValue,
			);
			if (selectedCurrency) {
				amountHandler({
					inputValue: value.inputValue,
					_id: selectedCurrency.currencyId,
				});
			}
		}
	}, [value]);

	let defaultCurrencyIndex;

	// If the specified currency is not found (-1), or if `currency` is not provided, look for "USD"
	if (defaultCurrencyIndex === undefined) {
		defaultCurrencyIndex = data.findIndex(
			(eachCurr) => eachCurr.code === "USD",
		);
	}

	// If "USD" is also not found, you might default to the first currency or another default action
	if (defaultCurrencyIndex === -1) {
		defaultCurrencyIndex = 0; // or handle accordingly
	}

	const handleNumberInputChange = (e) => {
		const { value } = e.target;
		const normalizedValue = value
			.replace(/[^0-9.]/g, "")
			.replace(/(\..*)\./g, "$1");

		const isOnlyZeros = /^0+\.?0*$/.test(normalizedValue);
		// Update state with raw number and formatted display value
		setValue((prevState) => ({
			...prevState,
			inputValue: isOnlyZeros ? "" : normalizedValue,
			displayValue: formatNumberWithCommas(normalizedValue),
		}));
	};
	return (
		<BoxComponent sx={{ mt: -0.4 }}>
			<DropDownText
				disabled={disabled}
				disabledCurrency
				label="Amount"
				dropdownArr={data
					.map((currency) => ({
						value: currency.code,
						label: currency.code,
					}))
					.filter((eachCur) => eachCur.value !== "")}
				defaultCurrencyIndex={defaultCurrencyIndex}
				inputFieldProps={{
					type: "text",
					placeholder: "Enter amount",
					value: value.inputValue,
					onChange: handleNumberInputChange,
				}}
				maxDigits={10}
				nonNegative
				getValues={(vals) => {
					setValue(vals);
				}}
				// handleBlurTextField={() => setIsTouched(true)}
				// error={isTouched && !value.inputValue}
				errorMessage="Required field"
			// previousValue={startingGoal}
			/>
		</BoxComponent>
	);
};
TextFieldWithCurrencyList.propTypes = {
	amountHandler: PropTypes.func,
	data: PropTypes.any,
	disabled: PropTypes.bool,
};
export default TextFieldWithCurrencyList;
