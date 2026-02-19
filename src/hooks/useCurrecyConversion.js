import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { postCurrencyForConversion } from "../api";
import { currencySymbolHandler } from "../store/slices/donationSlice";

export const useCurrencyConversion = (campaignDetails) => {
	const dispatch = useDispatch();
	const [currencyConversion, setCurrencyConversion] = useState({
		rates: 0,
		symbol: "€",
		units: campaignDetails?.amountCurrency,
	});

	const handleCurrencyChange = useCallback(
		(selectedCurrencyUnit) => {
			postCurrencyForConversion(
				campaignDetails?.amountCurrency,
				selectedCurrencyUnit,
			)
				.then((res) => {
					const result = res?.data;
					if (result.success) {
						const newResult = result.data;
						setCurrencyConversion({
							rates: newResult.rate,
							symbol: newResult.currency.symbol,
							units: newResult.currency.code,
						});
						dispatch(currencySymbolHandler(newResult));
					} else {
						toast.error(`${result.message}! Try another`);
					}
				})
				.catch((error) => {
					console.log(error);
					toast.error("Something went wrong");
				});
		},
		[campaignDetails?.amountCurrency, dispatch],
	);

	return { currencyConversion, handleCurrencyChange };
};
