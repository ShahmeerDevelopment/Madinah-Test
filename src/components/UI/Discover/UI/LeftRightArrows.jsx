"use client";

import OutlinedIconButton from "@/components/advance/OutlinedIconButton";
import StackComponent from "@/components/atoms/StackComponent";
import PropTypes from "prop-types";
import React from "react";
import ArrowLeft from "../../Home/icons/ArrowLeft";
import ArrowRight from "../../Home/icons/ArrowRight";

const LeftRightArrows = ({
	disabledRight = false,
	disabledLeft = false,
	leftAction = () => {},
	rightAction = () => {},
	containerStyles,
}) => {
	return (
		<StackComponent sx={{ ...containerStyles }}>
			<OutlinedIconButton disabled={disabledLeft} onClick={leftAction}>
				<ArrowLeft disabled={disabledLeft} />
			</OutlinedIconButton>
			<OutlinedIconButton disabled={disabledRight} onClick={rightAction}>
				<ArrowRight disabled={disabledRight} />
			</OutlinedIconButton>
		</StackComponent>
	);
};

LeftRightArrows.propTypes = {
	containerStyles: PropTypes.any,
	disabledLeft: PropTypes.bool,
	disabledRight: PropTypes.bool,
	leftAction: PropTypes.func,
	rightAction: PropTypes.func,
};

export default LeftRightArrows;
