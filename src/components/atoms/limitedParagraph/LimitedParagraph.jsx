"use client";

import React from "react";
import PropTypes from "prop-types";
import { Paragraph } from "./LimitedParagraph.style";

const LimitedParagraph = ({
	children = "Default text goes here",
	line = 2,
	fontSize,
	fontWeight,
	...props
}) => {
	return (
		<Paragraph
			line={line}
			fontSize={fontSize}
			fontWeight={fontWeight}
			{...props}
		>
			{children}
		</Paragraph>
	);
};

LimitedParagraph.propTypes = {
	children: PropTypes.node,
	line: PropTypes.number,
	fontSize: PropTypes.string,
	fontWeight: PropTypes.number,
};

export default LimitedParagraph;
