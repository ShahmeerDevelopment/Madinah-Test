"use client";

import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Image from "next/image";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";
import { theme } from "@/config/customTheme";
import { saveCardHandler } from "@/store/slices/donationSlice";
import { ASSET_PATHS } from "@/utils/assets";

// Card images from public folder for CDN delivery
const blackCard = ASSET_PATHS.svg.blackCard;
const visaCard = ASSET_PATHS.donations.visa;
const americaExpressCard = ASSET_PATHS.donations.americanExpress;
const masterCard = ASSET_PATHS.donations.mastercard;
const unionPayCard = ASSET_PATHS.donations.unionPay;
const discoverCard = ASSET_PATHS.donations.discover;
const dinersClubCard = ASSET_PATHS.donations.dinersClub;
const jcbCard = ASSET_PATHS.donations.jcb;
import NewTextFieldComp from "@/components/atoms/inputFields/NewTextFieldComp";

export const FirstNameField = memo(
  ({ formik, isStoredCardSelected, newDonation = false }) => {
    const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
    const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
    return (
      <div>
        <TextFieldComp
          isRequired
          disabled={isStoredCardSelected}
          fontColor={
            isStoredCardSelected ? theme.palette.primary.gray : "inherit"
          }
          fullWidth
          id="firstName"
          name="firstName"
          autoComplete="first-name"
          label="First name"
          placeholder={"Enter first name"}
          value={formik.values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
          newDonation={newDonation}
        />
      </div>
    );
  }
);
FirstNameField.displayName = "FirstNameField";
FirstNameField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const LastNameField = memo(({ formik, isStoredCardSelected }) => {
  const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
  const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
  return (
    <div>
      <TextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fullWidth
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="lastName"
        name="lastName"
        label="Last name"
        autoComplete="last-name"
        placeholder={"Enter last name"}
        value={formik.values.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
      />
    </div>
  );
});
LastNameField.displayName = "LastNameField";
LastNameField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const EmailField = memo(({ formik, isStoredCardSelected }) => {
  const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
  const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
  return (
    <div>
      <TextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="email"
        name="email"
        label="Email address"
        autoComplete="email"
        placeholder="Enter your email address"
        value={formik.values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        fullWidth
      />
    </div>
  );
});
EmailField.displayName = "EmailField";
EmailField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const CardNumberField = memo(
  ({ formik, isStoredCardSelected, newDonation = false, ...otherProps }) => {
    const [cardType, setCardType] = useState(null);

    const getCardType = (number) => {
      const cleanNumber = number.replace(/\s/g, "");
      if (!cleanNumber) return null;

      // Card type patterns
      const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]|^2[2-7]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/,
        dinersClub: /^3(?:0[0-5]|[68])/,
        jcb: /^35/,
        unionPay: /^62/,
      };

      for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(cleanNumber)) return type;
      }
      return null;
    };

    const getCardImage = (type) => {
      switch (type) {
        case "visa":
          return visaCard;
        case "mastercard":
          return masterCard;
        case "amex":
          return americaExpressCard;
        case "discover":
          return discoverCard;
        case "dinersClub":
          return dinersClubCard;
        case "jcb":
          return jcbCard;
        case "unionPay":
          return unionPayCard;
        default:
          return blackCard;
      }
    };

    const handleCardNumberChange = useCallback(
      (event) => {
        let value = event.target.value.replace(/\D/g, "");
        const newCardType = getCardType(value);
        setCardType(newCardType);

        const isAmexCard = value.startsWith("34") || value.startsWith("37");
        const isDinersClub = value.startsWith("30") || value.startsWith("38");
        const isVisaCardStartWith42 = value.startsWith("42");
        const maxLength = isAmexCard
          ? 15
          : isDinersClub
            ? 14
            : isVisaCardStartWith42
              ? 16
              : 16;

        value = value.slice(0, maxLength);
        value = value.replace(/(\d{4})(?=\d)/g, "$1 ");

        formik.setFieldValue("cardNumber", value);
      },
      [formik.setFieldValue]
    );

    const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);

    return (
      <div>
        <NewTextFieldComp
          isRequired
          disabled={isStoredCardSelected}
          fontColor={
            isStoredCardSelected ? theme.palette.primary.gray : "inherit"
          }
          labelColor="#606062"
          id="cardNumber"
          name="cardNumber"
          label="Card number*"
          autoComplete="cardNumber"
          placeholder="Enter your card number*"
          value={formik.values.cardNumber}
          onChange={handleCardNumberChange}
          onBlur={handleBlur}
          error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
          helperText={formik.touched.cardNumber && formik.errors.cardNumber}
          fullWidth
          newDonation={newDonation}
          sx={{ borderRadius: "10px" }}
          {...otherProps}
          InputProps={{
            endAdornment: (
              <Image
                src={getCardImage(cardType)}
                alt="card"
                width={40}
                height={24}
                style={{
                  opacity: cardType ? 1 : 0.2,
                  height: "24px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            ),
          }}
        />
      </div>
    );
  }
);

CardNumberField.displayName = "CardNumberField";
CardNumberField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const NameOnCardField = memo(
  ({ formik, isStoredCardSelected, ...otherProps }) => {
    const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
    const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
    return (
      <div>
        <TextFieldComp
          isRequired
          disabled={isStoredCardSelected}
          fontColor={
            isStoredCardSelected ? theme.palette.primary.gray : "inherit"
          }
          labelColor="#606062"
          id="nameOnCard"
          name="nameOnCard"
          label="Name on card"
          placeholder="Enter your card name"
          value={formik.values.nameOnCard}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.nameOnCard && Boolean(formik.errors.nameOnCard)}
          helperText={formik.touched.nameOnCard && formik.errors.nameOnCard}
          fullWidth
          {...otherProps}
        />
      </div>
    );
  }
);

