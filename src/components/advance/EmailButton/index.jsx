"use client";


import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import PropTypes from "prop-types";
import React from "react";

const EmailButton = ({
	email,
	children,
	linkProps,
	newTab = true,
	isReport,
	...btnProps
}) => {
	const mailto = `mailto:${email}`;

	return (
		<>
			{isReport ? (
				<TypographyComp
					{...btnProps}
					onClick={(e) => {
						window.location.href = mailto;
						e.preventDefault();
					}}
					sx={{ cursor: "pointer" }}
					target={newTab ? "_blank" : "_self"}
				// {...linkProps}
				>
					<TypographyComp
						// to={""}
						// onClick={(e) => {
						// 	window.location.href = mailto;
						// 	e.preventDefault();
						// }}
						// target={newTab ? '_blank' : '_self'}
						{...linkProps}
					>
						{children}
					</TypographyComp>
				</TypographyComp >
			) : (
				<ButtonComp
					{...btnProps}
					onClick={(e) => {
						window.location.href = mailto;
						e.preventDefault();
					}}
					target={newTab ? "_blank" : "_self"}
				// {...linkProps}
				>
					<TypographyComp
						// to={""}
						// onClick={(e) => {
						// 	window.location.href = mailto;
						// 	e.preventDefault();
						// }}
						// target={newTab ? '_blank' : '_self'}
						{...linkProps}
					>
						{children}
					</TypographyComp>
				</ButtonComp >
			)}
		</>
	);
};

EmailButton.propTypes = {
	btnProps: PropTypes.any,
	children: PropTypes.any,
	email: PropTypes.any,
	linkProps: PropTypes.any,
	newTab: PropTypes.bool,
	isReport: PropTypes.bool
};

export default EmailButton;
