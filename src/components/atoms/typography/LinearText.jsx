"use client";

import React from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { theme } from "@/config/customTheme";

// Next
const LinearText = ({
  children,
  fontSize = "1rem",
  fontWeight = "bold",
  lineHeight,
  ...otherProps
}) => {
  return (
    <Typography
      component="span"
      sx={{
        background: theme.palette.gradients.primary,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
        fontSize: fontSize,
        fontWeight: fontWeight,
        lineHeight: lineHeight,
        ...otherProps.sx, // Allow additional styles to be passed
      }}
      {...otherProps} // Spread other props to Typography
    >
      {children}
    </Typography>
  );
};

LinearText.propTypes = {
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lineHeight: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default LinearText;
