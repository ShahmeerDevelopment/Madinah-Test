"use client";

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { calculateTotalAmount } from "@/utils/helpers";
// import styles from "./googlePay.module.css";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useRecurlyReady } from "@/hooks/useRecurlyReady";

const GooglePay = ({
  onClickHandler,
  tipValue,
  donationValues,
  setGoogleLoader,
  orderBump,
  processingFee,
}) => {
  const experimentalCookie = getCookie("abtesting");
  const merchantId = process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID;
  const recurlyKey = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;
  const isRecurlyReady = useRecurlyReady();

  const comingFromRecurringPayment = useSelector(
    (state) => state.donation.isRecurring,
  );

  // Use refs to store callback functions to prevent re-initialization
  const onClickHandlerRef = useRef(onClickHandler);
  const setGoogleLoaderRef = useRef(setGoogleLoader);

  // Update refs when callbacks change
  useEffect(() => {
    onClickHandlerRef.current = onClickHandler;
    setGoogleLoaderRef.current = setGoogleLoader;
  }, [onClickHandler, setGoogleLoader]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.loadRecurly) {
      window.loadRecurly();
    }
  }, []);

  // const orderBump = useSelector((state) => state.donation.orderBump);
  // const processingFee = useSelector((state) => state.donation.processingFee);

  let totalAmountValue = 0;

  // Calculate total amount
  totalAmountValue = calculateTotalAmount(
    comingFromRecurringPayment,
    donationValues,
    tipValue,
    orderBump,
  ).toFixed(2);
  const processingFeeValue = parseFloat(
    ((processingFee / 100) * totalAmountValue).toFixed(2),
  );

  if (processingFeeValue) {
    totalAmountValue = parseFloat(totalAmountValue) + processingFeeValue;
  }

  useEffect(() => {
    // Only proceed if Recurly is ready
    if (!isRecurlyReady) {
      return;
    }

    if (window.recurly) {
      window.recurly.configure(recurlyKey);
      const googlePay = window.recurly.GooglePay({
        currency: donationValues.units, //like - USD
        country: "CA", //like - US
        total: totalAmountValue.toString(),
        googleMerchantId: merchantId,
        billingAddressRequired: true,
        environment: "PRODUCTION",
        paymentDataRequest: { emailRequired: true },
        buttonOptions: { buttonType: "plain", buttonSizeMode: "fill" },
        callbacks: {
          onPaymentAuthorized: (paymentData) => {
            setGoogleLoaderRef.current(true);
            const {
              recurlyToken: token,
              paymentMethodData,
              email,
              error,
            } = paymentData;
            // console.log("data after payment", paymentData);
            console.error(`error occurred: ${error}`);

            const user = paymentMethodData.info?.billingAddress;
            const userDetails = {
              token: token.id,
              countryCode: user?.countryCode,
              address: user?.address1,
              city: user?.locality,
              name: user?.name,
              postalCode: user?.postalCode,
              email: email,
            };
            if (token.id) {
              onClickHandlerRef.current(userDetails); // Invoking the onClickHandler function passed from parent
            }

            // Submit the token to your server for processing
          },
        },
      });

      googlePay.on("ready", (googlePayButton) => {
        const container = document.getElementById(
          "google-pay-button-container",
        );
        container.innerHTML = ""; // Clear the container before appending the new button
        container.appendChild(googlePayButton);
      });

      googlePay.on("error", (err) => {
        setGoogleLoaderRef.current(false);
        console.error("Google Pay error", err);
      });
    } else {
      setGoogleLoaderRef.current(false);
      toast.error("Recurrly.js is not loaded");
    }
  }, [
    isRecurlyReady,
    recurlyKey,
    merchantId,
    donationValues.units,
    totalAmountValue,
  ]);

  return (
    <div
      id="google-pay-button-container"
      className={
        experimentalCookie === "donation_version_1"
          ? "gpay-button-container-new"
          : "gpay-button-container-new"
      }
    >
      {!isRecurlyReady && (
        <div
          style={{
            padding: "10px",
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          Loading Google Pay...
        </div>
      )}
    </div>
  );
};

GooglePay.propTypes = {
  onClickHandler: PropTypes.func,
  tipValue: PropTypes.number,
  donationValues: PropTypes.any,
  setGoogleLoader: PropTypes.func,
};

export default GooglePay;
