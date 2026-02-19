"use client";

import React, { useEffect, useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  styled,
} from "@mui/material";
import PropTypes from "prop-types";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CalenderButton from "../calenderButton/CalenderButton";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import DatePickerComp from "../datePicker/DatePickerComp";
import { AUTOMATIC_DONATION_DAYS } from "@/config/constant";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat"; // Required for 'Do' ordinal formatting
import TypographyComp from "@/components/atoms/typography/TypographyComp";

dayjs.extend(advancedFormat);

const CustomRadio = styled(Radio)(({ theme }) => ({
  "&.MuiRadio-root": {
    color: "#A1A1A8", // gray circle color
    padding: "12px",
    gap: "10px",
    marginTop: "-8px", // Move the radio button more upward
    alignSelf: "flex-start", // Align to the top of the content
    "& .MuiSvgIcon-root": {
      // Icon size
      fontSize: "17px",
    },
  },

  // Style for the checked state
  "&.Mui-checked": {
    color: "#C1C1F5",
    marginTop: "-8px", // Ensure consistent alignment when checked
    "&:after": {
      // eslint-disable-next-line quotes
      content: '""', // display: 'block',
      width: "13px",
      height: "13px",
      borderRadius: "24px",
      backgroundColor: theme.palette.primary.main,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  },
}));

// Create a dynamic FormControlLabel that can receive subtext props
const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  alignItems: "flex-start", // Align to the top for better label alignment
  margin: 0, // Remove default margin
  marginBottom: "16px", // Add space between stacked radio buttons
  "& .MuiFormControlLabel-label": {
    marginTop: "2px", // Fine-tune label position
  },
}));

