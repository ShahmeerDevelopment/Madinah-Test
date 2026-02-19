"use client";

/**
 * CurrencyAwareGivingLevels - Client wrapper that manages currency state
 * and re-renders giving levels when currency changes
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import StackComponent from "@/components/atoms/StackComponent";
import {
  currencySymbolHandler,
  donateCurrencyHandler,
  updateCampaignDetails,
} from "@/store/slices/donationSlice";
import { getSingleCampaignData } from "@/api";

import CurrencyDropdown from "./CurrencyDropdown.client";
import GivingLevelCard from "./GivingLevelCard.client";
import { getSingleCampaignDataGivingLevels } from "@/api/get-api-services";

export default function CurrencyAwareGivingLevels({
  initialCurrency,
  initialCurrencyCode,
  initialGradingLevels = [],
  currencyConversionIdCampaign,
  randomToken,
  checkStatus,
  previewMode = false,
}) {
  const dispatch = useDispatch();
  const [currency, setCurrency] = useState(initialCurrency);
  const [currencyCode, setCurrencyCode] = useState(initialCurrencyCode);
  const [gradingLevels, setGradingLevels] = useState(initialGradingLevels);
  const [isUpdating, setIsUpdating] = useState(false);

  const reduxCurrency = useSelector((state) => state.donation?.currency);
  const existingCampaignDetails = useSelector(
    (state) => state.donation?.campaignDetails,
  );

  const campaignDetailsRef = useRef(existingCampaignDetails);
  useEffect(() => {
    campaignDetailsRef.current = existingCampaignDetails;
  }, [existingCampaignDetails]);

  const hasSyncedRef = useRef(false);
  useEffect(() => {
    if (hasSyncedRef.current) return;
    if (
      reduxCurrency?.unit &&
      initialCurrencyCode &&
      reduxCurrency.unit !== initialCurrencyCode &&
      randomToken
    ) {
      hasSyncedRef.current = true;
      setIsUpdating(true);
      const cfCountry = typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;
      getSingleCampaignDataGivingLevels(randomToken, reduxCurrency.unit, undefined, undefined, undefined, undefined, undefined, undefined, undefined, null, null, cfCountry)
        .then((res) => {
          const result = res?.data;
          if (result?.success) {
            const data = result.data.campaignDetails;
            setCurrency(data.currencySymbol);
            setCurrencyCode(data.amountCurrency);
            setGradingLevels(data.givingLevels || initialGradingLevels);

            const convertedData = {
              symbol: data.currencySymbol,
              units: data.amountCurrency,
              currencyConversionId: data.currencyConversionId,
              isoAlpha2: data.countryId?.isoAlpha2,
              country: data.countryId?.name,
              currencyCountry: data.currencyCountry,
            };
            dispatch(currencySymbolHandler(convertedData));

            const latestCampaignDetails = campaignDetailsRef.current;
            dispatch(
              updateCampaignDetails({
                ...latestCampaignDetails,
                ...data,
              }),
            );
          }
        })
        .catch((error) => {
          console.error("Currency sync error on mount:", error);
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }
  }, [
    reduxCurrency,
    initialCurrencyCode,
    randomToken,
    initialGradingLevels,
    dispatch,
  ]);

  // Handler for currency change
  const handleCurrencyChange = useCallback(
    (newCurrencyData) => {
      if (!newCurrencyData || !randomToken) return;

      setIsUpdating(true);

      // Fetch campaign data with new currency
      const cfCountry = typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;
      getSingleCampaignDataGivingLevels(randomToken, newCurrencyData.unit, undefined, undefined, undefined, undefined, undefined, undefined, undefined, null, null, cfCountry)
        .then((res) => {
          const result = res?.data;
          if (result.success) {
            const data = result.data.campaignDetails;

            // Update Redux with new currency conversion data
            const convertedData = {
              symbol: data.currencySymbol,
              units: data.amountCurrency,
              currencyConversionId: data.currencyConversionId,
              isoAlpha2: data.countryId?.isoAlpha2,
              country: data.countryId?.name,
              currencyCountry: data.currencyCountry,
            };

            dispatch(currencySymbolHandler(convertedData));
            dispatch(donateCurrencyHandler(newCurrencyData));

            const latestCampaignDetails = campaignDetailsRef.current;

            dispatch(
              updateCampaignDetails({
                ...latestCampaignDetails,
                ...data,
              }),
            );

            // Update local state to trigger re-render
            setCurrency(data.currencySymbol);
            setCurrencyCode(data.amountCurrency);
            setGradingLevels(data.givingLevels || initialGradingLevels);
          } else {
            toast.error(result.message || "Failed to convert currency");
          }
        })
        .catch((error) => {
          console.error("Currency conversion error:", error);
          toast.error("Something went wrong with currency conversion");
        })
        .finally(() => {
          setIsUpdating(false);
        });
    },
    [randomToken, dispatch, initialGradingLevels],
  );

  return (
    <StackComponent direction="column">
      {/* Currency Dropdown */}
      <CurrencyDropdown
        currency={currency}
        currencyCode={currencyCode}
        currencyConversionIdCampaign={currencyConversionIdCampaign}
        randomToken={randomToken}
        previewMode={previewMode}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* Giving Level Cards */}
      <StackComponent
        direction="column"
        sx={{
          opacity: isUpdating ? 0.6 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {gradingLevels.map((level, index) => (
          <GivingLevelCard
            key={`${level._id || index}-${currency}`}
            index={index}
            title={level.title}
            amount={level.amount}
            claimed={level.usedCount || 0}
            description={level.description}
            isMostNeeded={level.isMostNeeded}
            donationType={level.donationType}
            recurringType={level.recurringType}
            currencySymbol={currency || "$"}
            status={checkStatus}
            previewMode={previewMode}
          />
        ))}
      </StackComponent>
    </StackComponent>
  );
}
