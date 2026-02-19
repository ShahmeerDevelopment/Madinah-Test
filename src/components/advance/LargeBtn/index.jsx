"use client";


import PropTypes from "prop-types";
import React from "react";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";

const LargeBtn = ({ children, sx, ...otherProps }) => {
	return (
		<ButtonComp
			sx={{
				width: { xs: "100%", sm: "135px" },
				height: "40px",
				p: "12px 32px 12px 32px",
				fontSize: "16px",
				...sx,
			}}
			{...otherProps}
		>
			{children}
		</ButtonComp>
	);
};

LargeBtn.propTypes = {
	children: PropTypes.any,
	sx: PropTypes.any,
};

export default LargeBtn;
