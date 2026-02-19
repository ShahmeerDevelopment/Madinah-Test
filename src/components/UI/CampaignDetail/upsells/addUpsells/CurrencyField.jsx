import React, { memo, useMemo, useState } from "react";
import TextFieldWithDropdown from "../../../../../components/molecules/TextFieldWithDropdown";
import { useSelector } from "react-redux";
import { formatNumberWithCommas } from "../../../../../utils/helpers";
import PropTypes from "prop-types";
import { useEffect } from "react";

const CurrencyField = memo(({ onValueChange, amount, resetTrigger, ...otherProps }) => {
	const countries = useSelector((state) => state.meta.countries);
	const { currency } = useSelector((state) => state.mutateCampaign);
	const [isTouched, setIsTouched] = useState(false);
	const [value, setValue] = useState({
		dropdownValue: null,
		inputValue: "",
		displayValue: amount,
	});

	// Logic to compute unique and active currencies
	const activeCurrencies = useMemo(() => {
		const uniqueCurrencies = Array.from(
			new Map(
				countries.map((eachCountry) => [
					eachCountry.currency.code,
					eachCountry.currency,
				]),
			).values(),
		);

		return uniqueCurrencies.filter((currency) => currency.isActive === true);
	}, [countries]);
	let defaultCurrencyIndex;

	// First, try to find the index of the specified currency
	if (currency) {
		defaultCurrencyIndex = activeCurrencies.findIndex(
			(eachCurr) => eachCurr.code === currency,
		);
	}

	// If the specified currency is not found (-1), or if `currency` is not provided, look for "USD"
	if (defaultCurrencyIndex === -1 || defaultCurrencyIndex === undefined) {
		defaultCurrencyIndex = activeCurrencies.findIndex(
			(eachCurr) => eachCurr.code === "USD",
		);
	}

	// If "USD" is also not found, you might default to the first currency or another default action
	if (defaultCurrencyIndex === -1) {
		defaultCurrencyIndex = 0; // or handle accordingly
	}

	useEffect(() => {
		if (resetTrigger) {
			setValue({
				dropdownValue: "",
				inputValue: "",
				displayValue: "",
			});
		}
	}, [resetTrigger]); // Listening to a specific reset trigger

	// Communicate changes to the parent component
	useEffect(() => {
		onValueChange({
			currency: value.dropdownValue,
			amount: value.inputValue,
		});
	}, [value, onValueChange]); // Updated only when value changes

	const handleNumberInputChange = (e) => {
		const { value } = e.target;
		// Remove commas for calculation and storage
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

	// Handle changes in the dropdown selection

	return (
		<TextFieldWithDropdown
			disabledCurrency
			label="Amount"
			dropdownArr={activeCurrencies
				.map((currency) => ({
					value: currency.code,
					label: currency.code,
				}))
				.filter((eachCur) => eachCur.value !== "")}
			defaultCurrencyIndex={defaultCurrencyIndex}
			inputFieldProps={{
				type: "text",
				placeholder: "Enter amount here",
				value: value.displayValue,
				onChange: handleNumberInputChange,
			}}
			maxDigits={10}
			nonNegative
			getValues={(vals) => {
				setValue(vals);
			}}
			{...otherProps}
			handleBlurTextField={() => setIsTouched(true)}
			error={isTouched && !value}
			errorMessage="Required field"
			previousValue={amount}
		/>
	);
});
CurrencyField.displayName = "CurrencyField";
CurrencyField.propTypes = {
	onValueChange: PropTypes.func,
	amount: PropTypes.number,
	resetTrigger: PropTypes.any,
};
export default CurrencyField;
