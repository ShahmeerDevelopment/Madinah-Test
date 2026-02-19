/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import BoxComponent from "../boxComponent/BoxComponent";
import { theme } from "@/config/customTheme";
import TypographyComp from "../typography/TypographyComp";
import Animate from "../Animate/Animate";
import useLottieAnimation from "@/hooks/useLottieAnimation";

// Next
const SelectAbleButton = ({
	isActive,
	onClick,
	title,
	isBackground = false,
	padding = "0px 24px",
	width = "100%",
	sx,
	height = "40px",
	fontSize = "16px",
	lineHeight = "20px",
	isGray = false,
	isBoxShadow = false,
}) => {
	const [showAnimation, setShowAnimation] = useState(false);
	const { animationData: dotsIcon } = useLottieAnimation("dots");

	const animationWidth = "150px"; // Example fixed width
	const animationHeight = "150px"; // Example fixed height

	const handleClick = () => {
		setShowAnimation(true); // Trigger the animation
		setTimeout(() => setShowAnimation(false), 1000); // Duration of the animation in milliseconds
		if (onClick) {
			onClick(); // Call the original onClick handler passed as a prop
		}
	};

	return (
		<div style={{ boxSizing: "border-box" }}>
			<BoxComponent
				onClick={handleClick}
				sx={{
					border: !isBackground
						? isActive
							? "none"
							: "1px solid #E9E9EB"
						: null,
					borderRadius: "32px",
					padding: padding,
					height: height,
					width: width,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					cursor: "pointer",
					boxShadow: isBoxShadow && "0px 4px 15px 0px rgba(0, 0, 0, 0.06)",
					...sx,
					background:
						isBackground && isActive
							? theme.palette.primary.main
							: "transparent",
					position: "relative",
					zIndex: 1,
					"&::after": {
						// eslint-disable-next-line quotes
						content: '""',
						position: "absolute",
						top: "-4px",
						left: "-4px",
						right: "-4px",
						bottom: "-4px",
						borderRadius: "32px",
						border:
							isActive && !isBackground ? "2px solid transparent" : "none",
						background:
							isActive && !isBackground
								? "linear-gradient(90.06deg, rgba(99, 99, 230, 1) 0.05%, rgba(89, 201, 249, 1) 99.96%)"
								: "none",
						backgroundClip: "padding-box",
						zIndex: -1,
					},
					"&::before": {
						// eslint-disable-next-line quotes
						content: '""',
						position: "absolute",
						top: "0px",
						left: "0px",
						right: "0px",
						bottom: "0px",
						zIndex: 0,
						borderRadius: "32px",
						backgroundColor:
							isActive && !isBackground ? "#ffffff !important" : "transparent",
					},
				}}
			>
				{showAnimation && (
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: animationWidth,
							height: animationHeight,
						}}
					>
						{" "}
						<Animate
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
							}}
							animationData={dotsIcon}
						/>
					</div>
				)}

				<TypographyComp
					sx={{
						fontWeight: 400,
						fontSize: fontSize,
						lineHeight: lineHeight,
						color: isGray
							? isActive
								? theme.palette.primary.dark
								: theme.palette.primary.gray
							: isBackground && isActive
								? theme.palette.primary.light
								: theme.palette.primary.darkGray,
						zIndex: 2,
					}}
				>
					{title}
				</TypographyComp>
			</BoxComponent>
		</div>
	);
};

SelectAbleButton.propTypes = {
	isActive: PropTypes.bool,
	onClick: PropTypes.func,
	title: PropTypes.string,
	isBackground: PropTypes.bool,
	padding: PropTypes.string,
	width: PropTypes.string,
	sx: PropTypes.object,
	height: PropTypes.any,
	fontSize: PropTypes.any,
	lineHeight: PropTypes.any,
	isGray: PropTypes.bool,
	isBoxShadow: PropTypes.bool,
};

export default SelectAbleButton;
