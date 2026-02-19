"use client";


import PropTypes from "prop-types";
import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { DEFAULT_OPTIONS } from "./defaultProps";
import TextFieldComp from "../inputFields/TextFieldComp";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";

export default function AutoCompleteComponent({
  options = DEFAULT_OPTIONS,
  textFieldProps,
  inputPropsOverrides = {},
  label,
  onChange,
  selectedValue,
  placeholder = "",
  ...props
}) {
  const [inputValue, setInputValue] = React.useState("");

  const handleDropDownChange = (event, value) => {
    setInputValue(value?.name || value || "");
    onChange(value);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleBlur = () => onChange(inputValue);

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
      freeSolo
      disableClearable
      disablePortal
      PopperComponent={CustomPopper}
      id="combo-box-demo"
      value={selectedValue}
      options={options}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.name || option}
      sx={{
        width: "100%",
      }}
      onChange={handleDropDownChange}
      renderInput={(params) => {
        return (
          <TextFieldComp
            {...params}
            {...textFieldProps}
            InputProps={{
              ...params.InputProps,
              ...inputPropsOverrides,
            }}
            // getInputValue={(searchedInput) => setSearch(searchedInput)}
            label={label}
            onBlur={handleBlur}
            placeholder={placeholder}
          />
        );
      }}
      {...props}
    />
  );
}

AutoCompleteComponent.propTypes = {
  disableListOnEmptyValue: PropTypes.bool,
  getSelection: PropTypes.func,
  inputPropsOverrides: PropTypes.object,
  label: PropTypes.any,
  options: PropTypes.any,
  textFieldProps: PropTypes.any,
  selectedValue: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};
