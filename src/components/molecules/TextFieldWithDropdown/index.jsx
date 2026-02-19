/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import PropTypes from "prop-types";
import React, { useEffect, useState, useRef } from "react";
import InputBase from "@mui/material/InputBase";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import MenuBtnComponent from "./MenuBtnComponent";
import { theme } from "@/config/customTheme";

const dropDownInitialData = [
  {
    value: 0,
    label: "First",
  },
  {
    value: 1,
    label: "Second",
  },
  {
    value: 2,
    label: "Third",
  },
];

const TextFieldWithDropdown = ({
  dropdownArr = dropDownInitialData,
  nonNegative = false,
  getValues = () => { },
  defaultCurrencyIndex = 0,
  fullWidth = true,
  inputFieldProps,
  selectFieldProps,
  containerProps,
  label,
  previousValue = "",
  handleBlurTextField = () => { },
  error = false,
  errorMessage = "",
  maxDigits = 10,
  disabledCurrency = false,
  symbol = "",
  ...otherProps
}) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const prevDropdownValueRef = useRef(null);

  const [values, setValues] = useState({
    dropdownValue: null,
    inputValue: "",
    symbol: "",
  });

  const updateValues = ({ dropdownVal, inputVal, symbol }) => {
    let temp = { ...values };
    if (dropdownVal !== undefined) {
      temp.dropdownValue = dropdownVal;
    }
    if (inputVal !== undefined) {
      temp.inputValue = inputVal;
    }
    temp.symbol = symbol;
    setValues(temp);
  };

  useEffect(() => {
    if (!initialLoad && values.dropdownValue !== null && values.dropdownValue !== prevDropdownValueRef.current) {
      prevDropdownValueRef.current = values.dropdownValue;
      getValues(values, symbol);
    }
  }, [values.dropdownValue]);

  useEffect(() => {
    const newDropdownValue = dropdownArr[defaultCurrencyIndex]?.value;
    prevDropdownValueRef.current = newDropdownValue;
    updateValues({
      dropdownVal: newDropdownValue,
      inputVal: Number(previousValue),
      symbol: dropdownArr[defaultCurrencyIndex]?.symbol,
    });
    setInitialLoad(false);
  }, [defaultCurrencyIndex, previousValue, defaultCurrencyIndex]);

  return (
    <StackComponent direction="column" spacing={0}>
      {label ? (
        <TypographyComp
          component="label"
          sx={{
            color: "#A1A1A8",
            fontWeight: 400,
            fontSize: "14px",
          }}
        >
          {label}
        </TypographyComp>
      ) : null}
      <StackComponent spacing={0} {...containerProps}>
        <MenuBtnComponent
          disabledCurrency={disabledCurrency}
          getSelection={(e) => {
            updateValues({ dropdownVal: e });
          }}
          {...selectFieldProps}
          options={dropdownArr}
        >
          {values?.dropdownValue}
        </MenuBtnComponent>
        <InputBase
          onBlur={(e) => {
            handleBlurTextField(e);
          }}
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: "16px",
            borderBottomRightRadius: "16px",
            height: "40px",
            border: `1px solid ${theme.palette.primary.gray}`,
            px: "0.4rem",
            color: theme.palette.primary.darkGray,
            // Add the following lines to hide the spinner controls
            "& input[type=number]::-WebkitInnerSpinButton, & input[type=number]::-WebkitOuterSpinButton":
            {
              "-webkit-appearance": "none",
              margin: 0,
            },
            "& input[type=number]": {
              "-moz-appearance": "textfield",
            },
          }}
          fullWidth={fullWidth}
          color="primary"
          value={values.inputValue}
          onChange={(e) => {
            if (nonNegative && +e.target.value < 0) {
              return;
            }
            if (maxDigits !== undefined && e.target.value.length > +maxDigits) {
              return;
            }
            updateValues({ inputVal: e.target.value });
          }}
          {...otherProps}
          {...inputFieldProps}
        />
      </StackComponent>
      {error ? (
        <TypographyComp
          color="error"
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
            color: "#E61D1D",
          }}
        >
          {errorMessage}
        </TypographyComp>
      ) : null}
    </StackComponent>
  );
};

TextFieldWithDropdown.propTypes = {
  containerProps: PropTypes.any,
  defaultCurrencyIndex: PropTypes.number,
  dropdownArr: PropTypes.array,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  fullWidth: PropTypes.bool,
  getValues: PropTypes.func,
  handleBlurTextField: PropTypes.func,
  inputFieldProps: PropTypes.any,
  label: PropTypes.string,
  maxDigits: PropTypes.number,
  nonNegative: PropTypes.bool,
  previousValue: PropTypes.number,
  selectFieldProps: PropTypes.any,
  value: PropTypes.number,
  disabledCurrency: PropTypes.bool,
  symbol: PropTypes.string,
};

export default TextFieldWithDropdown;
