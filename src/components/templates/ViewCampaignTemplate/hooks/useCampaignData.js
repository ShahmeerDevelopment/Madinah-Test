"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleCampaignData } from "@/api/get-api-services";
import toast from "react-hot-toast";
import {
  updateCampaignDetails,
  monthlyDonationHandler,
  oneTimeDonationHandler,
  isRecurringHandler,
  currencySymbolHandler,
} from "@/store/slices/donationSlice";
import {
  updateSellConfigs,
  updateAmountCurrency,
} from "@/store/slices/sellConfigSlice";
import { titleHandler } from "@/store/slices/authSlice";

export const useCampaignData = (randomToken) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentGradingLevels, setCurrentGradingLevels] = useState([]);
  const [currentCurrency, setCurrentCurrency] = useState("");
  const [currencyConversion, setCurrencyConversion] = useState(null);
  const [currencyConversionId, setCurrencyConversionId] = useState();

  const dispatch = useDispatch();
  const reduxCurrency = useSelector((state) => state.donation?.currency);

  const getCampaignData = useCallback(
    async (isDropDown = false, selectedCurrency) => {
      if (!randomToken) return;

      setIsLoading(true);

      try {
        const cfCountry = typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;
        const res = await getSingleCampaignData(
          randomToken,
          selectedCurrency,
          "",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          cfCountry
        );
        const result = res?.data;

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        const data = result.data.campaignDetails;

        // Dispatch actions
        dispatch(updateCampaignDetails(data));
        dispatch(updateSellConfigs(result.data?.campaignDetails?.sellConfigs));
        dispatch(monthlyDonationHandler(data?.isRecurringDonation));
        dispatch(oneTimeDonationHandler(data?.isOneTimeDonation));
        dispatch(titleHandler(data.title));

        // Update giving levels
        if (data.givingLevels && data.givingLevels.length > 0) {
          const updatedGivingLevels = data.givingLevels.map((level, idx) => ({
            ...level,
            index: idx,
          }));
          setCurrentGradingLevels(updatedGivingLevels);
        }

        // Currency conversion setup
        let conversionId;
        if (isDropDown === true) {
          conversionId = data?.currencyConversionId;
        }

        const convertedData = {
          symbol: data.currencySymbol,
          units: data.amountCurrency,
          currencyConversionId: isDropDown
            ? conversionId
            : data.currencyConversionId,
          isoAlpha2: data.countryId?.isoAlpha2,
          country: data.countryId?.name,
          currencyCountry: data.currencyCountry,
        };

        setCurrencyConversion(convertedData);

        if (isDropDown === true) {
          dispatch(currencySymbolHandler(convertedData));
          setCurrentCurrency(data.currencySymbol);
          setCurrencyConversionId(data.amountCurrency);
        }

        if (isDropDown === false) {
          dispatch(isRecurringHandler(data.isRecurringDonation));
          dispatch(
            updateSellConfigs(result.data?.campaignDetails?.sellConfigs)
          );
          dispatch(
            updateAmountCurrency(result.data?.campaignDetails?.amountCurrency)
          );

          if (data?.currencyConversionId) {
            dispatch(
              currencySymbolHandler({
                currencyConversionId: data?.currencyConversionId,
              })
            );
          }
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [randomToken, dispatch]
  );

  // Initial data fetch
  useEffect(() => {
    if (randomToken) {
      getCampaignData();
    }
  }, [randomToken, getCampaignData]);

  // Currency change handler
  useEffect(() => {
    if (reduxCurrency) {
      getCampaignData(false, reduxCurrency?.unit);
      setCurrentCurrency(reduxCurrency?.symbol);
    }
  }, [reduxCurrency, getCampaignData]);

  return {
    isLoading,
    currentGradingLevels,
    currentCurrency,
    currencyConversion,
    currencyConversionId,
    getCampaignData,
  };
};
