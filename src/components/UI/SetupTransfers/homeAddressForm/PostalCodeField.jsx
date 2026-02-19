/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MaskedInputComponent from "@/components/advance/MaskedInputComponent";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";

const PostalCodeField = ({ selectedValue, onClick, zipValue }) => {
	const [zip, setZip] = useState(zipValue);
	const [zipTouched, setZipTouched] = useState(false);
	const [errors, setErrors] = useState({});

	const addError = (key, val) => {
		let temp = { ...errors };
		temp[key] = val;
		setErrors(temp);
	};
	const removeError = (key) => {
		let temp = { ...errors };
		delete temp[key];
		setErrors(temp);
	};

	const validateZip = (zip) => {
		let hasError = false;
		if (!zip || zip === "" || zip.includes("_")) {
			addError("zipCode", "Required Field");
			hasError = true;
		} else {
			removeError("zipCode");
		}
		if (
			selectedValue &&
			selectedValue?.name !== "United Kingdom" &&
			selectedValue?.postalCodeValidator
		) {
			const fixedPostalCodeValidator =
				selectedValue.postalCodeValidator.replace(/d/g, "\\d");
			const postalCodeRegex = new RegExp(fixedPostalCodeValidator);
			const isValidZip = postalCodeRegex.test(zip);

			if (!isValidZip) {
				addError("zipCode", "Invalid ZIP/Postal Code format");
				hasError = true;
			} else if (isValidZip && errors["zipCode"]) {
				removeError("zipCode");
			}
		}
		return hasError;
	};

	useEffect(() => {
		const hasError = validateZip(zip);
		onClick(zip, hasError);
	}, [zip, selectedValue, onClick]);


	const zipHandler = (e) => setZip(e);

	return (
		<div style={{ width: "100%" }}>
			{selectedValue ? (
				<>
					{selectedValue.name !== "United Kingdom" &&
						selectedValue?.postalCodeValidator !== "" ? (
						<MaskedInputComponent
							mask={selectedValue?.mask}
							textFieldProps={{
								error: zipTouched && Boolean(errors.zipCode),
								helperText: zipTouched && errors.zipCode,
							}}
							label={
								selectedValue?.name === "United States" ||
									selectedValue?.name === "Philippines"
									? "Zip Code"
									: "Postal Code"
							}
							placeholder={
								selectedValue === null
									? "Enter Postal Code"
									: selectedValue?.postalCodeFormat === ""
										? "123123"
										: selectedValue?.postalCodeFormat
							}
							fullWidth
							name="zipCode"
							value={zip}
							onInputChange={(e) => zipHandler(e)}
							onBlur={() => setZipTouched(true)}
						/>
					) : (
						<TextFieldComp
							isRequired={true}
							label={
								selectedValue?.name === "United States"
									? "Zip Code"
									: "Postal Code"
							}
							placeholder={
								selectedValue === null
									? "Enter Postal Code"
									: selectedValue?.postalCodeFormat === ""
										? "123123"
										: selectedValue?.postalCodeFormat
							}
							fullWidth
							name="zipCode"
							value={zip}
							onChange={(e) => zipHandler(e.target.value)}
							onBlur={() => setZipTouched(true)}
							error={zipTouched && Boolean(errors.zipCode)}
							helperText={zipTouched && errors.zipCode}
						/>
					)}
				</>
			) : null}
		</div>
	);
};

PostalCodeField.propTypes = {
	selectedValue: PropTypes.any,
	onClick: PropTypes.func,
	zipValue: PropTypes.any,
};
export default PostalCodeField;
