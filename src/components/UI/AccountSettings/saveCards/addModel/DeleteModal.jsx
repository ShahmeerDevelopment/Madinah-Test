"use client";

import React, { useState } from "react";
import CampaignHeading from "../../../../../components/atoms/createCampaigns/CampaignHeading";
import { theme } from "../../../../../config/customTheme";
import SubHeading1 from "../../../../../components/atoms/createCampaigns/SubHeading1";
import ButtonComp from "../../../../../components/atoms/buttonComponent/ButtonComp";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

const DeleteButtonWrapper = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	gap: 5,
	marginTop: "32px",
	[theme.breakpoints.down("sm")]: {
		flexDirection: "column",
		gap: 12,
	},
}));
const DeleteModal = ({ setOpenDeleteModel, deleteHandler }) => {
	const [isDeleteLoader, setIsDeleteLoader] = useState(false);
	const deleteButtonHandler = () => {
		setIsDeleteLoader(true);
		deleteHandler();
	};
	return (
		<div>
			<CampaignHeading
				align={"center"}
				marginBottom={"8px"}
				sx={{ color: theme.palette.primary.dark }}
			>
				Delete payment card?
			</CampaignHeading>

			<SubHeading1 sx={{ color: theme.palette.primary.gray }}>
				Are you sure that you want to delete this payment card? All information
				about it will be deleted
			</SubHeading1>

			<DeleteButtonWrapper>
				<ButtonComp size="normal" onClick={deleteButtonHandler} fullWidth>
					{isDeleteLoader ? "Deleting..." : "Delete"}
				</ButtonComp>
				<ButtonComp
					size="normal"
					variant="outlined"
					onClick={() => setOpenDeleteModel(false)}
					fullWidth
				>
					Close
				</ButtonComp>
			</DeleteButtonWrapper>
		</div>
	);
};

DeleteModal.propTypes = {
	setOpenDeleteModel: PropTypes.func,
	deleteHandler: PropTypes.func,
};
export default DeleteModal;
