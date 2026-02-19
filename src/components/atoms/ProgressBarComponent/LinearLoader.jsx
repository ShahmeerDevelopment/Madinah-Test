"use client";

import React from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";

const LinearLoader = ({
  color = "primary",
  variant = "indeterminate",
  ...boxProps
}) => {
  return <LinearProgress color={color} variant={variant} {...boxProps} />;
};

// Define PropTypes
LinearLoader.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "error",
    "info",
    "success",
    "warning",
  ]),
  variant: PropTypes.oneOf(["determinate", "indeterminate", "buffer", "query"]),
};

export default LinearLoader;
