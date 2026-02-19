"use client";

import React, { useEffect, useState } from "react";
import PhoneInput from "@ammarkhalidfarooq/react-phone-input-2";
import "@ammarkhalidfarooq/react-phone-input-2/lib/style.css";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import StackComponent from "../StackComponent";
import { useDispatch } from "react-redux";
import { phoneNumberFormatValidator } from "../../../store/slices/metaSlice";
import { ASSET_PATHS } from "@/utils/assets";
const ArrowIcon = ASSET_PATHS.bankDetails.arrow;

export const StyledPhoneInput = styled(PhoneInput)(({
  borderRadius,
  height,
}) => {
  return {
    width: "100% !important",

    "& .form-control": {
      width: "100% !important",
      borderRadius: `${borderRadius} !important`,
      paddingTop: "3px",
      boxShadow: "0 0 0 0 !important",
      color: "#67758d",
      height: `${height} !important`,
      // height: "40px !important",
      backgroundColor: "transparent !important",
      borderColor: "#d0d0d4 !important",
      "&:-webkit-autofill": {
        "-webkit-text-fill-color": "#67758d !important",
        "-webkit-box-shadow": "0 0 0 30px white inset !important",
      },
    },

    "& .flag-dropdown": {
      border: "none !important",
      backgroundColor: "transparent !important",
      height: height === "52px" ? "35px" : "28px",
      width: "40px",
      padding: "none",
      margin: "5px 0px 0px 8px",
      "& .arrow": {
        display: "none",
      },
      "&::after": {
        content: "''",
        position: "absolute",
        top: "62%",
        right: "2px",
        transform: "translateY(-50%)",
        width: "10px", // Adjust based on your arrow icon size
        height: "10px",
        backgroundImage: `url(${ArrowIcon})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        pointerEvents: "none", // Allow clicks to pass through to the dropdown
      },
    },

    "& .country-list": {
      fontSize: "15px",
      "&::-webkit-scrollbar": {
        width: "4px",
        backgroundColor: "#fff",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#E9E9EB", // Custom color for the scrollbar thumb
        borderRadius: "8px", // Rounded corners
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent", // Transparent track
      },
      // Completely hide the scrollbar buttons (up and down arrows)
      "&::-webkit-scrollbar-button": {
        display: "none", // Hide the scrollbar buttons
      },
    },
  };
});

const PhoneInputField = ({
  styleOverrides,
  value,
  onInputChange,
  countriesData,
  disabled = false,
  labelColor = "#A1A1A8",
  label,
  previousPhoneNumber,
  borderRadius = "16px",
  height = "40px",
  ...otherProps
}) => {
  const dispatch = useDispatch();
  const [isValid, setIsValid] = useState(true);
  const [dialCodeLength, setDialCodeLength] = useState(0);

  // Function to validate phone number based on length
  const isPhoneNumberValid = (value, country) => {
    if (!country || !country.format) {
      return false;
    }
    const countDigits = (format) => {
      return (format.match(/\./g) || []).length;
    };
    const formatLength = countDigits(country.format);
    const actualLength = value.replace(/\D/g, "").length;
    return formatLength === actualLength;
  };

  useEffect(() => {
    // Check if profileData.phoneNumber exists and validate it
    if (previousPhoneNumber) {
      dispatch(phoneNumberFormatValidator(true));
      setIsValid(true);
    }
  }, [previousPhoneNumber, dispatch]);

  const handleInputChange = (newVal, country) => {
    const valid = isPhoneNumberValid(newVal, country);
    setDialCodeLength(country?.dialCode.length);
    // if (valid) {
    dispatch(phoneNumberFormatValidator(valid));
    // }
    setIsValid(valid);
    onInputChange(`+${newVal}`, isValid);
  };

  return (
    <StackComponent direction="column" spacing="8px" sx={{ width: "100%" }}>
      {label || label === "" ? (
        <div
          style={{
            color: labelColor,
            fontWeight: 400,
            fontSize: "14px",
            marginBottom: "-4px",
          }}
        >
          {label}
        </div>
      ) : null}
      <StyledPhoneInput
        // inputProps={{
        // 	autoFocus: true,
        // }}
        {...otherProps}
        style={{ ...styleOverrides }}
        country={"us"}
        onlyCountries={countriesData}
        borderRadius={borderRadius}
        placeholder={"Phone Number"}
        height={height}
        value={value}
        onChange={(newVal, country) => handleInputChange(newVal, country)}
        disabled={disabled}
        // enableLongNumbers
        enableSearch
        preferredCountries={["us", "gb", "ca"]}
        isValid={(value, country) => isPhoneNumberValid(value, country)}
      />
      {isValid === false && value?.length > dialCodeLength + 1 ? (
        <div
          style={{
            color: "red",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "20px",
            marginTop: "0px",
          }}
        >
          Invalid phone number format.
        </div>
      ) : null}
    </StackComponent>
  );
};

PhoneInputField.propTypes = {
  disabled: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  styleOverrides: PropTypes.object,
  countriesData: PropTypes.array,
  previousPhoneNumber: PropTypes.any,
  labelColor: PropTypes.string,
};

export default PhoneInputField;
