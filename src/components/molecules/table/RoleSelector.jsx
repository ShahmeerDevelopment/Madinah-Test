"use client";

import { FormControl, MenuItem, Select } from "@mui/material";
import React, { useEffect } from "react";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import DropDownIcon from "./icons/DropDownIcon";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { changeTeamRole } from "../../../api/update-api-service";

const data = [
	{
		_id: 1,
		name: "Admin",
		value: "admin",
	},
	{
		_id: 2,
		name: "Content Editor",
		value: "contentEditor",
	},
	{
		_id: 3,
		name: "Financial manager",
		value: "financialManager",
	},
	{
		_id: 4,
		name: "Referral manager",
		value: "referralManager",
	},
];

const RoleSelector = React.memo(({ initialData }) => {
	const [role, setRole] = React.useState(initialData?.roleType || "admin");
	const [open, setOpen] = React.useState(false);
	const campaignId = useSelector((state) => state.mutateCampaign.id);

	const handleChange = async (event) => {
		setRole(event.target.value);
		const payload = {
			teamMemberId: initialData._id,
			roleType: event.target.value,
		};
		await changeTeamRole(campaignId, payload);
	};

	const handleOpenClose = () => {
		setOpen(!open);
	};

	useEffect(() => {
		setRole(initialData?.roleType);
	}, [initialData]);

	return (
		<BoxComponent sx={{ minWidth: { xs: 150, sm: 180 }, maxWidth: 180 }}>
			<FormControl fullWidth>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={role}
					open={open}
					variant="outlined"
					onOpen={handleOpenClose}
					onClose={handleOpenClose}
					IconComponent={({ className, onClick }) => (
						<div
							onClick={onClick}
							className={className}
							style={{
								marginTop: "-5px",
								transform: open ? "rotate(180deg)" : "rotate(0deg)",
								// transition: 'transform 0.3s',
							}}
						>
							<DropDownIcon />
						</div>
					)}
					onChange={handleChange}
					sx={{
						height: "30px",
						cursor: "pointer",
						"&& .MuiOutlinedInput-notchedOutline": {
							border: "none",
						},
						"&&:hover .MuiOutlinedInput-notchedOutline": {
							border: "none",
						},
						"&&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							border: "none",
						},
						"&& .MuiSelect-select": {
							color: "#606062", // Default text color for unselected items
							fontSize: "14px",
							lineHeight: "16px",
						},
					}}
					MenuProps={{
						PaperProps: {
							style: {
								borderRadius: "12px",
								background: "var(--Grayscale-00, #FFF)",
								boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)",
							},
						},
					}}
				>
					{data.map((item) => (
						<MenuItem
							key={item._id}
							value={item.value}
							sx={{
								height: "40px",
								padding: "8px 16px",
								fontSize: "14px",
								lineHeight: "16px",
								color: role === item.value ? "#606062" : "#A1A1A8", // Blue for selected, pink for others
								backgroundColor: "transparent", // Remove background color
								"&.Mui-selected": {
									backgroundColor: "white !important", // Override default background color
									color: "#606062 !important", // Highlight color for selected item
								},
							}}
						>
							{item.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</BoxComponent>
	);
});
RoleSelector.displayName = "RoleSelector";
RoleSelector.propTypes = {
	initialData: PropTypes.any,
};
export default RoleSelector;
