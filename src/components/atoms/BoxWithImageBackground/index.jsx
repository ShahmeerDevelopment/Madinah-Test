"use client";

import PropTypes from "prop-types";
import React from "react";
import BoxComponent from "../boxComponent/BoxComponent";
import Image from "next/image";

// Next
// const URL =
// "https://images.unsplash.com/photo-1682687220989-cbbd30be37e9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const BoxWithImageBackground = ({
	sx,
	fullWidth = true,
	fullHeight = true,
	children,
	imageUrl,
	priority = false,
}) => {
	const encodedUrl = imageUrl ? encodeURI(imageUrl) : "";

	return (
		<BoxComponent
			sx={{
				position: "relative",
				width: fullWidth ? "100%" : "auto",
				height: fullHeight ? "100%" : "auto",
				overflow: "hidden", // Ensure image doesn't spill out
				...sx,
			}}
		>
			{imageUrl && (
				<Image
					src={encodedUrl}
					alt="Background"
					fill
					priority={priority}
					style={{
						objectFit: "cover",
						objectPosition: "center",
						zIndex: 0,
					}}
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
				/>
			)}
			<div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
				{children}
			</div>
		</BoxComponent>
	);
};

BoxWithImageBackground.propTypes = {
	children: PropTypes.any,
	fullHeight: PropTypes.bool,
	fullWidth: PropTypes.bool,
	imageUrl: PropTypes.string,
	sx: PropTypes.any,
};

export default BoxWithImageBackground;
