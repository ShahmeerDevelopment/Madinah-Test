"use client";

import React from "react";
import PropTypes from "prop-types";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { ASSET_PATHS } from "@/utils/assets";
const infoBlog = ASSET_PATHS.campaign.infoBlog;
import Image from "next/image";

// Next
const ImageModal = ({ setOpen }) => {
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<BoxComponent sx={{ display: "flex", flexDirection: "column" }}>
			<TypographyComp
				align="left"
				sx={{
					fontSize: "28px",
					fontWeight: 500,
					lineHeight: "38px",
					mb: 1,
				}}
			>
				The cover image will be displayed at the top of your campaign page
			</TypographyComp>

			<Image src={infoBlog} height={294} width={450} alt="info" />
			<ButtonComp
				fullWidth
				variant={"outlined"}
				size="normal"
				sx={{ mt: 2 }}
				onClick={handleClose}
			// fullWidth={isMobile ? true : false}
			>
				Close
			</ButtonComp>
		</BoxComponent>
	);
};
ImageModal.propTypes = {
	setOpen: PropTypes.func,
};
export default ImageModal;
