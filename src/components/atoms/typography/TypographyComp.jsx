"use client";

import React from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

//Next
const TypographyComp = ({
  variant = "body1",
  gutterBottom = false,
  component,
  children,
  sx,
  ...props
}) => {
  return (
    <Typography
      variant={variant}
      gutterBottom={gutterBottom}
      sx={{ ...sx }}
      component={component}
      {...props}
    >
      {children}
    </Typography>
  );
};

// Define the prop types
TypographyComp.propTypes = {
  children: PropTypes.node,
  component: PropTypes.any,
  gutterBottom: PropTypes.bool,
  sx: PropTypes.any,
  variant: PropTypes.oneOf([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "subtitle1",
    "subtitle2",
    "body1",
    "body2",
    "caption",
    "button",
    "overline",
    "srOnly",
    "inherit",
  ]),
};

export default TypographyComp;