NameOnCardField.displayName = "NameOnCardField";
NameOnCardField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const ExpiryDateField = memo(
  ({ formik, isStoredCardSelected, newDonation = false, ...otherProps }) => {
    const handleExpiryChange = useCallback((event) => {
      let value = event.target.value;
      value = value.replace(/\D/g, ""); // Remove non-digit characters

      // Automatically add "0" before single digit month not equal to "1" (to handle 2-9)
      if (value.length === 1 && value > 1) {
        value = "0" + value;
      }

      if (
        event.target.value.length === 2 &&
        event.nativeEvent.inputType === "deleteContentBackward"
      ) {
        value = value.slice(0, 1);
      }

      // Add slash after two digits and limit total length to 5 (including slash)
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      formik.setFieldValue("expiryDate", value);
    }, []);

    const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
    return (
      <div>
        <NewTextFieldComp
          isRequired
          disabled={isStoredCardSelected}
          fontColor={
            isStoredCardSelected ? theme.palette.primary.gray : "inherit"
          }
          labelColor="#606062"
          id="expiryDate"
          name="expiryDate"
          label="Expiry (MM/YY)*"
          placeholder="MM/YY*"
          value={formik.values.expiryDate}
          onChange={handleExpiryChange}
          onBlur={handleBlur}
          error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
          helperText={formik.touched.expiryDate && formik.errors.expiryDate}
          fullWidth
          newDonation={newDonation}
          sx={{ borderRadius: "10px" }}
          {...otherProps}
        />
      </div>
    );
  }
);
ExpiryDateField.displayName = "ExpiryDateField";

ExpiryDateField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const CVVField = memo(
  ({ formik, isStoredCardSelected, newDonation = false, ...otherProps }) => {
    const handleCvvChange = useCallback(
      (event) => {
        const value = event.target.value.replace(/\D/g, ""); // Remove non-digits
        // Determine if the card is an American Express card based on the card number
        const cardNumber = formik.values.cardNumber.replace(/\s/g, ""); // Remove spaces for check
        const isAmexCard =
          cardNumber.startsWith("34") || cardNumber.startsWith("37");
        const maxLength = isAmexCard ? 4 : 3;
        formik.setFieldValue("cvv", value.slice(0, maxLength)); // Limit based on card type
      },
      [formik.values.cardNumber]
    );

    const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
    return (
      <div>
        <NewTextFieldComp
          isRequired
          disabled={isStoredCardSelected}
          fontColor={
            isStoredCardSelected ? theme.palette.primary.gray : "inherit"
          }
          labelColor="#606062"
          id="cvv"
          name="cvv"
          label="CVV*"
          placeholder="Enter CVV*"
          onChange={handleCvvChange}
          value={formik.values.cvv}
          onBlur={handleBlur}
          error={formik.touched.cvv && Boolean(formik.errors.cvv)}
          helperText={formik.touched.cvv && formik.errors.cvv}
          fullWidth
          newDonation={newDonation}
          sx={{ borderRadius: "10px" }}
          {...otherProps}
        />
      </div>
    );
  }
);

CVVField.displayName = "CVVField";
CVVField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const SaveCardDataCheckbox = ({ isStoredCardSelected }) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const checkHandler = useCallback((e) => {
    setIsChecked(e.target.checked);
    dispatch(saveCardHandler(e.target.checked));
  }, []);
  return (
    <div>
      <CheckBoxComp
        ml={-2}
        mt={0}
        isStoredCardSelected={isStoredCardSelected}
        specialIcon={true}
        customCheckbox={true}
        specialIconColor={"#0CAB72"}
        label="Save card for future donations"
        checked={isChecked}
        onChange={(e) => checkHandler(e)}
      />
    </div>
  );
};

SaveCardDataCheckbox.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};
