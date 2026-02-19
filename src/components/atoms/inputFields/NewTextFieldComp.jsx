/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React from "react";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import PropTypes from "prop-types";
// import { RequiredSign } from "@/components/UI/Auth/signup/SignUp.style";
import StackComponent from "../StackComponent";
// import TypographyComp from "../typography/TypographyComp";

// Next
const NewTextFieldComp = ({
  id = "outlined-basic",
  label,
  variant = "outlined",
  //   isRequired = false,
  placeholder = "",
  error = false,
  helperText = "",
  autoComplete = "off",
  containerStyleOverrides,
  customHelperText,
  sx,
  fontColor = "#A1A1A8",
  inputFieldTextColor = "#606062",
  styleOverrides,
  forceHideHelper,
  isPagination = false,
  //   labelColor = "#A1A1A8",
  height,
  type,
  ...otherProps
}) => {
  return (
    <StackComponent
      spacing={0}
      direction="column"
      alignItems="flex-start"
      sx={{ width: "100%", ...containerStyleOverrides }}
    >
      {/* <TypographyComp
        component="label"
        htmlFor={id}
        sx={{
          color: labelColor,
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "16px",
          marginBottom: "2px !important",
        }}
      >
        {label}
        {isRequired && <RequiredSign>*</RequiredSign>}
      </TypographyComp> */}
      {!isPagination ? (
        <TextField
          id={id}
          type={type}
          variant={variant}
          label={label}
          placeholder={isPagination ? "" : placeholder} // No placeholder when pagination is active
          autoComplete={autoComplete}
          InputProps={{
            readOnly: isPagination,
            inputProps: {
              min: type === "number" ? 0 : undefined, // Prevent negative numbers if type is 'number'
            },
            // Custom styles to remove the spinner from number inputs
            style: {
              MozAppearance: type === "number" ? "textfield" : undefined,
              "&::-WebkitOuterSpinButton":
                type === "number"
                  ? { margin: 0, WebkitAppearance: "none" }
                  : undefined,
              "&::-WebkitInnerSpinButton":
                type === "number"
                  ? { margin: 0, WebkitAppearance: "none" }
                  : undefined,
            },
          }}
          sx={{
            margin: 0,

            color: fontColor,
            "& .MuiInputLabel-root": {
              transform: "translate(14px, 43%) scale(1)",
              "&.MuiInputLabel-shrink": {
                transform: "translate(14px, -9px) scale(0.75)",
              },
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              height: height,
              color: inputFieldTextColor,
              "& .MuiInputBase-input": {
                cursor: isPagination ? "pointer" : undefined, // Use default cursor for pagination
                lineHeight: "16px",
                caretColor: isPagination ? "transparent" : "primary.main", // Hide caret when pagination is active
                py: "8.5px",
                "&::selection": {
                  backgroundColor: isPagination ? "transparent" : undefined, // Disable text selection
                },
                pointerEvents: isPagination ? "none" : "auto", // Disable pointer events when pagination is active
                userSelect: isPagination ? "none" : "auto", // Prevent text selection
              },
              ...sx,
            },

            ...styleOverrides,
          }}
          {...otherProps}
        />
      ) : (
        <TextField
          {...otherProps}
          inputProps={{
            ...otherProps.inputProps,
            disabled: true,
            style: {
              MozAppearance: type === "number" ? "textfield" : undefined,
              "&::-WebkitOuterSpinButton":
                type === "number"
                  ? { margin: 0, WebkitAppearance: "none" }
                  : undefined,
              "&::-WebkitInnerSpinButton":
                type === "number"
                  ? { margin: 0, WebkitAppearance: "none" }
                  : undefined,
            },
          }}
          sx={{
            margin: 0,
            color: fontColor,
            "& .MuiInputLabel-root": {
              transform: "translate(14px, 43%) scale(1)",
              "&.MuiInputLabel-shrink": {
                transform: "translate(14px, -9px) scale(0.75)",
              },
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              height: height,
              color: inputFieldTextColor,
              "& .MuiInputBase-input": {
                cursor: isPagination ? "pointer" : undefined, // Use default cursor for pagination
                lineHeight: "16px",
                caretColor: isPagination ? "transparent" : "primary.main", // Hide caret when pagination is active
                py: "8.5px",
                "&::selection": {
                  backgroundColor: isPagination ? "transparent" : undefined, // Disable text selection
                },
                pointerEvents: isPagination ? "none" : "auto", // Disable pointer events when pagination is active
                userSelect: isPagination ? "none" : "auto", // Prevent text selection
              },
              ...sx,
            },

            ...styleOverrides,
          }}
        // ref={ref}
        />
      )}
      {customHelperText ? (
        <>{customHelperText}</>
      ) : (
        <>
          <FormHelperText
            sx={{
              ml: "2px",
              mt: "5px",
              color: error ? "red" : "auto",
              // minHeight: "20px",
              display: forceHideHelper ? "none" : "auto",
            }}
          >
            {helperText}
          </FormHelperText>
        </>
      )}
    </StackComponent>
  );
};

// Set PropTypes for type checking
NewTextFieldComp.propTypes = {
  autoComplete: PropTypes.string,
  containerStyleOverrides: PropTypes.any,
  customHelperText: PropTypes.any,
  error: PropTypes.bool,
  fontColor: PropTypes.string,
  forceHideHelper: PropTypes.any,
  helperText: PropTypes.string,
  id: PropTypes.string,
  inputFieldTextColor: PropTypes.string,
  inputPropsOverrides: PropTypes.any,
  isPagination: PropTypes.bool,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,

  startAdornment: PropTypes.any,
  styleOverrides: PropTypes.any,
  sx: PropTypes.any,
  variant: PropTypes.oneOf(["standard", "filled", "outlined"]),
  height: PropTypes.string,
  labelColor: PropTypes.string,
  type: PropTypes.string,
};

export default NewTextFieldComp;
