"use client";
import PropTypes from "prop-types";
import React from "react";
import TypographyComp from "../../atoms/typography/TypographyComp";

const AuthmodelSubHeading = ({ children }) => {
	return (
		<TypographyComp
			align="center"
			sx={{
				fontSize: "32px",
				fontWeight: 500,
				color: "#090909",
				lineHeight: "38px",
				letter: "-0.41px",
			}}
			component="h4"
		>
			{children}
		</TypographyComp>
	);
};

AuthmodelSubHeading.propTypes = {
	children: PropTypes.any,
};

export default AuthmodelSubHeading;
