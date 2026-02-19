"use client";

/**
 * CurrencyDropdown - Client Component for currency selection
 *
 * This component handles:
 * - Redux state for currency conversion
 * - User interaction for currency selection
 * - API calls to get campaign data with new currency
 */

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  lazy,
  Suspense,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import {
  currencySymbolHandler,
  donateCurrencyHandler,
  updateCampaignDetails,
} from "@/store/slices/donationSlice";
import { getSingleCampaignData } from "@/api";
import { getSingleCampaignDataGivingLevels } from "@/api/get-api-services";

// Lazy load dropdown
const DropDown = lazy(() => import("@/components/atoms/inputFields/DropDown"));

// Skeleton for dropdown - matches exact size to prevent layout shift
const DropdownSkeleton = () => {
  const skeletonPulse = {
    animation: "pulse 1.5s ease-in-out infinite",
    "@keyframes pulse": {
      "0%": { opacity: 1 },
      "50%": { opacity: 0.5 },
      "100%": { opacity: 1 },
    },
  };

  return (
    <BoxComponent
      sx={{
        width: "100px",
        height: "40px",
        borderRadius: "4px",
        border: "1px solid #E9E9EB",
        backgroundColor: "#F8F8F8",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        ...skeletonPulse,
      }}
    >
      <BoxComponent
        sx={{
          width: "50px",
          height: "14px",
          backgroundColor: "#E0E0E0",
          borderRadius: "2px",
        }}
      />
      <BoxComponent
        sx={{
          width: "0",
          height: "0",
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderTop: "4px solid #E0E0E0",
        }}
      />
    </BoxComponent>
  );
};

export default function CurrencyDropdown({
  currency,
  currencyCode,
  currencyConversionIdCampaign,
  randomToken,
  previewMode = false,
  onCurrencyChange = null,
}) {
  const dispatch = useDispatch();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const reduxCurrency = useSelector((state) => state.donation?.currency);
  const countriesList = useSelector((state) => state.meta.countries);
  const existingCampaignDetails = useSelector(
    (state) => state.donation?.campaignDetails,
  );

  // Memoized active currencies
  const activeCurrencies = useMemo(() => {
    if (!countriesList) return [];

    const uniqueCountries = countriesList.reduce(
      (acc, current) => {
        if (!acc.unique[current.currencyUnit]) {
          acc.unique[current.currencyUnit] = true;
          acc.result.push(current);
        }
        return acc;
      },
      { unique: {}, result: [] },
    ).result;

    const transformedCountriesList = uniqueCountries.map((country) => ({
      name: country.currencyUnit,
      unit: country.currencyUnit,
      symbol: country.currency.symbol,
      id: country._id,
      isActive: country.currency.isActive,
    }));

    return transformedCountriesList.filter(
      (currency) => currency.isActive === true,
    );
  }, [countriesList]);

  const handleDropDownChange = useCallback(
    (newValue) => {
      if (!newValue || !randomToken) return;

      setSelectedCountry(newValue);

      // If parent component provided a callback, use it (for managed updates)
      if (onCurrencyChange) {
        onCurrencyChange(newValue);
        return;
      }

      // Otherwise, handle the update locally (fallback behavior)
      setIsLoading(true);

      // Clear the currency in Redux to trigger refetch
      dispatch(donateCurrencyHandler(""));

      // Fetch campaign data with new currency
      const cfCountry = typeof window !== "undefined" ? localStorage.getItem("cfCountry") : null;
      getSingleCampaignDataGivingLevels(randomToken, newValue.unit, undefined, undefined, undefined, undefined, undefined, undefined, undefined, null, null, cfCountry)
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
            dispatch(donateCurrencyHandler(newValue));

            // Merge new currency data into existing campaignDetails in Redux
            dispatch(
              updateCampaignDetails({
                ...existingCampaignDetails,
                ...data,
              }),
            );

            toast.success("Currency updated successfully");
          } else {
            toast.error(result.message || "Failed to convert currency");
            setSelectedCountry(reduxCurrency || null);
          }
        })
        .catch((error) => {
          console.error("Currency conversion error:", error);
          toast.error("Something went wrong with currency conversion");
          setSelectedCountry(reduxCurrency || null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [randomToken, dispatch, reduxCurrency, onCurrencyChange],
  );

  // Initialize currency
  useEffect(() => {
    if (currencyConversionIdCampaign) {
      dispatch(
        currencySymbolHandler({
          currencyConversionId: currencyConversionIdCampaign,
        }),
      );
    }
    setSelectedCountry(reduxCurrency || null);
  }, [currencyConversionIdCampaign, reduxCurrency, dispatch]);

  if (previewMode) {
    return null;
  }

  return (
    <StackComponent
      direction="row"
      justifyContent="flex-end"
      sx={{ marginTop: "17px !important", marginBottom: "15px" }}
    >
      <BoxComponent sx={{ width: "100px" }}>
        <Suspense fallback={<DropdownSkeleton />}>
          <DropDown
            disableClearable={true}
            isLabel={false}
            placeholder={currencyCode || currency}
            data={activeCurrencies}
            onChange={handleDropDownChange}
            selectedValue={selectedCountry}
            isHeightCustomizable={true}
            textColor="#A1A1A8"
            disabled={isLoading}
          />
        </Suspense>
      </BoxComponent>
    </StackComponent>
  );
}
