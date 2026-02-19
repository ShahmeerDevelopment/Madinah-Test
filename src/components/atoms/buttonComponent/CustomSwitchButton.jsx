/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme, withMargins }) => ({
  width: 44,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: withMargins ? "0px" : 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      // transform: 'translateX(16px)',
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor:
          theme.palette.mode === "dark" ? "red" : theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 20,
    height: 20,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
const CustomSwitchButton = ({
  label = "",
  checked,
  onChange,
  withMargins = true,
  isDisabled = false,
}) => {
  return (
    <div>
      <FormControlLabel
        disabled={isDisabled}
        sx={{ m: withMargins ? 0 : "auto" }}
        control={
          <IOSSwitch
            sx={{ m: withMargins ? 0 : 1 }}
            checked={checked}
            onChange={onChange}
            withMargins={withMargins}
          />
        }
        label={label}
      />
    </div>
  );
};

CustomSwitchButton.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  withMargins: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default CustomSwitchButton;
