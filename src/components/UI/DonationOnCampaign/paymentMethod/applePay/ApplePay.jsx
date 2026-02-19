"use client";

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { calculateTotalAmount } from "@/utils/helpers";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
// import toast from "react-hot-toast";

const ApplePay = ({
  tipValue,
  donationValues,
  onClickHandler,
  setGoogleLoader,
  orderBump,
  processingFee,
  newDonation = false,
}) => {
  // const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const recurlyKey = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;
  const experimentalFeature = getCookie("abtesting");
  // console.log("apple", isApplePayAvailable);

  const comingFromRecurringPayment = useSelector(
    (state) => state.donation.isRecurring,
  );

  // const emailAddress = useSelector((state) => state.donation.email);
  const emailAddressNew = useSelector(
    (state) => state?.donation?.cardHolderName?.email,
  );

  const applePayButtonRef = useRef(null);
  const applePayInstanceRef = useRef(null);

  // **Compute totalAmountValue directly so it updates with changes**
  let totalAmountValue = 0;
  totalAmountValue = calculateTotalAmount(
    comingFromRecurringPayment,
    donationValues,
    tipValue,
    orderBump,
    processingFee,
  );
  const processingFeeValue = parseFloat(
    ((processingFee / 100) * totalAmountValue).toFixed(2),
  );

  if (processingFeeValue) {
    totalAmountValue = parseFloat(totalAmountValue) + processingFeeValue;
  }
  // **Re-initialize Apple Pay instance whenever totalAmountValue changes**
  // **Re-initialize Apple Pay instance whenever totalAmountValue changes**
  useEffect(() => {
    let applePay;
    let initTimer;

    const initializeApplePay = () => {
      try {
        if (typeof window !== "undefined" && window.recurly) {
          window.recurly.configure(recurlyKey);

          applePay = window.recurly.ApplePay({
            country: "CA",
            currency: donationValues?.units,
            label: "Madinah",
            total: totalAmountValue.toString(),
            callbacks: {
              onPaymentAuthorized: (payment) => {
                setGoogleLoader(true);
                const { recurlyToken, billingContact } = payment.payment;
                const name = {
                  firstName: billingContact?.familyName,
                  lastName: billingContact?.givenName,
                };
                const address = billingContact?.addressLines?.join();

                const userDetails = {
                  token: recurlyToken.id,
                  countryCode: billingContact?.countryCode,
                  address: address,
                  city: billingContact?.locality,
                  name: name,
                  postalCode: billingContact?.postalCode,
                  email:
                    experimentalFeature === "donation_version_1"
                      ? emailAddressNew
                      : emailAddressNew,
                };

                if (recurlyToken.id) {
                  onClickHandler(userDetails);
                }
              },
            },
          });

          applePayInstanceRef.current = applePay;

          applePay.on("error", function (err) {
            console.error(`Apple Pay error: ${err.message}`);
          });
        } else {
          // Retry initialization if recurly is not yet available
          initTimer = setTimeout(initializeApplePay, 500);
        }
      } catch (error) {
        console.error("Error during Apple Pay setup", error);
        toast.dismiss();
        console.error("An error occurred while setting up Apple Pay.");
      }
    };

    initializeApplePay();

    return () => {
      if (initTimer) clearTimeout(initTimer);
    };
  }, [recurlyKey, donationValues, tipValue, totalAmountValue]);

  // **Set up the event listener once to avoid multiple bindings**
  useEffect(() => {
    const applePayButton = applePayButtonRef.current;
    if (applePayButton) {
      const handleClick = () => {
        if (applePayInstanceRef.current) {
          applePayInstanceRef.current.begin();
        } else {
          console.error("Apple Pay not initialized properly.");
        }
      };
      applePayButton.addEventListener("click", handleClick);

      // **Clean up the event listener on unmount**
      return () => {
        applePayButton.removeEventListener("click", handleClick);
      };
    } else {
      console.error("Apple Pay button reference is null.");
    }
  }, []);

  return (
    <apple-pay-button
      ref={applePayButtonRef}
      buttonstyle="black"
      type="plain"
      style={{ width: newDonation ? "100%" : "default" }}
    ></apple-pay-button>
  );
};

ApplePay.propTypes = {
  tipValue: PropTypes.number,
  donationValues: PropTypes.any,
  onClickHandler: PropTypes.func,
  setGoogleLoader: PropTypes.func,
  orderBump: PropTypes.any,
  processingFee: PropTypes.any,
};

export default ApplePay;
