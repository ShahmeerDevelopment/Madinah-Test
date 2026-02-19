/* eslint-disable react/display-name */
"use client";


import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";

const ButtonComp = ({
  children,
  inputRef,
  color = "primary",
  variant = "contained",
  size = "small",
  onClick: handleClick,
  sx,
  height = "44px",
  fontWeight = 400,
  lineHeight = "20px",
  fontSize = "16px",
  padding = "12px 32px",
  borderRadius = "48px",
  ...props
}) => {
  const [clicked, setClicked] = useState(false);

  const onClick = (e) => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 500); // Reset the button size after 500 milliseconds
    if (handleClick) {
      handleClick(e);
    }
  };

  return (
    <Button
      sx={{
        textTransform: "none",
        borderRadius: borderRadius,
        boxShadow: "none",
        // fontFamily: "League Spartan, sans-serif",
        fontWeight: fontWeight,
        lineHeight: lineHeight,
        fontSize: fontSize,
        padding: padding,
        height: size === "normal" ? height : "auto",
        transition: "transform 0.3s ease", // Ensure smooth scaling transition
        transform: clicked ? "scale(1.03)" : "scale(1)", // Grow effect on click
        ...sx,
      }}
      variant={variant}
      color={color}
      onClick={onClick}
      size={size}
      inputref={inputRef}
      {...props}
    >
      {children}
    </Button>
  );
};

ButtonComp.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "error",
    "info",
    "warning",
    "inherit",
  ]),
  height: PropTypes.string,
  inputRef: PropTypes.any,
  onClick: PropTypes.func,
  size: PropTypes.string,
  sx: PropTypes.any,
  variant: PropTypes.oneOf(["contained", "outlined", "text"]),
  fontWeight: PropTypes.any,
  lineHeight: PropTypes.string,
  fontSize: PropTypes.any,
  padding: PropTypes.string,
  borderRadius: PropTypes.string,
};

export default ButtonComp;
