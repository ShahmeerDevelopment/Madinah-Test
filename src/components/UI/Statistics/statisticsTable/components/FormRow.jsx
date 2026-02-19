/* eslint-disable indent */
"use client";

import PropTypes from "prop-types";
import React from "react";
import StackComponent from "@/components/atoms/StackComponent";

const FormRow = ({ children, direction = "row", width = "100%" }) => {
	return (
		<StackComponent sx={{ width: width }} direction={direction} spacing={3}>
			{children}
		</StackComponent>
	);
};

FormRow.propTypes = {
	children: PropTypes.any,
	direction: PropTypes.string,
	width: PropTypes.string,
};

export default FormRow;