const RadioButtonGroups = ({
  label,
  options,
  value,
  onChange,
  specialDays = null, // Add specialDays prop to receive selected special days
  specialDaysEndDate = null, // Add specialDaysEndDate prop to receive end date
  handleSpecialDaysClick = () => { },
  automaticDonationDays = null, // New prop for campaign data
  isEdit = false, // New prop to indicate if it's in edit mode
}) => {
  // Get subtext from options if available
  const subtext = options.subtext || null;
  const isSpecialDaysOption = options.value === "recurringDonation";
  const isSpecialDaysSelected = value === "recurringDonation";

  // Initialize selectedSpecialDays with the specialDays prop when available
  const [selectedSpecialDays, setSelectedSpecialDays] = useState(
    specialDays ? [specialDays] : []
  );
  // Initialize selectedDate with the specialDaysEndDate prop when available
  const [selectedDate, setSelectedDate] = useState(
    specialDaysEndDate ? dayjs(specialDaysEndDate) : null
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Filter donation days based on automaticDonationDays data
  const getFilteredDonationDays = () => {
    // Always show "Every Friday" and "Monthly" (last two items)
    const alwaysShowButtons = AUTOMATIC_DONATION_DAYS.filter(
      (item) => item.value === "everyFriday" || item.value === "monthly"
    );

    if (automaticDonationDays) {
      // Show buttons based on what keys are present in automaticDonationDays
      const conditionalButtons = AUTOMATIC_DONATION_DAYS.filter((item) => {
        // Check if the button's value matches any key in automaticDonationDays
        return Object.prototype.hasOwnProperty.call(
          automaticDonationDays,
          item.value
        );
      });

      // Combine conditional buttons with always-show buttons, removing duplicates
      const allButtons = [...conditionalButtons, ...alwaysShowButtons];
      const uniqueButtons = allButtons.filter(
        (button, index, array) =>
          array.findIndex((b) => b.value === button.value) === index
      );
      return uniqueButtons;
    }

    // If no automaticDonationDays, show all buttons
    return AUTOMATIC_DONATION_DAYS;
  };
  // Reset selected days when the option is deselected
  useEffect(() => {
    if (!isSpecialDaysSelected) {
      setSelectedSpecialDays([]);
      setSelectedDate(null);
      // Reset both values when special days option is deselected
      handleSpecialDaysClick(null, null);
    }
  }, [isSpecialDaysSelected, handleSpecialDaysClick]);

  // Update selectedSpecialDays when specialDays prop changes (for editing)
  useEffect(() => {
    if (specialDays && isSpecialDaysSelected) {
      setSelectedSpecialDays([specialDays]);
    } else if (!specialDays && !isSpecialDaysSelected) {
      setSelectedSpecialDays([]);
    }
  }, [specialDays, isSpecialDaysSelected]);

  // Update selectedDate when specialDaysEndDate prop changes (for editing)
  useEffect(() => {
    if (specialDaysEndDate) {
      setSelectedDate(dayjs(specialDaysEndDate));
    } else {
      setSelectedDate(null);
    }
  }, [specialDaysEndDate]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setIsDatePickerOpen(false);
    // Pass the ending date back to parent along with selected special days
    if (selectedSpecialDays.length > 0) {
      handleSpecialDaysClick(selectedSpecialDays[0], newDate);
    }
  };

  const handleCalendarOpen = () => {
    setIsDatePickerOpen(true);
  };

  return (
    <FormControl sx={{ mb: -0.5, width: "100%" }}>
      <RadioGroup
        aria-labelledby={`${label}-radio-buttons-group`}
        name={`${label}-radio-buttons-group`}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          if (event.target.value === "oneTimeDonation") {
            // Reset special days when switching to one-time donation
            setSelectedSpecialDays([]);
            setSelectedDate(null);
            handleSpecialDaysClick(null, null);
          }
        }}
        sx={{
          alignItems: "flex-start",
          "& .MuiFormControlLabel-root": {
            marginBottom: "12px", // Add spacing between radio buttons
          },
        }}
      >
        <BoxComponent sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
          <BoxComponent sx={{ display: "flex", alignItems: "flex-start" }}>
            <StyledFormControlLabel
              hasSubtext={Boolean(subtext)}
              value={options.value}
              control={<CustomRadio />}
              label={
                <BoxComponent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    pt: 0,
                    mt: 0,
                  }}
                >
                  <TypographyComp
                    sx={{
                      fontWeight: 500,
                      fontSize: "18px",
                      lineHeight: "22px",
                      color: "#424243",
                      mt: 0,
                    }}
                    variant="body1"
                  >
                    {options.label}
                  </TypographyComp>
                  {subtext && (
                    <TypographyComp
                      variant="caption"
                      sx={{
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "16px",
                        color: "#A1A1A8",
                      }}
                    >
                      {subtext}
                    </TypographyComp>
                  )}
                </BoxComponent>
              }
            />
          </BoxComponent>
          {isSpecialDaysOption && isSpecialDaysSelected && (
            <BoxComponent
              sx={{ mt: 2, ml: { xs: "10px", sm: isEdit ? "0px" : "41px" } }}
            >
              <BoxComponent sx={{ marginTop: "15px" }}>
                {getFilteredDonationDays()?.map((item) => (
                  <ButtonComp
                    key={item.id}
                    sx={{
                      height: "44px",
                      fontWeight: 400,
                      fontSize: "16px",
                      color: selectedSpecialDays.includes(item.value)
                        ? "#090909"
                        : "#A1A1A8",
                      borderRadius: "14px",
                      border: selectedSpecialDays.includes(item.value)
                        ? "1px solid #6363E6"
                        : "1px solid #E9E9EB",
                      marginTop: "6px",
                      marginRight: "6px",
                      width: { xs: "98%", sm: "400px" },
                      justifyContent: "start",
                      // backgroundColor: selectedSpecialDays.includes(
                      //   item.value
                      // )
                      //   ? "rgba(239, 68, 68, 0.05)"
                      //   : "transparent",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        borderColor: selectedSpecialDays.includes(item.value)
                          ? "#6363E6"
                          : "#C1C1F5",
                      },
                    }}
                    variant="outlined"
                    onClick={() => {
                      // Set only the clicked item as selected (radio button behavior)
                      // If the item is already selected, keep it selected
                      if (!selectedSpecialDays.includes(item.value)) {
                        setSelectedSpecialDays([item.value]);
                        // Clear end date for all options when clicked
                        setSelectedDate(null);
                        handleSpecialDaysClick(item.value, null);
                      }
                    }}
                  >
                    {item.label}
                  </ButtonComp>
                ))}
              </BoxComponent>
              {selectedSpecialDays?.length > 0 &&
                (selectedSpecialDays[0] === "monthly" ||
                  selectedSpecialDays[0] === "everyFriday") ? (
                <BoxComponent
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row", md: "row" },
                    alignItems: "start",
                    justifyContent: "start",
                    gap: { xs: 0.5, sm: 1 },
                    width: { xs: "98%", sm: "400px" }, // Updated width
                    marginTop: "10px",
                  }}
                >
                  <CalenderButton
                    sx={{ justifyContent: "start" }}
                    content={`Ending: ${selectedDate
                      ? selectedDate?.format("Do MMMM, YYYY")
                      : "Never"
                      }`}
                    onClickHandler={handleCalendarOpen}
                    width={"100%"}
                    height={"44px"}
                    boxShadow="0px 4px 15px 0px #0000000F"
                  />
                </BoxComponent>
              ) : null}
            </BoxComponent>
          )}
        </BoxComponent>
      </RadioGroup>

      {/* Transparent DatePicker - only for calendar popup */}
      <BoxComponent
        sx={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <DatePickerComp
          value={selectedDate}
          onChange={handleDateChange}
          label="End Date"
          disableFuture={false}
          width="100%"
          isLabel={false}
          open={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          minDate={dayjs().add(1, "day")}
        />
      </BoxComponent>
    </FormControl>
  );
};

RadioButtonGroups.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    subtext: PropTypes.string, // Optional subtext
  }),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  specialDays: PropTypes.string, // Add specialDays prop
  specialDaysEndDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Add specialDaysEndDate prop
  handleSpecialDaysClick: PropTypes.func,
  automaticDonationDays: PropTypes.object, // New prop for automatic donation days data
  isEdit: PropTypes.bool, // Add isEdit prop
};

export default RadioButtonGroups;
