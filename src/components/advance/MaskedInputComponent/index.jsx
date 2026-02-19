"use client";

import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useMask } from "@react-input/mask";
import TextFieldComp from "../../atoms/inputFields/TextFieldComp";

const MaskedInputComponent = ({
  value,
  onInputChange,
  label,
  variant = "outlined",
  placeholder,
  textFieldProps,
  fullWidth = true,
  mask = "99999-9999999-9",
  onBlur,
  ...otherProps
}) => {
  let effectiveMask =
    mask && mask.trim() !== "" ? mask : "********************";

  // Replace '9' with '#' in the mask to avoid conflicts with typing the digit 9
  effectiveMask = effectiveMask.replace(/9/g, "#");

  const inputRef = useMask({
    mask: effectiveMask,
    replacement: {
      "#": /\d/,
      a: /[A-Za-z]/,
      A: /[A-Za-z]/,
      "*": /[A-Za-z0-9]/,
      _: /./, // Accept any character
    },
    showMask: false,
    separate: false,
    track: () => true,
  });

  // Sync the input value when the prop value changes
  useEffect(() => {
    if (inputRef.current && value !== inputRef.current.value) {
      inputRef.current.value = value || "";
    }
  }, [value, inputRef]);

  const handleChange = (e) => {
    const inputValue = e.target.value.toUpperCase();
    onInputChange(inputValue);
  };

  const handleBlur = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <TextFieldComp
      isRequired={true}
      label={label}
      variant={variant}
      placeholder={placeholder}
      fullWidth={fullWidth}
      onChange={handleChange}
      onBlur={handleBlur}
      InputProps={{
        inputRef: inputRef,
      }}
      {...textFieldProps}
      {...otherProps}
    />
  );
};

MaskedInputComponent.propTypes = {
  fullWidth: PropTypes.bool,
  label: PropTypes.any,
  mask: PropTypes.string,
  value: PropTypes.string,
  onInputChange: PropTypes.any,
  onBlur: PropTypes.func,
  placeholder: PropTypes.any,
  textFieldProps: PropTypes.any,
  variant: PropTypes.string,
};

export default MaskedInputComponent;
