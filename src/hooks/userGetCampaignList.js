/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { useEffect } from "react";
import { getSpecificUserCampaign } from "@/api";

const userGetCampaignList = (isEdit) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const getDonorsData = async () => {
		setLoading(true);

		try {
			const response = await getSpecificUserCampaign();
			if (
				response.data.success === true ||
				response.data.message === "Success"
			) {
				const res = response.data.data.campaigns;
				const formattedData = res.map((campaign) => ({
					_id: campaign._id,
					name: campaign.title, // Change 'title' to 'name'
				}));

				setData(formattedData);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (isEdit === false) getDonorsData();
	}, []);
	return { loading, data };
};

export default userGetCampaignList;
