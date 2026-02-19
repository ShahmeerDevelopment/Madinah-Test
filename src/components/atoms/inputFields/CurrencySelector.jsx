"use client";

import React, { memo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";

const CustomPopper = styled(Popper)({
  "& .MuiAutocomplete-listbox": {
    "&::-webkit-scrollbar": {
      width: "4px",
      backgroundColor: "#fff",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#E9E9EB",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-button": {
      display: "none",
    },
  },
});

/**
 * CurrencySelector - A memoized currency dropdown component with co-located state
 * 
 * This component manages its own open/inputValue state locally to prevent
 * unnecessary re-renders of parent components when interacting with the dropdown.
 * Only the actual currency selection change is propagated to the parent.
 */
const CurrencySelector = memo(({
  currencies = [],
  selectedCurrency,
  onCurrencyChange,
  placeholder = "",
  disabled = false,
  textColor = "#A1A1A8",
}) => {
  // Co-located state - these states are managed locally to prevent parent re-renders
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setOpen(true);
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleInputChange = useCallback((event, newInputValue) => {
    setInputValue(newInputValue || "");
  }, []);

  const handleChange = useCallback((event, value) => {
    // Only propagate the actual selection to parent
    if (value && onCurrencyChange) {
      onCurrencyChange(value);
    }
    setInputValue("");
    setOpen(false);
  }, [onCurrencyChange]);

  return (
    <ClickAwayListener onClickAway={handleClose} touchEvent={false}>
      <Autocomplete
        freeSolo
        forcePopupIcon
        fullWidth
        disabled={disabled}
        PopperComponent={CustomPopper}
        disablePortal
        disableClearable
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => {
          // Handle both _id and id properties for compatibility
          const optionId = option?._id || option?.id;
          const valueId = value?._id || value?.id;
          return optionId === valueId;
        }}
        popupIcon={
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
        }
        value={selectedCurrency}
        onChange={handleChange}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        sx={{
          "& .MuiAutocomplete-inputRoot": {
            padding: "0px 6px 0px 0px !important",
            position: "relative",
          },
        }}
        id="currency-selector"
        options={currencies}
        getOptionLabel={(option) => option?.name || ""}
        renderInput={(params) => (
          <TextFieldComp
            {...params}
            size="small"
            disabled={false}
            isPagination={false}
            label={null}
            placeholder={placeholder}
            sx={{
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "16px",
              padding: "5px 8px 5px 12px",
              color: textColor,
              width: "100%",
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(0,0,0,0.38)",
                opacity: 1,
              },
            }}
            error={false}
            helperText=""
          />
        )}
      />
    </ClickAwayListener>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  // Only re-render if these specific props change
  const prevId = prevProps.selectedCurrency?._id || prevProps.selectedCurrency?.id;
  const nextId = nextProps.selectedCurrency?._id || nextProps.selectedCurrency?.id;
  return (
    prevId === nextId &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.currencies === nextProps.currencies &&
    prevProps.onCurrencyChange === nextProps.onCurrencyChange
  );
});

CurrencySelector.displayName = "CurrencySelector";

CurrencySelector.propTypes = {
  currencies: PropTypes.array,
  selectedCurrency: PropTypes.object,
  onCurrencyChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  textColor: PropTypes.string,
};

export default CurrencySelector;
