"use client";

import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from "prop-types";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import { DROPDOWN_DATA } from "./defaultProps";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";

const DropDown = ({
  data = DROPDOWN_DATA,
  placeholder = "",
  label = "Label",
  onChange,
  selectedValue,
  disableClearable = false,
  isLabel = true,
  isHeightCustomizable = false,
  disabled = false,
  showError = false,
  customPadding = "0px 6px 0px 0px",
  isDisabledText = false,
  isPagination = false,
  isDropDownIcon = false,
  height,
  textColor = "#A1A1A8",
  newDonation = false,
}) => {
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false); // State to control open/close of Autocomplete

  const handleDropDownChange = (event, value) => {
    onChange(value);
    setError(showError && !value);
    setInputValue(""); // Reset inputValue when item is selected from dropdown
    setOpen(false); // Close dropdown after selecting an item
  };

  useEffect(() => {
    // Set error if both inputValue and selectedValue are falsy and showError is true
    setError(showError && !inputValue && !selectedValue);
  }, [inputValue, selectedValue, showError]);

  const handleInputChange = (event) => {
    setInputValue(event?.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    <ClickAwayListener onClickAway={handleClose} touchEvent={false}>
      <Autocomplete
        freeSolo={isDropDownIcon}
        fullWidth
        disabled={disabled}
        PopperComponent={CustomPopper}
        // size="small"
        disablePortal
        disableClearable={disableClearable}
        open={open} // Control open state of Autocomplete
        onOpen={handleOpen} // Handle opening of Autocomplete
        onClose={handleClose} // Handle closing of Autocomplete
        isOptionEqualToValue={(option, value) => option._id === value._id} // Custom comparison function
        popupIcon={
          isPagination || newDonation ? (
            <div>
              <svg
                style={{ marginTop: "5px" }}
                width="20"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 9L11.2191 14.3306C11.6684 14.7158 12.3316 14.7158 12.7809 14.3306L19 9"
                  stroke="#A1A1A8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 9L11.2191 14.3306C11.6684 14.7158 12.3316 14.7158 12.7809 14.3306L19 9"
                stroke={textColor}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )
        }
        // value={selectedValue || null}
        value={selectedValue}
        onChange={handleDropDownChange}
        onInputChange={handleInputChange}
        sx={{
          ...(isHeightCustomizable && {
            "& .MuiAutocomplete-inputRoot": {
              padding: `${customPadding} !important`,
              position: "relative",
            },
          }),
        }}
        id="combo-box-demo"
        options={data}
        getOptionLabel={(option) => option.name}
        // isOptionEqualToValue={(option, value) => option.value === value.value} // Custom comparison function
        renderInput={(params) => {
          return (
            <TextFieldComp
              {...params}
              size={"small"}
              disabled={isDisabledText}
              isPagination={isPagination}
              label={isLabel ? label : null}
              placeholder={placeholder}
              // onClick={errorHandler}
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "16px",
                height: height,
                padding: "5px 8px 5px 12px",
                color: textColor,
                width: "100%",
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(0,0,0,0.38)", // Change placeholder color to red
                  opacity: 1, // Ensure the color is fully opaque
                },
              }}
              error={error}
              helperText={error ? "Required field" : ""}
            />
          );
        }}
      />
    </ClickAwayListener>
  );
};

DropDown.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  selectedValue: PropTypes.object,
  isLabel: PropTypes.bool,
  disableClearable: PropTypes.bool,
  isHeightCustomizable: PropTypes.bool,
  disabled: PropTypes.bool,
  showError: PropTypes.bool,
  customPadding: PropTypes.string,
  isDisabledText: PropTypes.bool,
  isPagination: PropTypes.bool,
  isDropDownIcon: PropTypes.bool,
  height: PropTypes.string,
  textColor: PropTypes.string,
};

export default DropDown;
