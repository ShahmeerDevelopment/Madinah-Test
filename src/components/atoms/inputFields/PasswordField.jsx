"use client";

import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import PropTypes from "prop-types";
import TextFieldComp from "./TextFieldComp";

const PasswordField = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  placeholder,
  isRequired,
  autoComplete,
  ...otherProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextFieldComp
      id={id}
      name={name}
      label={label}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      isRequired={isRequired}
      error={error}
      helperText={helperText}
      autoComplete={autoComplete}
      {...otherProps}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleToggleShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? (
                <VisibilityOffOutlinedIcon />
              ) : (
                <RemoveRedEyeOutlinedIcon />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

PasswordField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  autoComplete: PropTypes.any,
};
export default PasswordField;
