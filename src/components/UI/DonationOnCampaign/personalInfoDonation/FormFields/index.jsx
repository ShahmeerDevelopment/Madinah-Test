"use client";

import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import React, { memo, useCallback, useState } from "react";
// import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { theme } from "@/config/customTheme";
// import { saveCardHandler } from "@/store/slices/donationSlice";
import NewTextFieldComp from "@/components/atoms/inputFields/NewTextFieldComp";
import Tooltip from "@mui/material/Tooltip";

export const FullNameField = memo(({ formik, isStoredCardSelected, ...otherProps }) => {
  const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
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
        sx={{ borderRadius: "10px" }}
        fullWidth
        id="fullName"
        name="fullName"
        autoComplete="name"
        label="Full name*"
        placeholder={"Enter your full name"}
        value={formik.values.fullName}
        height="40px"
        onChange={handleChange}
        onBlur={handleBlur}
        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
        helperText={formik.touched.fullName && formik.errors.fullName}
        newDonation
        {...otherProps}
      />
    </div>
  );
});
FullNameField.displayName = "FullNameField";
FullNameField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const FirstNameField = memo(({ formik, isStoredCardSelected }) => {
  const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
  const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
  return (
    <div>
      <NewTextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        sx={{ borderRadius: "10px" }}
        fullWidth
        id="firstName"
        name="firstName"
        autoComplete="first-name"
        label="First name*"
        placeholder={"Enter first name"}
        value={formik.values.firstName}
        height="52px"
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
      <NewTextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fullWidth
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="lastName"
        name="lastName"
        label="Last name*"
        autoComplete="last-name"
        placeholder={"Enter last name"}
        sx={{ borderRadius: "10px" }}
        height="52px"
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
    <div style={{ width: "100%" }}>
      <NewTextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="email"
        name="email"
        sx={{ borderRadius: "10px", top: "-5px" }}
        height={"52px"}
        label="Email address*"
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

export const AddressOneField = memo(({ formik, isStoredCardSelected }) => {
  const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
  const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
  return (
    <div style={{ width: "100%" }}>
      <NewTextFieldComp
        // isRequired
        disabled={isStoredCardSelected}
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="addressOne"
        name="addressOne"
        sx={{ borderRadius: "10px" }}
        height={"40px"}
        label="Address Line 1"
        autoComplete="address-line1"
        placeholder="Enter your address"
        value={formik.values.addressOne}
        onChange={handleChange}
        onBlur={handleBlur}
        error={formik.touched.addressOne && Boolean(formik.errors.addressOne)}
        helperText={formik.touched.addressOne && formik.errors.addressOne}
        fullWidth
      />
    </div>
  );
});
AddressOneField.displayName = "AddressOneField";
AddressOneField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const AddressTwoField = memo(({ formik, isStoredCardSelected }) => {
  const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
  const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
  return (
    <div style={{ width: "100%" }}>
      <NewTextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="addressTwo"
        name="addressTwo"
        sx={{ borderRadius: "10px" }}
        height={"40px"}
        label="Address Line 2"
        autoComplete="address-line2"
        placeholder="Enter your address"
        value={formik.values.addressTwo}
        onChange={handleChange}
        onBlur={handleBlur}
        error={formik.touched.addressTwo && Boolean(formik.errors.addressTwo)}
        helperText={formik.touched.addressTwo && formik.errors.addressTwo}
        fullWidth
      />
    </div>
  );
});
AddressTwoField.displayName = "AddressTwoField";
AddressTwoField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const CityField = memo(({ formik, isStoredCardSelected }) => {
  const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
  const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
  return (
    <div style={{ width: "100%" }}>
      <NewTextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="city"
        name="city"
        sx={{ borderRadius: "10px" }}
        height={"40px"}
        label="City"
        autoComplete="city"
        placeholder="Enter your city"
        value={formik.values.city}
        onChange={handleChange}
        onBlur={handleBlur}
        error={formik.touched.city && Boolean(formik.errors.city)}
        helperText={formik.touched.city && formik.errors.city}
        fullWidth
      />
    </div>
  );
});
CityField.displayName = "CityField";
CityField.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  formik: PropTypes.any,
};

export const StateField = memo(({ formik, isStoredCardSelected }) => {
  const handleChange = useCallback((e) => formik.handleChange(e), [formik]);
  const handleBlur = useCallback((e) => formik.handleBlur(e), [formik]);
  return (
    <div style={{ width: "100%" }}>
      <NewTextFieldComp
        isRequired
        disabled={isStoredCardSelected}
        fontColor={
          isStoredCardSelected ? theme.palette.primary.gray : "inherit"
        }
        id="state"
        name="state"
        sx={{ borderRadius: "10px" }}
        height={"40px"}
        label="State"
        autoComplete="state"
        placeholder="Enter your state"
        value={formik.values.state}
        onChange={handleChange}
        onBlur={handleBlur}
        error={formik.touched.state && Boolean(formik.errors.state)}
        helperText={formik.touched.state && formik.errors.state}
        fullWidth
      />
    </div>
  );
});
StateField.displayName = "StateField";
StateField.propTypes = {
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
    [formik.setFieldValue]
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
    [formik.values.cardNumber]
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

export const DonateAnon = ({ formik }) => {
  const [showQuestionTooltip, setShowQuestionTooltip] = useState(false);

  const checkHandler = useCallback(
    (e) => {
      formik.setFieldValue("donateAnon", e.target.checked);
    },
    [formik]
  );

  const handleQuestionClick = (e) => {
    e.stopPropagation();
    setShowQuestionTooltip(!showQuestionTooltip);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <CheckBoxComp
        ml={-2}
        mt={"2px"}
        specialIcon={true}
        customCheckbox={true}
        specialIconColor={"#0CAB72"}
        label="Donate anonymously"
        checked={formik.values.donateAnon}
        onChange={(e) => checkHandler(e)}
      />
      <Tooltip
        open={showQuestionTooltip}
        onClose={() => setShowQuestionTooltip(false)}
        title="We won't display your information in any public feeds."
        placement="top"
        arrow
      >
        <HelpOutlineIcon
          sx={{
            fontSize: "16px",
            color: "#6363e6",
            marginLeft: "4px",
            cursor: "pointer",
            "&:hover": { opacity: 0.8 },
          }}
          onClick={handleQuestionClick}
        />
      </Tooltip>
    </div>
  );
};

DonateAnon.propTypes = {
  formik: PropTypes.object.isRequired,
};
