"use client";

import * as React from "react";
import PropTypes from "prop-types";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextFieldComp from "../../atoms/inputFields/TextFieldComp";
import { useState } from "react";
import { useEffect } from "react";
import { CUSTOM_DROPDOWN_DATA } from "./constant";
import { Popper, styled } from "@mui/material";
// import { top100Films } from './constant';

const filter = createFilterOptions();

const SvgComp = () => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5 9L11.2191 14.3306C11.6684 14.7158 12.3316 14.7158 12.7809 14.3306L19 9"
				stroke="#090909"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
};

const CustomDropDown = React.memo(
	({
		isLabel = true,
		label = "label",
		showError = false,
		placeholder = "placeholder",
		isHeightCustomizable = false,
		customPadding = "0px 6px 0px 0px",
		onChange = () => { },
		data = CUSTOM_DROPDOWN_DATA,
	}) => {
		const [value, setValue] = useState(null);
		const [touched, setTouched] = useState(false);
		const [error, setError] = useState(false);
		const [inputValue, setInputValue] = useState("");

		const handleInputChange = (event, newInputValue) => {
			setInputValue(newInputValue);
			onChange(newInputValue);
			if (!newInputValue) {
				setError(showError && touched); // Set error if empty
			} else {
				setError(false); // Clear error if not empty
			}
		};

		const handleDropDownChange = (event, value) => {
			onChange(value);
			setTouched(true);
			setValue(value);
			if (!value) {
				setError(showError && touched); // Set error if empty
			} else {
				setError(false); // Clear error if not empty
			}
		};

		const handleBlur = () => {
			setTouched(true);
			setValue(inputValue);
			onChange(inputValue);
			setError(showError && !inputValue); // Set error based on whether inputValue is empty
		};

		useEffect(() => {
			// Set error if both inputValue and selectedValue are falsy and showError is true
			setError(showError && touched && !value);
		}, [value, showError]);

		const CustomPopper = styled(Popper)({
			"& .MuiAutocomplete-listbox": {
				// maxHeight: "200px", // Adjust as needed
				// overflowY: "auto",
				// scrollbarWidth: "none", // For Firefox: thinner scrollbar
				// scrollbarColor: "#A1A1A8 transparent", // Custom color for scrollbar in Firefox

				"&::-webkit-scrollbar": {
					width: "4px",
					backgroundColor: "#fff",
				},
				"&::-webkit-scrollbar-thumb": {
					backgroundColor: "#E9E9EB", // Custom color for the scrollbar thumb
					borderRadius: "8px", // Rounded corners
				},
				"&::-webkit-scrollbar-track": {
					backgroundColor: "transparent", // Transparent track
				},
				// Completely hide the scrollbar buttons (up and down arrows)
				"&::-webkit-scrollbar-button": {
					display: "none", // Hide the scrollbar buttons
				},
			},
		});

		return (
			<Autocomplete
				value={value}
				fullWidth
				freeSolo
				PopperComponent={CustomPopper}
				disableClearable={!inputValue && !value}
				onChange={handleDropDownChange}
				onInputChange={handleInputChange}
				inputValue={inputValue}
				onBlur={handleBlur}
				filterOptions={(options, params) => {
					const filtered = filter(options, params);

					// if (params.inputValue !== '') {
					// 	filtered.push({
					// 		inputValue: params.inputValue,
					// 		title: `Add "${params.inputValue}"`,
					// 	});
					// }

					return filtered;
				}}
				id="free-solo-dialog-demo"
				options={data}
				popupIcon={<SvgComp />}
				getOptionLabel={(option) => {
					// for example value selected with enter, right from the input
					if (typeof option === "string") {
						return option;
					}
					if (option.inputValue) {
						return option.inputValue;
					}
					return option.title;
				}}
				selectOnFocus
				clearOnBlur
				// handleHomeEndKeys
				renderOption={(props, option) => (
					<li {...props} key={option._id}>
						{option.title || option}
					</li>
				)}
				// <li {...props} key={option.id}>{option.title}</li>
				sx={{
					...(isHeightCustomizable && {
						"& .MuiAutocomplete-inputRoot": {
							padding: `${customPadding} !important`,
							position: "relative",
							background: "green !important",
						},
					}),
				}}
				renderInput={(params) => {
					return (
						<TextFieldComp
							{...params}
							size={"small"}
							// disabled={isDisabledText}
							// isPagination={isPagination}
							label={isLabel ? label : null}
							placeholder={placeholder}
							// onClick={errorHandler}
							sx={{
								fontWeight: 400,
								fontSize: "14px",
								lineHeight: "16px",
								// height: '32px',
								padding: "5px 8px 5px 12px",
								color: "#A1A1A8",
								width: "100%",
							}}
							error={error}
							helperText={error ? "Required field" : ""}
						/>
					);
				}}
			/>
		);
	},
);
CustomDropDown.propTypes = {
	isLabel: PropTypes.bool,
	label: PropTypes.string,
	showError: PropTypes.bool,
	placeholder: PropTypes.string,
	isHeightCustomizable: PropTypes.bool,
	customPadding: PropTypes.string,
	onChange: PropTypes.func,
	data: PropTypes.arrayOf(PropTypes.object),
};
CustomDropDown.displayName = "CustomDropDown";
export default CustomDropDown;
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
