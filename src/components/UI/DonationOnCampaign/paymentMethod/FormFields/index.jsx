"use client";

import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";
import { theme } from "@/config/customTheme";
import { saveCardHandler } from "@/store/slices/donationSlice";

export const FirstNameField = memo(({ formik, isStoredCardSelected }) => {
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
      />
    </div>
  );
});
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

export const CardNumberField = memo(({ formik, isStoredCardSelected }) => {
  const handleCardNumberChange = useCallback(
    (event) => {
      let value = event.target.value.replace(/\D/g, ""); // Remove non-digits
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

      value = value.slice(0, maxLength); // Limit based on card type
      value = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Add space every 4 digits

      formik.setFieldValue("cardNumber", value);
    },
    [formik.setFieldValue],
  );
  const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
  return (
    <div>
      <TextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="cardNumber"
        name="cardNumber"
        label="Card number"
        autoComplete="cardNumber"
        placeholder="Enter your card number"
        value={formik.values.cardNumber}
        onChange={handleCardNumberChange}
        onBlur={handleBlur}
        error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
        helperText={formik.touched.cardNumber && formik.errors.cardNumber}
        fullWidth
      />
    </div>
  );
});

CardNumberField.displayName = "CardNumberField";
CardNumberField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const NameOnCardField = memo(({ formik, isStoredCardSelected }) => {
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
      />
    </div>
  );
});

NameOnCardField.displayName = "NameOnCardField";
NameOnCardField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const ExpiryDateField = memo(({ formik, isStoredCardSelected }) => {
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
      <TextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="expiryDate"
        name="expiryDate"
        label="Expiry date (MM/YY)"
        placeholder="MM/YY"
        value={formik.values.expiryDate}
        onChange={handleExpiryChange}
        onBlur={handleBlur}
        error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
        helperText={formik.touched.expiryDate && formik.errors.expiryDate}
        fullWidth
      />
    </div>
  );
});
ExpiryDateField.displayName = "ExpiryDateField";

ExpiryDateField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const CVVField = memo(({ formik, isStoredCardSelected }) => {
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
    [formik.values.cardNumber],
  );

  const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
  return (
    <div>
      <TextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="cvv"
        name="cvv"
        label="CVV"
        placeholder="Enter CVV"
        onChange={handleCvvChange}
        value={formik.values.cvv}
        onBlur={handleBlur}
        error={formik.touched.cvv && Boolean(formik.errors.cvv)}
        helperText={formik.touched.cvv && formik.errors.cvv}
        fullWidth
      />
    </div>
  );
});

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
};
