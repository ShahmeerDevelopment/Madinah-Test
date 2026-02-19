"use client";

import React, { useCallback, useEffect, useState } from "react";
import AddNewReferrals from "./AddNewReferrals";
import TableContainer from "../../../../components/molecules/table/TableContainer";
import { getSingleCampaignData } from "../../../../api";
import { getReferralData } from "../../../../api/get-api-services";
import TableSkeleton from "@/components/advance/TableSkeleton";

const Referral = () => {
	const [campaignId, setCampaignId] = useState();
	const [referralData, setReferralData] = useState([]);
	const [ownersList, setOwnersList] = useState([]);
	const [loading, setLoading] = useState(true);
	const queryParams = new URLSearchParams(location.search);
	const campaignToken = queryParams.get("id");
	useEffect(() => {
		getSingleCampaignData(campaignToken).then((res) => {
			setCampaignId(res.data?.data?.campaignDetails?._id);
		});
	}, []);

	useEffect(() => {
		if (campaignId) {
			setLoading(true); // Ensure loading is set when the API call is initiated
			getReferralData(campaignId).then((res) => {
				const referrals = res.data?.data?.referrals || [];
				setReferralData(referrals);
				setLoading(false);

				const uniqueOwners = new Map();
				referrals.forEach((referral, index) => {
					const ownerName = referral.owner; // Assuming referral.owner is the name used for uniqueness
					if (!uniqueOwners.has(ownerName)) {
						uniqueOwners.set(ownerName, {
							id: index, // Using index as the ID
							title: ownerName,
						});
					}
				});

				setOwnersList([...uniqueOwners.values()]);
			});
		}
	}, [campaignId]);

	const handleNewReferral = useCallback((newReferral) => {
		const { token, ...rest } = newReferral; // Destructure `token` from `newReferral` and capture the rest of the properties in `rest`.
		setReferralData((prevReferrals) => [
			...prevReferrals,
			{ ...rest, referralToken: token }, // Spread the rest of the properties and assign `token` to `referralToken`.
		]);
	}, []);

	return (
		<div>
			<AddNewReferrals
				campaignId={campaignId}
				ownersList={ownersList}
				onAddNewReferral={handleNewReferral}
			/>
			{loading ? (
				<TableSkeleton />
			) : (
				<TableContainer
					data={referralData}
					tableName="referral_table"
					tableTitle="Referral Links"
					campaignToken={campaignId}
					randomToken={campaignToken}
				/>
			)}
		</div>
	);
};

export default Referral;
