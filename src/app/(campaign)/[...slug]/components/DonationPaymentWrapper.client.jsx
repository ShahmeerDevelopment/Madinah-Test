"use client";

/**
 * DonationPaymentWrapper - Client Component for the NewPayment form
 *
 * This wraps the payment form which appears when user clicks donate.
 * It monitors the donatePress state from Redux.
 */

import { lazy, Suspense, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import {
  resetDonationState,
  donateCurrencyHandler,
  currencySymbolHandler,
} from "@/store/slices/donationSlice";
import { useInjectDonationSlices } from "@/hooks/useInjectReducers";

// Lazy load payment component
const NewPayment = lazy(
  () => import("@/components/UI/DonationOnCampaign/NewPayment"),
);

// Loading component
const LoadingSpinner = ({ height = "50px" }) => (
  <BoxComponent
    sx={{ display: "flex", justifyContent: "center", p: 2, height }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>Loading...</div>
  </BoxComponent>
);

export default function DonationPaymentWrapper({
  children,
  onPaymentStateChange,
}) {
  // Inject donation flow slices
  useInjectDonationSlices();

  const dispatch = useDispatch();
  const donatePress = useSelector((state) => state.donation?.donatePress);
  const currency = useSelector((state) => state.donation?.currency);
  const currencySymbol = useSelector((state) => state.donation?.currencySymbol);

  // Use refs to capture current values for cleanup
  const currencyRef = useRef(currency);
  const currencySymbolRef = useRef(currencySymbol);

  // Update refs when currency changes
  useEffect(() => {
    currencyRef.current = currency;
    currencySymbolRef.current = currencySymbol;
  }, [currency, currencySymbol]);

  // Notify parent when payment state changes
  useEffect(() => {
    if (onPaymentStateChange) {
      onPaymentStateChange(donatePress);
    }
  }, [donatePress, onPaymentStateChange]);

  // Reset donation state when unmounting, but preserve currency
  useEffect(() => {
    return () => {
      // Get current currency values from refs
      const currentCurrency = currencyRef.current;
      const currentCurrencySymbol = currencySymbolRef.current;

      dispatch(resetDonationState());

      // Restore currency after reset
      if (currentCurrency) {
        dispatch(donateCurrencyHandler(currentCurrency));
      }
      if (currentCurrencySymbol) {
        dispatch(currencySymbolHandler(currentCurrencySymbol));
      }
    };
  }, [dispatch]);

  if (donatePress) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <NewPayment />
      </Suspense>
    );
  }

  return children;
}
