/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
"use client";

import { InputAdornment } from "@mui/material";
import React, { useState, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import SubHeading from "../../../../components/atoms/createCampaigns/SubHeading";
import TextFieldComp from "../../../../components/atoms/inputFields/TextFieldComp";
import RadioButtonGroups from "../../../../components/molecules/radionButtonGroups/RadioButtonGroups";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import { LevelWrapper } from "@/styles/CampaignDetails.style";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import { useSelector } from "react-redux";
import StackComponent from "../../../../components/atoms/StackComponent";
import useResponsiveScreen from "../../../../hooks/useResponsiveScreen";
import { DONATION_METHOD_OPTION } from "../../../../config/constant";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";

const AddLevels = ({
  onAddLevel,
  isLoader,
  editedValue,
  duplicateData,
  isShowForm,
  setIsShowForm,
  existingLevels = [], // Add this prop to receive existing levels
  automaticDonationDays = null, // New prop to receive automaticDonationDays directly
  setShowAddButton, // New prop to control add button visibility
  setEditedValue, // New prop to reset edited value
  setDuplicateData, // New prop to reset duplicate data
}) => {
  const { isSmallerThan } = useResponsiveScreen();
  const smallerThan300 = isSmallerThan("300");
  const [levels, setLevels] = useState(
    duplicateData?.isLimited || editedValue?.isLimited
      ? "limited"
      : "unlimited",
  );
  const [specialDays, setSpecialDays] = useState(
    editedValue?.recurringType || duplicateData?.recurringType || "monthly",
  );
  const [specialDaysEndDate, setSpecialDaysEndDate] = useState(() => {
    const recurringType =
      editedValue?.recurringType || duplicateData?.recurringType;
    const endDate =
      editedValue?.recurringEndDate || duplicateData?.recurringEndDate;
    // Only return endDate if recurring type is monthly or everyFriday
    if (recurringType === "monthly" || recurringType === "everyFriday") {
      return endDate || null;
    }
    return null;
  });
  const {
    currency: currencySymbol,
    allowRecurringDonations,
    allowOneTimeDonations,
  } = useSelector((state) => state.mutateCampaign);

  // Get campaign details from Redux store to access automaticDonationDays
  const campaignDetails = useSelector((state) => state.mutateCampaign);

  // Use automaticDonationDays from props first, then fallback to Redux store
  const automaticDonationDaysData =
    automaticDonationDays || campaignDetails?.automaticDonationDays;

  const donationDefaultValue = editedValue?.donationType
    ? editedValue?.donationType
    : allowRecurringDonations === true && allowOneTimeDonations === false
      ? "recurringDonation"
      : "oneTimeDonation";

  const [donationOption, setDonationOption] = useState(donationDefaultValue);

  // Add useEffect to update donationOption when editedValue changes
  useEffect(() => {
    if (isShowForm.edit && editedValue?.donationType) {
      setDonationOption(editedValue.donationType);
    } else if (isShowForm.duplicate && duplicateData?.donationType) {
      setDonationOption(duplicateData.donationType);
    } else {
      setDonationOption(donationDefaultValue);
    }
  }, [
    editedValue?.donationType,
    duplicateData?.donationType,
    isShowForm.edit,
    isShowForm.duplicate,
    donationDefaultValue,
  ]);

  // Add useEffect to update specialDays when editedValue changes
  useEffect(() => {
    if (isShowForm.edit) {
      const recurringType = editedValue?.recurringType || "monthly";
      setSpecialDays(recurringType);
      // Only set endDate if recurring type is monthly or everyFriday
      if (recurringType === "monthly" || recurringType === "everyFriday") {
        setSpecialDaysEndDate(editedValue?.recurringEndDate || null);
      } else {
        setSpecialDaysEndDate(null);
      }
    } else if (isShowForm.duplicate) {
      const recurringType = duplicateData?.recurringType || "monthly";
      setSpecialDays(recurringType);
      // Only set endDate if recurring type is monthly or everyFriday
      if (recurringType === "monthly" || recurringType === "everyFriday") {
        setSpecialDaysEndDate(duplicateData?.recurringEndDate || null);
      } else {
        setSpecialDaysEndDate(null);
      }
    }
  }, [
    editedValue?.recurringType,
    editedValue?.recurringEndDate,
    duplicateData?.recurringType,
    duplicateData?.recurringEndDate,
    isShowForm.edit,
    isShowForm.duplicate,
  ]);

  const levelsOptions = [
    {
      id: 1,
      label: "Unlimited",
      value: "unlimited",
      isLimited: false,
    },
    {
      id: 2,
      label: "Limited",
      value: "limited",
      isLimited: true,
    },
  ];

  const levelsSchema = Yup.object().shape({
    amount: Yup.string().required("Amount is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      amount: editedValue?.amount || duplicateData?.amount || "",
      title: editedValue?.title || duplicateData?.title || "",
      description: editedValue?.description || duplicateData?.description || "",
      level: editedValue?.quantity || duplicateData?.quantity || "",
      index: editedValue?.index || duplicateData?.index || 0,
      // Set isMostNeeded to true by default if no existing levels and this is a new level
      isMostNeeded:
        editedValue?.isMostNeeded ||
        duplicateData?.isMostNeeded ||
        (!isShowForm.edit &&
          !isShowForm.duplicate &&
          existingLevels.length === 0) ||
        false,
    },
    validationSchema: levelsSchema,
    onSubmit: (values) => {
      onAddLevel(
        values,
        levels,
        donationOption,
        specialDays,
        specialDaysEndDate,
      );
      // onCancel();
      // formik.resetForm();
    },
  });
  const handleLevelChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      formik.setFieldValue("level", value);
    } else {
      formik.setFieldValue("level", "");
    }
  };
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const isValidInput = /^\d*\.?\d*$/.test(value);

    if (!isValidInput) {
      formik.setFieldValue("amount", "");
      return;
    }

    const newAmount = parseFloat(value);
    formik.setFieldValue("amount", newAmount);

    // Only auto-mark if this is a new level (not editing or duplicating)
    if (!isShowForm.edit && !isShowForm.duplicate) {
      const targetAmount = 250;

      if (existingLevels.length === 0) {
        // First level is always most needed
        formik.setFieldValue("isMostNeeded", true);
      } else {
        // Get all amounts including the new one
        const allAmounts = [
          ...existingLevels.map((level) => level.amount),
          newAmount,
        ];

        // Find the closest amount to 250, preferring higher amounts when differences are equal
        let closestToTarget = allAmounts[0];
        let smallestDiff = Math.abs(targetAmount - closestToTarget);

        allAmounts.forEach((amount) => {
          const currentDiff = Math.abs(targetAmount - amount);
          if (
            currentDiff < smallestDiff ||
            (currentDiff === smallestDiff && amount > closestToTarget)
          ) {
            smallestDiff = currentDiff;
            closestToTarget = amount;
          }
        });

        // If this new amount is closest to 250, mark it as most needed
        formik.setFieldValue("isMostNeeded", newAmount === closestToTarget);
      }
    }
  };

  const cancelButtonHandler = () => {
    // Reset form values to initial state
    formik.resetForm({
      values: {
        amount: "",
        title: "",
        description: "",
        level: "",
        index: 0,
        isMostNeeded: existingLevels.length === 0,
      },
    });

    // Reset local state values
    setLevels("unlimited");
    setSpecialDays("monthly");
    setSpecialDaysEndDate(null);
    setDonationOption(donationDefaultValue);

    // Reset parent component states
    if (setEditedValue) setEditedValue(null);
    if (setDuplicateData) setDuplicateData(null);
    if (setShowAddButton) setShowAddButton(true);

    // Hide the add giving level flow
    setIsShowForm({ add: false, edit: false, duplicate: false });
  };

  const isFormEmpty =
    !formik.values.amount || !formik.values.title || !formik.values.description;
  const buttonData =
    isShowForm.edit || isShowForm.duplicate
      ? isLoader
        ? "Saving..."
        : "Save"
      : isLoader
        ? "Adding..."
        : "Add";
  const handleSpecialDaysClick = useCallback((value, endDate = null) => {
    setSpecialDays(value || "monthly");
    // Only set endDate if recurring type is monthly or everyFriday
    if (value === "monthly" || value === "everyFriday") {
      setSpecialDaysEndDate(endDate);
    } else {
      setSpecialDaysEndDate(null);
    }
  }, []);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <LevelWrapper>
          <SubHeading sx={{ mb: 1 }}>
            {" "}
            {isShowForm.edit
              ? "Edit giving levels"
              : isShowForm.duplicate
                ? "Duplicate giving levels"
                : "Add giving levels"}
          </SubHeading>
          {allowRecurringDonations ? (
            <BoxComponent
              sx={{
                mt: 2,
                mb: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "column" },
                alignItems: { xs: "flex-start", sm: "flex-start" },
                gap: { xs: 0, sm: 0 },
              }}
            >
              {DONATION_METHOD_OPTION.map((item) => (
                <RadioButtonGroups
                  key={item.id}
                  label=""
                  options={item}
                  value={donationOption}
                  onChange={setDonationOption}
                  specialDays={specialDays}
                  specialDaysEndDate={specialDaysEndDate}
                  handleSpecialDaysClick={handleSpecialDaysClick}
                  automaticDonationDays={automaticDonationDaysData}
                  // isEdit={isShowForm.edit || isShowForm.duplicate}
                />
              ))}
            </BoxComponent>
          ) : null}

          <TextFieldComp
            label={"Amount"}
            placeholder={"Amount"}
            type="number"
            fullWidth
            onWheel={(e) => e.target.blur()}
            name="amount"
            value={formik.values.amount}
            onChange={handleAmountChange}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            inputProps={{
              maxLength: 100,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {currencySymbol}
                </InputAdornment>
              ),
            }}
          />
          {levelsOptions.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "-4px",
                width: "100px",
              }}
            >
              <RadioButtonGroups
                label="Levels"
                options={item}
                value={levels}
                onChange={setLevels}
              />
            </div>
          ))}
          {levels === "limited" ? (
            <BoxComponent sx={{ mt: 1 }}>
              <TextFieldComp
                label={"Number of levels"}
                placeholder={"Enter the number of levels"}
                fullWidth={smallerThan300}
                type="number"
                onWheel={(e) => e.target.blur()}
                name="level"
                value={formik.values.level}
                onChange={handleLevelChange}
                onBlur={formik.handleBlur}
                error={formik.touched.level && Boolean(formik.errors.level)}
                helperText={formik.touched.level && formik.errors.level}
                sx={smallerThan300 ? {} : { width: "250px" }}
              />
            </BoxComponent>
          ) : null}
          <BoxComponent sx={{ mt: 2 }}>
            <TextFieldComp
              label={"Title"}
              placeholder={"Enter your title here"}
              fullWidth
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </BoxComponent>
          <TextFieldComp
            label={"Description"}
            placeholder={"Enter your description here"}
            fullWidth
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
          <BoxComponent sx={{ marginBottom: "15px", marginTop: "-10px" }}>
            <CheckBoxComp
              ml={-2}
              mt={0.3}
              specialIcon={true}
              customCheckbox={true}
              specialIconColor={"#6363e6"}
              label="Mark this as most needed giving level"
              checked={formik.values.isMostNeeded}
              onChange={(e) => {
                formik.setFieldValue("isMostNeeded", e.target.checked);
              }}
            />
          </BoxComponent>

          <StackComponent
            mb={2}
            justifyContent={{ xs: "space-between", sm: "flex-start" }}
            spacing={2}
          >
            <ButtonComp
              type="submit"
              // fullWidth={isSmallScreen ? true : false}
              disabled={isFormEmpty || isLoader}
              sx={{
                width: { xs: "100%", sm: "135px" },
                p: "12px 32px 12px 32px",
                fontSize: "16px",
                height: "40px",
              }}
            >
              {buttonData}
            </ButtonComp>
            {isShowForm.add ? (
              <ButtonComp
                variant="outlined"
                onClick={cancelButtonHandler}
                sx={{
                  width: "135px",
                  p: "12px 32px 12px 32px",
                  fontSize: "16px",
                  height: "40px",
                }}
              >
                Cancel
              </ButtonComp>
            ) : null}
          </StackComponent>
        </LevelWrapper>
      </form>
    </div>
  );
};

AddLevels.propTypes = {
  onAddLevel: PropTypes.func.isRequired,
  isLoader: PropTypes.bool.isRequired,
  editedValue: PropTypes.object,
  // notifyHandler: PropTypes.any,
  duplicateData: PropTypes.object,
  setIsShowForm: PropTypes.func,
  isShowForm: PropTypes.object,
  existingLevels: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
  automaticDonationDays: PropTypes.object, // New prop for automatic donation days data
  setShowAddButton: PropTypes.func, // New prop to control add button visibility
  setEditedValue: PropTypes.func, // New prop to reset edited value
  setDuplicateData: PropTypes.func, // New prop to reset duplicate data
};
export default AddLevels;
