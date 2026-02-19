"use client";

import React, { memo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import AddNewMembers from "./AddNewMembers";
import TableContainer from "../../../../components/molecules/table/TableContainer";

const Teams = memo(({ singleCampaignDetails }) => {
	const { currentUserRole } = singleCampaignDetails;
	const campaignId = useSelector((state) => state.mutateCampaign.id);
	const teamMembers = useSelector((state) => state.mutateCampaign.team);

	return (
		<div>
			<AddNewMembers
				campaignId={campaignId}
				currentUserRole={currentUserRole}
			/>
			{currentUserRole === "admin" && (
				<TableContainer data={teamMembers} campaignId={campaignId} />
			)}
		</div>
	);
});
Teams.propTypes = {
	singleCampaignDetails: PropTypes.any,
};
Teams.displayName = "Teams";
export default Teams;
