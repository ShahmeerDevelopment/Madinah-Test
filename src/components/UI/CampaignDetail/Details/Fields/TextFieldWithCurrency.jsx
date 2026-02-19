/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import PropTypes from "prop-types";
import React from "react";
import InputBase from "@mui/material/InputBase";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { theme } from "@/config/customTheme";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const TextFieldWithCurrency = ({
  containerProps,
  label = "",
  handleBlurTextField = () => {},
  error = false,
  errorMessage = "",
  symbol = "USD",
  fullWidth = true,
  type = "number",
  onChange = () => {},
  value,
  inputFieldProps,
}) => {
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
        <BoxComponent
          sx={{
            borderLeft: "1px solid #A1A1A8",
            borderTop: "1px solid #A1A1A8",
            borderBottom: "1px solid #A1A1A8",
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
            // width: "30px",
            padding: "0.6rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#606062",
            fontSize: "15px",
          }}
        >
          {symbol}
        </BoxComponent>
        <InputBase
          type={type}
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
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
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

TextFieldWithCurrency.propTypes = {
  containerProps: PropTypes.any,
  dropdownArr: PropTypes.array,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  fullWidth: PropTypes.bool,
  handleBlurTextField: PropTypes.func,
  inputFieldProps: PropTypes.any,
  label: PropTypes.string,
  value: PropTypes.number,
  symbol: PropTypes.string,
  type: PropTypes.string,
};

export default TextFieldWithCurrency;
