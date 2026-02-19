/* eslint-disable indent */
"use client";


import PropTypes from "prop-types";
import React from "react";
import AutoCompleteComponent from "../../atoms/AutoCompleteComponent";
import SearchIcon from "./SearchIcon";
import InputAdornment from "@mui/material/InputAdornment";
// import { borderColor } from "../../../pages/statistics/statisticsTable/FilterModel";

const SearchAutoComplete = ({
  options,
  label,
  onChange,
  selectedValue,
  placeholder = "",

  ...props
}) => {
  const borderColor = "#E9E9EB !important";
  return (
    <AutoCompleteComponent
      options={options}
      onChange={onChange}
      selectedValue={selectedValue}
      disableListOnEmptyValue
      label={label}
      textFieldProps={{
        size: "small",
        customBorderColor: borderColor,
      }}
      placeholder={placeholder}
      inputPropsOverrides={{
        startAdornment: (
          <InputAdornment>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

SearchAutoComplete.propTypes = {
  options: PropTypes.any,
  label: PropTypes.any,
  onChange: PropTypes.func,
  selectedValue: PropTypes.any,
  placeholder: PropTypes.string,
};

export default SearchAutoComplete;
