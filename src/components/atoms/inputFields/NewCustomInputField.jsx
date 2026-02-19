"use client";

import React, { memo, useCallback } from "react";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { theme } from "../../../config/customTheme";
import CurrencySelector from "./CurrencySelector";
import Box from "@mui/material/Box";

const CustomTextField = styled(TextField)(
  ({ monthlyDonation, isOneTimeDonations, isHighlighted }) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      padding: "13px",
      height: monthlyDonation && isOneTimeDonations ? "56px" : "56px",
      border: isHighlighted ? "2px solid transparent" : "2px solid #E9E9EB",
      background:
        "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box",
      "&.Mui-focused": {
        border: "2px solid transparent",

        background:
          "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box",
      },
      "& .MuiOutlinedInput-input": {
        // paddingRight: "100px", // Make space for dropdown
        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
          opacity: 0,
          pointerEvents: "none",
        },
        "&[type=number]": {
          "-moz-appearance": "textfield", // Firefox
        },
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 500,
      fontSize: "18px",
      lineHeight: "28px",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(14px, 9px) scale(1.5)",
      paddingLeft: "8px",
      color: theme.palette.primary.gray,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "blue",
    },
    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
    background: "white",
  })
);

const StyledDropdownWrapper = styled(Box)({
  position: "absolute",
  right: 0,
  top: 14,
  height: "100%",
  width: "80px",
  display: "flex",
  alignItems: "center",
  "& .MuiAutocomplete-root": {
    width: "100%",
  },
  "& .MuiOutlinedInput-root": {
    border: "none !important",
    background: "transparent !important",
    "&:hover": {
      border: "none !important",
    },
    "&.Mui-focused": {
      border: "none !important",
      background: "transparent !important",
    },
  },
});

const NewCustomInputField = memo(({
  value,
  onChange,
  onClick = () => { },
  min,
  monthlyDonation = false,
  isOneTimeDonations = false,
  isHighlighted,
  activeCurrencies,
  onCurrencyChange,
  currencyConversion,
  selectedCountry,
  isLoading = false,
}) => {
  // Memoize the click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    if (!isLoading) {
      onClick();
    }
  }, [isLoading, onClick]);

  // Memoize the change handler
  const handleChange = useCallback((e) => {
    if (!isLoading) {
      onChange(e);
    }
  }, [isLoading, onChange]);

  // Memoize currency change handler - this is the key optimization
  // The actual currency selection state is managed inside CurrencySelector
  const handleCurrencyChange = useCallback((newCurrency) => {
    if (!isLoading && onCurrencyChange) {
      onCurrencyChange(newCurrency);
    }
  }, [isLoading, onCurrencyChange]);

  return (
    <div onClick={handleClick}>
      <Box sx={{ position: "relative", opacity: isLoading ? 0.6 : 1 }}>
        <CustomTextField
          fullWidth
          type="number"
          onWheel={(e) => e.target.blur()}
          value={value}
          onChange={handleChange}
          placeholder={"Other amount"}
          variant="outlined"
          disabled={isLoading}
          InputProps={{
            inputProps: { min: min },
            endAdornment: (
              <StyledDropdownWrapper>
                <CurrencySelector
                  currencies={activeCurrencies}
                  selectedCurrency={selectedCountry}
                  onCurrencyChange={handleCurrencyChange}
                  placeholder={currencyConversion?.units}
                  disabled={isLoading}
                  textColor="#A1A1A8"
                />
              </StyledDropdownWrapper>
            ),
          }}
          InputLabelProps={{
            shrink: true,
          }}
          monthlyDonation={monthlyDonation}
          isOneTimeDonations={isOneTimeDonations}
          isHighlighted={isHighlighted}
          sx={{
            "& .MuiOutlinedInput-input": {
              marginTop: monthlyDonation || isOneTimeDonations ? 0 : "30px",
            },
          }}
        />
      </Box>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render when these specific props change
  const prevCountryId = prevProps.selectedCountry?._id || prevProps.selectedCountry?.id;
  const nextCountryId = nextProps.selectedCountry?._id || nextProps.selectedCountry?.id;
  return (
    prevProps.value === nextProps.value &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.monthlyDonation === nextProps.monthlyDonation &&
    prevProps.isOneTimeDonations === nextProps.isOneTimeDonations &&
    prevCountryId === nextCountryId &&
    prevProps.currencyConversion?.units === nextProps.currencyConversion?.units &&
    prevProps.activeCurrencies === nextProps.activeCurrencies &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.onCurrencyChange === nextProps.onCurrencyChange
  );
});

NewCustomInputField.displayName = "NewCustomInputField";

NewCustomInputField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  min: PropTypes.string,
  monthlyDonation: PropTypes.bool,
  isOneTimeDonations: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  currencyData: PropTypes.array,
  selectedCurrency: PropTypes.object,
  onCurrencyChange: PropTypes.func,
  activeCurrencies: PropTypes.array,
  currencyConversion: PropTypes.object,
  selectedCountry: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default NewCustomInputField;
