"use client";

import React from "react";
import PropTypes from "prop-types";

import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import TypographyComp from "../typography/TypographyComp";
import FormControlLabel from "@mui/material/FormControlLabel";
import { theme } from "@/config/customTheme";

// Next
const CheckBoxComp = ({
  label,
  checked,
  onChange = () => { },
  specialIcon = false,
  specialIconColor = "#22CA33",
  isStoredCardSelected = false,
  ml = 3,
  mt = -4,
  fontSize = "14px"
}) => {
  let checkboxProps = {
    size: "small",
    checked,
    onChange,
  };

  if (specialIcon) {
    checkboxProps.checkedIcon = (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          y="0.5"
          width="18"
          height="18"
          rx="4"
          fill={
            isStoredCardSelected ? theme.palette.primary.gray : specialIconColor
          }
        />
        <path
          d="M5.5 9.5L8.3 12.5L12.5 6.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
    checkboxProps.icon = (
      <div
        style={{
          width: "18px",
          height: "18px",
          border: `2px solid ${isStoredCardSelected ? theme.palette.primary.gray : specialIconColor
            }`,
          borderRadius: "5px",
        }}
      >
        &nbsp;
      </div>
    );
  }
  return (
    <FormGroup
      row
      sx={{
        alignItems: "center",
        color: "grey",
        // background: 'green',
      }}
    >
      <div>
        <FormControlLabel
          control={
            <Checkbox
              disabled={isStoredCardSelected}
              size="small"
              checked={checked}
              onChange={onChange}
              {...checkboxProps}
            />
          }
          label=""
        />
      </div>
      <TypographyComp
        component="span"
        sx={{
          fontSize: fontSize,
          ml: ml,
          textAlign: "left",
          mt: mt,
          lineHeight: "16px",
          fontWeight: "400",
          color: isStoredCardSelected ? theme.palette.primary.gray : "#090909",
        }}
      >
        {label}
      </TypographyComp>
    </FormGroup>
  );
};

CheckBoxComp.propTypes = {
  checked: PropTypes.any,
  error: PropTypes.any,
  helperText: PropTypes.any,
  label: PropTypes.any,
  onChange: PropTypes.func,
  specialIcon: PropTypes.bool,
  specialIconColor: PropTypes.string,
  mt: PropTypes.any,
  ml: PropTypes.any,
  isStoredCardSelected: PropTypes.any,
};

export default CheckBoxComp;
