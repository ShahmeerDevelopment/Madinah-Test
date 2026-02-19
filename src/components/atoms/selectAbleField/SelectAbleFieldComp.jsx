/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import BoxComponent from "../boxComponent/BoxComponent";
import TypographyComp from "../typography/TypographyComp";
import Animate from "../Animate/Animate";
import { useLottieAnimation } from "@/hooks/useLottieAnimation";
import UncheckedIcon from "../../../assets/iconComponent/UncheckedIcon";
import LimitedParagraph from "../limitedParagraph/LimitedParagraph";
import SubHeading from "../createCampaigns/SubHeading";
import SelectableNextIcon from "./SelectableNextIcon";
import { theme } from "../../../config/customTheme";

// Next
const SelectAbleFieldComp = ({
	isActive,
	onClick,
	heading,
	title,
	isCharityList = false,
	activeColor = theme.palette.primary.darkGray,
	color = theme.palette.primary.gray,
	selectable = true,
	notificationSelect = false,
}) => {
	const { animationData: tickIcon } = useLottieAnimation("tick_icon");
	const [showAnimation, setShowAnimation] = useState(false);

	const handleClick = () => {
		if (onClick) {
			onClick(); // Call the original onClick handler passed as a prop
		}
	};

	useEffect(() => {
		if (isActive) {
			setShowAnimation(true);
			// Optionally reset animation state after it completes, e.g., after 1000 ms
		} else {
			setShowAnimation(false);
		}
	}, [isActive]);

	return (
		<>
			<div
				style={{ position: "relative", boxSizing: "border-box", width: "100%" }}
			>
				<BoxComponent
					onClick={handleClick}
					sx={{
						padding: isCharityList
							? { xs: "1rem 0.75rem 1rem 1.25rem", sm: "1rem 1rem 1rem 1.5rem" }
							: "1rem",
						height: isCharityList ? "80px" : { xs: "104px", sm: "80px" },
						borderRadius: "28px",
						mb: { xs: 0.5, sm: 1 },
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						cursor: "pointer",
						border:
							isActive && !notificationSelect
								? "2px solid transparent"
								: notificationSelect
									? "none"
									: "2px solid rgba(233, 233, 235, 1)",
						background: notificationSelect
							? "#FBFBFB"
							: "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box",
						position: "relative",
					}}
				>
					<BoxComponent sx={{ width: "85%" }}>
						{isCharityList ? (
							<LimitedParagraph
								line={1}
								fontSize={"22px"}
								fontWeight={500}
								sx={{
									color: !selectable
										? "#090909"
										: isActive
											? activeColor
											: color,
									lineHeight: { xs: "22px", sm: "28px" },
								}}
							>
								{heading}
							</LimitedParagraph>
						) : (
							<SubHeading
								sx={{
									color: !selectable
										? "#090909"
										: notificationSelect
											? "#090909"
											: isActive
												? activeColor
												: color,
									fontSize: notificationSelect
										? "18px !important"
										: "22px !important",
									lineHeight: notificationSelect
										? "22px !important"
										: "28px !important",
								}}
							>
								{heading}
							</SubHeading>
						)}
						<TypographyComp
							align="left"
							sx={{
								fontWeight: 400,
								fontSize: "16px",
								lineHeight: "20px",
								color: !selectable ? "#606062" : theme.palette.primary.gray,
							}}
						>
							{title}
						</TypographyComp>
					</BoxComponent>
					{isActive || !selectable ? (
						<BoxComponent>
							{selectable ? null : <SelectableNextIcon />}
						</BoxComponent>
					) : null}
					{notificationSelect && !isActive ? (
						<BoxComponent>
							<UncheckedIcon />
						</BoxComponent>
					) : null}
				</BoxComponent>
				{showAnimation && (
					<div
						style={{
							position: "absolute",
							top: "42%",
							right: "-29px",
							transform: "translateY(-50%)",
							width: "150px", // Fixed width of the animation
							height: "150px", // Fixed height of the animation
						}}
						onClick={handleClick}
					>
						<Animate animationData={tickIcon} loop={false} />
					</div>
				)}
			</div>
		</>
	);
};

SelectAbleFieldComp.propTypes = {
	isActive: PropTypes.bool,
	onClick: PropTypes.func,
	heading: PropTypes.string,
	title: PropTypes.string,
	isCharityList: PropTypes.bool,
	activeColor: PropTypes.string,
	color: PropTypes.string,
	selectable: PropTypes.bool,
	notificationSelect: PropTypes.bool,
};

export default SelectAbleFieldComp;
