"use client";

import React, { memo } from "react";
import PropTypes from "prop-types";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import CalenderIcon from "@/components/UI/Statistics/icons/CalenderIcon";
import DropDownIcon from "@/components/UI/Statistics/icons/DropDownIcon";
import { theme } from "../../../config/customTheme";

const CalenderButton = memo(
  ({
    content = "Button",
    onClickHandler,
    marginBottom = "0px",
    width = "auto",
    marginTop = "3px",
    boxShadow = "0px 0px 100px 0px rgba(0, 0, 0, 0.06)",
    height = "34px",
    sx,
  }) => {
    return (
      <ButtonComp
        fontWeight={500}
        fontSize={"12px"}
        onClick={onClickHandler}
        lineHeight="16px"
        size="normal"
        height={height}
        startIcon={<CalenderIcon />}
        endIcon={<DropDownIcon />}
        borderRadius={"12px"}
        padding={"6px 12px 6px 12px"}
        sx={{
          width: width,
          marginBottom: marginBottom,
          marginTop: marginTop,
          background: "#FFFFFF",
          boxShadow: boxShadow,
          color: theme.palette.primary.darkGray,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "& .MuiButton-startIcon": {
            marginRight: "8px",
          },
          "& .MuiButton-endIcon": {
            marginLeft: "auto",
          },
          "&:hover": {
            backgroundColor: "#FFFFFF", // Customize hover color here
            opacity: 0.8,
          },
          "&:active": {
            backgroundColor: "#FFFFFF", // Customize active color here
            // boxShadow: 'inset 0 3px 5px rgba(0, 0, 0, 0.125)',
            boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)", // Optional: Inner shadow for active state
          },
          "&:focus": {
            backgroundColor: "#yourCustomFocusColor", // Customize focus color here
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)", // Optional: Outer glow for focus state
          },
          "&:focus-visible": {
            boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)", // Additional removal in case of modern browsers
          },
          ...sx,
        }}
      >
        {content}
      </ButtonComp>
    );
  }
);

CalenderButton.propTypes = {
  content: PropTypes.string,
  onClickHandler: PropTypes.func,
  marginBottom: PropTypes.string,
  width: PropTypes.string,
  marginTop: PropTypes.string,
};

CalenderButton.displayName = "CalenderButton";
export default CalenderButton;
