/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
"use client";


import PropTypes from "prop-types";
import React from "react";
import TextFieldComp from "../../atoms/inputFields/TextFieldComp";
import { InputAdornment } from "@mui/material";

const FullWidthInputWithLength = ({
  label = "Label",
  adornmentChildren = "9/10",
  adornmentPosition = "end",
  withAdornment = true,
  helperText,
  subtitleField = false,
  // adornmentIsADropDown,
  ...otherProps
}) => {
  return (
    <TextFieldComp
      label={label}
      fullWidth
      inputProps={{
        maxLength: subtitleField ? undefined : 200,
      }}
      helperText={helperText}
      InputProps={
        withAdornment
          ? adornmentPosition === "start"
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    {adornmentChildren}
                  </InputAdornment>
                ),
              }
            : {
                endAdornment: (
                  <InputAdornment position="end">
                    {adornmentChildren}
                  </InputAdornment>
                ),
              }
          : null
      }
      {...otherProps}
    />
  );
};

FullWidthInputWithLength.propTypes = {
  adornmentChildren: PropTypes.string,
  adornmentPosition: PropTypes.string,
  label: PropTypes.string,
  withAdornment: PropTypes.bool,
  helperText: PropTypes.any,
  subtitleField: PropTypes.bool,
};

export default FullWidthInputWithLength;
