"use client";

import PropTypes from "prop-types";
import React from "react";
import Divider from "@mui/material/Divider";

const DividerComponent = ({ children, ...otherProps }) => {
  return <Divider {...otherProps}>{children}</Divider>;
};

DividerComponent.propTypes = {
  children: PropTypes.any,
};

export default DividerComponent;
