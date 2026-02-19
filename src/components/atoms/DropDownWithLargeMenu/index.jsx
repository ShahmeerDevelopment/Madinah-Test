/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import TypographyComp from "../typography/TypographyComp";
import DropdownIcons from "./icons/DropdownIcons";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const DropDownWithLargeMenu = ({
	placeholder,
	selectedValue,
	data,
	onChange,
}) => {
	const [btnWidth, setBtnWidth] = useState("0px");
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		event.preventDefault();
		setAnchorEl(event.currentTarget);
	};

	const handleSelect = (id, otherProps) => {
		onChange({ _id: id, ...otherProps });
		handleClose();
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const btnRef = useRef(null);

	useEffect(() => {
		if (btnRef.current) {
			setBtnWidth(btnRef.current.clientWidth);
		}
	}, [btnRef]);

	return (
		<>
			<button
				ref={btnRef}
				style={{
					width: "100%",
					height: "40px",
					borderRadius: "16px",
					border: "1px solid rgba(233, 233, 235, 1)",
					justifyContent: "space-between",
					padding: "0 16px",

					position: "relative",
					background: "#ffffff",
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					cursor: "pointer",
				}}
				id="demo-positioned-button"
				aria-controls={open ? "demo-positioned-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
			>
				{selectedValue ? (
					<TypographyComp sx={{ color: "rgba(96, 96, 98, 1) !important" }}>
						{selectedValue.name}
					</TypographyComp>
				) : (
					<TypographyComp sx={{ color: "light grey" }}>
						{placeholder}
					</TypographyComp>
				)}
				<DropdownIcons />
			</button>
			<Menu
				elevation={0}
				slotProps={{
					paper: {
						sx: {
							width: btnWidth,
							borderRadius: "12px",
							boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)",
							maxHeight: "200px",
							"&::-webkit-scrollbar": {
								width: "12px",
								backgroundColor: "transparent",
							},
							"&::-webkit-scrollbar-thumb": {
								backgroundColor: "rgba(233, 233, 235, 1)",
								borderRadius: "6px",
								border: "3px solid white",
							},
							"& *": {
								scrollbarWidth: "thin",
								scrollbarColor: "rgba(233, 233, 235, 1) white",
							},
						},
					},
				}}
				id="demo-positioned-menu"
				aria-labelledby="demo-positioned-button"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				{Array.isArray(data) &&
					data.map((eachItem, index) => (
						<MenuItem
							sx={{ height: "40px" }}
							key={index}
							selected={eachItem?._id === selectedValue?._id}
							onClick={() =>
								handleSelect(eachItem?._id, {
									...eachItem,
								})
							}
						>
							{eachItem.name}
						</MenuItem>
					))}
			</Menu>
		</>
	);
};

DropDownWithLargeMenu.propTypes = {
	data: PropTypes.shape({
		map: PropTypes.func,
	}),
	onChange: PropTypes.func,
	placeholder: PropTypes.any,
	selectedValue: PropTypes.shape({
		_id: PropTypes.any,
		name: PropTypes.any,
	}),
};

export default DropDownWithLargeMenu;
