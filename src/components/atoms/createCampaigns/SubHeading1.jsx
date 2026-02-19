"use client";

import React from "react";
import PropTypes from "prop-types";
import TypographyComp from "../typography/TypographyComp";

// Next
const SubHeading1 = ({ children, sx, align = "left" }) => {
	return (
		<TypographyComp
			align={align}
			sx={{
				fontSize: "18px",
				fontWeight: 500,
				lineHeight: "22px",
				letterSpacing: "-0.41px",
				...sx,
			}}
		>
			{children}
		</TypographyComp>
	);
};

SubHeading1.propTypes = {
	children: PropTypes.node.isRequired,
	sx: PropTypes.object,
	align: PropTypes.string,
};

export default SubHeading1;
