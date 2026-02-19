"use client";
import PropTypes from "prop-types";
import React from "react";
import { ASSET_PATHS } from "@/utils/assets";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import Image from "next/image";

const CampaignBenefits = ({ img, title }) => {
	return (
		<StackComponent alignItems="center" direction="column">
			<Image
				width={25}
				height={25}
				src={!img || img === "" ? ASSET_PATHS.images.imagePlaceholder : img}
				alt={title}
			/>
			<TypographyComp
				sx={{ fontSize: "14px", fontWeight: 400, textAlign: "center" }}
			>
				{title}
			</TypographyComp>
		</StackComponent>
	);
};

CampaignBenefits.propTypes = {
	img: PropTypes.any,
	title: PropTypes.any,
};

export default CampaignBenefits;
