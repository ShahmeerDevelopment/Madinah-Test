"use client";

import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import AIIcon from "@/assets/iconComponent/AIIcon";
import useLottieAnimation from "@/hooks/useLottieAnimation";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";

// =============================================================================
// OPTIMIZATION: Cache the Lottie module to prevent re-importing on every mount
// =============================================================================
let cachedLottie = null;
let lottieLoadPromise = null;

const loadLottie = () => {
	if (cachedLottie) {
		return Promise.resolve(cachedLottie);
	}
	if (lottieLoadPromise) {
		return lottieLoadPromise;
	}
	lottieLoadPromise = import("lottie-react").then((LottieReact) => {
		cachedLottie = LottieReact.default;
		return cachedLottie;
	});
	return lottieLoadPromise;
};

const HoverableAIButton = ({ onClick = () => { } }) => {
	const [isHovering, setIsHovering] = useState(false);
	// Always start with null to avoid SSR/hydration issues
	const [Lottie, setLottie] = useState(null);
	const { animationData: AiAnimation } = useLottieAnimation("AI_icon");

	useEffect(() => {
		// Load from cache or fetch on client-side only
		loadLottie().then((LottieComponent) => {
			setLottie(() => LottieComponent);
		});
	}, []);

	return (
		<ButtonComp
			size="normal"
			sx={{ color: "#090909", width: "117px", position: "relative" }}
			startIcon={
				!isHovering ? (
					<div
						style={{
							// height: 130,
							// width: 130,
							position: "absolute",
							left: 15,
							top: 13,
							pointerEvents: "none",
						}}
					>
						<AIIcon />
					</div>
				) : Lottie ? (
					<Lottie
						animationData={AiAnimation}
						loop={true}
						style={{
							height: 130,
							width: 130,
							position: "absolute",
							left: -42,
							top: -40,
							pointerEvents: "none",
						}}
					/>
				) : (
					<div
						style={{
							height: 130,
							width: 130,
							position: "absolute",
							left: -42,
							top: -40,
							pointerEvents: "none",
						}}
					>
						<AIIcon />
					</div>
				)
			}
			variant="outlined"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onClick={onClick}
			padding={"12px 10px 10px 22px"}
		>
			AI Help
		</ButtonComp>
	);
};
HoverableAIButton.propTypes = {
	onClick: PropTypes.func,
};
export default HoverableAIButton;
