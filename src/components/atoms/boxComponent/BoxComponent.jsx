"use client";


import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

const BoxComponent = ({ children, ...otherProps }) => {
	return <Box {...otherProps}>{children}</Box>;
};

BoxComponent.propTypes = {
	children: PropTypes.any,
};

export default BoxComponent;
