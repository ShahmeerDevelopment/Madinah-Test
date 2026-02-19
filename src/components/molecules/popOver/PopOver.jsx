"use client";

import React from "react";
import PropTypes from "prop-types";
import Popover from "@mui/material/Popover";

import PopOverIcon from "@/assets/iconComponent/PopOverIcon";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

// Next
const PopOver = ({
	text = <PopOverIcon />,
	popoverContent = "I use Popover.",
	sx,
	maxWidth = "174px",
}) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const disabledOff = false;
	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		if (!disabledOff) {
			setAnchorEl(null);
		}
	};

	const open = Boolean(anchorEl);
	return (
		<div>
			<TypographyComp
				aria-owns={open ? "mouse-over-popover" : undefined}
				aria-haspopup="true"
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}
				sx={{ mt: 1, cursor: "pointer", ...sx }}
			>
				{text}
			</TypographyComp>
			<Popover
				id="mouse-over-popover"
				sx={{
					pointerEvents: "none",
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				slotProps={{
					paper: {
						elevation: 1,
						sx: {
							boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)",
							border: "1px solid rgba(248, 248, 248, 1)",
							borderRadius: "12px",
							maxWidth: maxWidth,
							color: "#090909",
							fontSize: "12px",
							fontWeight: 400,
							letterSpacing: "-0.41px",
							lineHeight: "16px",
							transform: "translateX(-8px) !important",
							"& .MuiTypography-root": {
								// p: '8px 12px',
							},
						},
					},
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<TypographyComp sx={{ p: 1 }}>{popoverContent}</TypographyComp>
			</Popover>
		</div>
	);
};

PopOver.propTypes = {
	text: PropTypes.any,
	popoverContent: PropTypes.string,
	sx: PropTypes.object,
	maxWidth: PropTypes.any,
};

export default PopOver;
