"use client";

import PropTypes from "prop-types";
import Skeleton from "@mui/material/Skeleton";
import React from "react";

const SkeletonComponent = ({
	variant = "rectangular",
	width = "100%",
	height = "30px",
	sx,
	...otherProps
}) => {
	return (
		<>
			<Skeleton
				variant={variant}
				width={width}
				height={height}
				sx={{ fontSize: "1rem", ...sx }}
				{...otherProps}
			/>
		</>
	);
};

SkeletonComponent.propTypes = {
	height: PropTypes.string,
	sx: PropTypes.any,
	variant: PropTypes.string,
	width: PropTypes.string,
};

export default SkeletonComponent;
