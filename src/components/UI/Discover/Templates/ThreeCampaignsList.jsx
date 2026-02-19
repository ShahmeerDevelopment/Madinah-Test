"use client";

import PropTypes from "prop-types";
import React from "react";
import StackComponent from "../../../components/atoms/StackComponent";
import CampaignOption from "../../home/UI/CampaignOption";

const ThreeCampaignsList = ({
	firstCampaign,
	secondCampaign,
	thirdCampaign,
}) => {
	return (
		<StackComponent
			spacing="40px"
			sx={{ width: "100%" }}
			justifyContent="space-between"
		>
			<CampaignOption {...firstCampaign} />
			<CampaignOption {...secondCampaign} />
			<CampaignOption {...thirdCampaign} />
		</StackComponent>
	);
};

ThreeCampaignsList.propTypes = {
	firstCampaign: PropTypes.any,
	secondCampaign: PropTypes.any,
	thirdCampaign: PropTypes.any,
};

export default ThreeCampaignsList;
