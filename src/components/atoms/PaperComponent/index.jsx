"use client";

import PropTypes from "prop-types";
import * as React from "react";
import Paper from "@mui/material/Paper";

export default function PaperComponent({ children, elevation, ...props }) {
	return (
		<Paper elevation={elevation} {...props}>
			{children}
		</Paper>
	);
}

PaperComponent.propTypes = {
	children: PropTypes.any,
	elevation: PropTypes.any,
};
