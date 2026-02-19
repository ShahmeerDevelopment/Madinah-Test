"use client";

import React from "react";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { theme } from "../../../config/customTheme";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const CustomTextField = styled(TextField)(
  ({ monthlyDonation, isOneTimeDonations, isHighlighted, isSmallScreen }) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: "28px",
      padding: "13px",
      height: isSmallScreen
        ? "136px"
        : monthlyDonation && isOneTimeDonations
          ? "100px"
          : "100px",
      border: isHighlighted ? "2px solid transparent" : "2px solid #E9E9EB",
      background:
        "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box",
      "&.Mui-focused": {
        border: "2px solid transparent",

        background:
          "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box",
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 500,
      fontSize: "18px",
      lineHeight: "28px",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(14px, 9px) scale(1.5)",
      paddingLeft: "8px",
      color: theme.palette.primary.gray,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "blue",
    },
    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
    background: "white",
  })
);

const CustomInputField = ({
  value,
  onChange,
  onClick = () => {},
  min,
  // recurringDonation = false,
  // oneTimeDonation,
  monthlyDonation = false,
  isOneTimeDonations = false,
  isHighlighted,
  isOneTimeDonationForLabel,
}) => {
  const { isSmallScreen } = useResponsiveScreen();

  return (
    <div onClick={onClick}>
      <CustomTextField
        fullWidth
        type="number"
        onWheel={(e) => e.target.blur()}
        value={value}
        onChange={onChange}
        label={
          isOneTimeDonationForLabel ? "Custom donation" : "Custom donation"
        }
        placeholder={
          isOneTimeDonationForLabel ? "Enter donation" : "Enter donation"
        }
        variant="outlined"
        InputProps={{ inputProps: { min: min } }}
        InputLabelProps={{
          shrink: true,
        }}
        monthlyDonation={monthlyDonation} // Pass the props to the styled component
        isOneTimeDonations={isOneTimeDonations}
        isHighlighted={isHighlighted}
        isSmallScreen={isSmallScreen}
        sx={{
          "& .MuiOutlinedInput-input": {
            marginTop: monthlyDonation && isOneTimeDonations ? "10px" : "30px", // Adjust the margin to position the placeholder and text
          },
        }}
      />
    </div>
  );
};

CustomInputField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  min: PropTypes.string,
  // recurringDonation: PropTypes.bool,
  monthlyDonation: PropTypes.bool,
  isOneTimeDonations: PropTypes.bool,
  // oneTimeDonation: PropTypes.bool,
  isOneTimeDonationForLabel: PropTypes.bool,
};

export default CustomInputField;
