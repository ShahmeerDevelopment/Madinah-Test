"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";

import { theme } from "@/config/customTheme";
import { STEPPER_CARD } from "@/config/constant";
import Animate from "@/components/atoms/Animate/Animate";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { ASSET_PATHS } from "@/utils/assets";
import useLottieAnimation from "@/hooks/useLottieAnimation";

import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";

// Next
const StepperCard = ({
	heading,
	title,
	icon,
	isActive,
	currentIndex,
	isStepperResponsive,
	isPrevious,
}) => {
	const [animationState, setAnimationState] = useState("idle"); // 'idle', 'animating', 'completed'
	const { animationData: tickIcon } = useLottieAnimation("data");
	const checked = ASSET_PATHS.svg.checked;

	useEffect(() => {
		if (isPrevious) {
			setAnimationState("animating");
			// Assuming the animation is 3000ms long, adjust according to your actual animation length
			const timer = setTimeout(() => {
				setAnimationState("completed");
			}, 1500);

			return () => clearTimeout(timer);
		} else {
			setAnimationState("idle");
		}
	}, [isPrevious]);

	return (
		<BoxComponent
			sx={{
				minWidth: isStepperResponsive ? "100%" : STEPPER_CARD.minWidth,
				height: "74px",
				borderRadius: "20px",
				padding: {
					xs: isStepperResponsive ? "8px 10px" : "16px 12px",
					sm: "16px 12px",
				},
				background: isActive
					? theme.palette.gradients.secondary
					: theme.palette.primary.light,
				display: "flex",
				flexDirection: {
					xs: isStepperResponsive ? "column" : "row",
					sm: "row",
				},
				justifyContent: "flex-start",

				alignItems: {
					xs: isStepperResponsive ? "flex-start" : "center",
					sm: "center",
				},
				boxShadow: "0px 0px 100px 0px rgba(0, 0, 0, 0.06)",
				gap: STEPPER_CARD.gap,
				width: "100%",
			}}
		>
			{animationState === "animating" ||
			(isPrevious && animationState === "completed") ? (
				<Animate animationData={tickIcon} loop={false} />
			) : animationState === "completed" || !isPrevious ? (
				<Image
					src={isActive ? icon : currentIndex ? checked : icon}
					height={30}
					width={30}
					alt={`Icon for ${heading}`}
				/>
			) : null}

			<BoxComponent>
				<LimitedParagraph
					align="left"
					line={1}
					fontSize={"18px"}
					fontWeight={500}
					color={
						currentIndex || isActive
							? "rgba(9, 9, 9, 1)"
							: "rgba(161, 161, 168, 1)"
					}
					sx={{
						lineHeight: "22px",
						display: {
							xs: isStepperResponsive ? "none" : "block",
							sm: "block",
						},
					}}
				>
					{heading}
				</LimitedParagraph>

				<LimitedParagraph
					align="left"
					color={
						currentIndex || isActive
							? "rgba(9, 9, 9, 1)"
							: "rgba(161, 161, 168, 1)"
					}
					line={1}
					fontSize={"14px"}
					fontWeight={400}
					sx={{ lineHeight: "16px" }}
				>
					{title}
				</LimitedParagraph>
			</BoxComponent>
		</BoxComponent>
	);
};

StepperCard.propTypes = {
	heading: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	isActive: PropTypes.bool,
	currentIndex: PropTypes.bool,
	isStepperResponsive: PropTypes.bool,
	isPrevious: PropTypes.any,
};

export default StepperCard;
