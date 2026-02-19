/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { getCurrencies } from "@/api";
import { useEffect } from "react";

const userGetCurrencies = (isEdit) => {
	const [currenciesData, setCurrenciesData] = useState([]);
	const [loading, setLoading] = useState(false);
	const getCurrenciesData = async () => {
		setLoading(true);

		try {
			const response = await getCurrencies();
			if (
				response.data.success === true ||
				response.data.message === "Success"
			) {
				const res = response.data.data.currencies;

				setCurrenciesData(res);
				// const formattedData = res.map((campaign) => ({
				// 	_id: campaign._id,
				// 	name: campaign.title, // Change 'title' to 'name'
				// }));

				// setData(formattedData);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (isEdit === false) getCurrenciesData();
	}, []);
	return { loading, currenciesData };
};

export default userGetCurrencies;
