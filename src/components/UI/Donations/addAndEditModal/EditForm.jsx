"use client";

import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import GridComp from "@/components/atoms/GridComp/GridComp";
import DropDown from "@/components/atoms/inputFields/DropDown";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import PhoneInputField from "@/components/atoms/inputFields/PhoneInputField";
import TextFieldWithCurrencyList from "./currencyTextField/TextFieldWithCurrencyList";

const EditForm = memo(
  ({
    formik,
    amountHandler,
    campaignData,
    currenciesData,
    phoneHandler,
    campaignHandler,
    countryHandler,
    isEdit,
    donorData,
    country,
  }) => {
    const allCountries = useSelector((state) => state.meta.countries);
    const countryList = allCountries.map((item) =>
      item?.isoAlpha2.toLowerCase(),
    );

    const [phone, setPhone] = useState();
    const [dropdown, setDropdown] = useState(false);
    const [selectedReward, setSelectedReward] = useState();
    const [selectedCountry, setSelectedCountry] = useState(
      donorData.countryId ? country : null,
    );

    useEffect(() => {
      if (isEdit && !dropdown) {
        setSelectedCountry(donorData.countryId ? country : null);
      } else if (!isEdit && !dropdown) {
        setSelectedCountry(null);
      }
    }, [country]);

    const names = isEdit === true && donorData.donorName?.split(" ");
    const firstName = isEdit === true && names[0];
    const lastName =
      isEdit === true && names.length > 1 ? names.slice(1).join(" ") : "";

    const handleCampaignHandler = (value) => {
      campaignHandler(value);
      setSelectedReward(value);
      formik.setFieldValue("campaign", value ? value._id : ""); // Update Formik's campaign field
      formik.setTouched({ ...formik.touched, campaign: true });
    };

    const handleCountryDropDown = (value) => {
      setDropdown(true);
      countryHandler(value);
      setSelectedCountry(value);
    };

    const phoneNumberHandler = (e) => {
      phoneHandler(e);
      setPhone(e);
    };

    return (
      <GridComp container rowSpacing={0} columnSpacing={2} sx={{ mt: 1 }}>
        <GridComp item xs={12} sm={4}>
          {isEdit ? (
            <>
              <TextFieldComp
                fullWidth
                id="amount"
                name="amount"
                label="Amount*"
                labelColor={isEdit ? "#E9E9EB" : "#A1A1A8"}
                sx={{ opacity: isEdit ? 0.3 : 1 }}
                autoComplete="amount"
                disabled={isEdit ? true : false}
                placeholder={"Enter amount"}
                value={
                  isEdit
                    ? donorData.amount + " " + donorData.currencyCode
                    : formik.values.lastName
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </>
          ) : (
            <TextFieldWithCurrencyList
              data={currenciesData}
              amountHandler={(value) => amountHandler(value)}
              disabled={isEdit ? true : false}
            />
          )}
        </GridComp>

        <GridComp item xs={12} sm={4}>
          <PhoneInputField
            label="Phone number"
            value={phone}
            disabled={isEdit ? true : false}
            onInputChange={phoneNumberHandler}
            countriesData={countryList}
            styleOverrides={{ opacity: isEdit ? 0.3 : 1 }}
            labelColor={isEdit ? "#E9E9EB" : "#A1A1A8"}

            // previousPhoneNumber={profileData?.phoneNumber}
          />
        </GridComp>
        <GridComp item xs={12} sm={4}>
          <TextFieldComp
            height={"40px"}
            fullWidth
            labelColor={isEdit ? "#E9E9EB" : "#A1A1A8"}
            sx={{ opacity: isEdit ? 0.3 : 1 }}
            id="email"
            disabled={isEdit ? true : false}
            name="email"
            label={"Email*"}
            autoComplete="email"
            placeholder={"Enter email address"}
            value={isEdit ? donorData.donorEmail : formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </GridComp>

        <GridComp item xs={12} sm={4}>
          <TextFieldComp
            fullWidth
            id="firstName"
            name="firstName"
            labelColor={isEdit ? "#E9E9EB" : "#A1A1A8"}
            sx={{ opacity: isEdit ? 0.3 : 1 }}
            autoComplete="first-name"
            label={"First name*"}
            disabled={isEdit ? true : false}
            placeholder={"Enter first name"}
            value={isEdit ? firstName : formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </GridComp>
        <GridComp item xs={12} sm={4}>
          <TextFieldComp
            fullWidth
            id="lastName"
            name="lastName"
            label="Last name*"
            labelColor={isEdit ? "#E9E9EB" : "#A1A1A8"}
            sx={{ opacity: isEdit ? 0.3 : 1 }}
            autoComplete="last-name"
            disabled={isEdit ? true : false}
            placeholder={"Enter last name"}
            value={isEdit ? lastName : formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </GridComp>

        <GridComp item xs={12} sm={4}>
          {isEdit ? (
            <>
              <TextFieldComp
                fullWidth
                id="campaignTitle"
                name="campaignTitle"
                label="Campaign Title"
                labelColor={isEdit ? "#E9E9EB" : "#A1A1A8"}
                sx={{ opacity: isEdit ? 0.3 : 1 }}
                autoComplete="campaignTitle"
                disabled={isEdit ? true : false}
                placeholder={"Campaign Title"}
                value={
                  isEdit ? donorData.campaignTitle : formik.values.lastName
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </>
          ) : (
            <DropDown
              height={"40px"}
              label="Campaign*"
              isDisabledText={isEdit ? true : false}
              placeholder={""}
              disabled={isEdit ? true : false}
              onChange={handleCampaignHandler}
              selectedValue={selectedReward}
              data={campaignData}
              showError={
                formik.touched.campaign && Boolean(formik.errors.campaign)
              } // Updated showError
            />
          )}
        </GridComp>

        <GridComp item xs={12} sm={4}>
          <DropDown
            label="Country"
            isLabel={true}
            placeholder={"Select country"}
            data={allCountries}
            onChange={handleCountryDropDown}
            selectedValue={selectedCountry}
          />
        </GridComp>
        <GridComp item xs={12} sm={4}>
          <TextFieldComp
            fullWidth
            id="street"
            name="street"
            label="Street"
            placeholder={"Enter street"}
            value={formik.values.street}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.street && Boolean(formik.errors.street)}
            helperText={formik.touched.street && formik.errors.street}
          />
        </GridComp>
        <GridComp item xs={12} sm={4}>
          <TextFieldComp
            fullWidth
            id="streetLine2"
            name="streetLine2"
            label="Street Line 2"
            autoComplete="last-name"
            placeholder={"Enter street line"}
            value={formik.values.streetLine2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.streetLine2 && Boolean(formik.errors.streetLine2)
            }
            helperText={formik.touched.streetLine2 && formik.errors.streetLine2}
          />
        </GridComp>
        <GridComp item xs={12} sm={4}>
          <TextFieldComp
            fullWidth
            id="city"
            name="city"
            label="City"
            autoComplete="last-name"
            placeholder={"Enter city name"}
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
          />
        </GridComp>
        <GridComp item xs={12} sm={4}>
          <TextFieldComp
            fullWidth
            id="state"
            name="state"
            label="State"
            placeholder={"Enter state"}
            value={formik.values.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.state && Boolean(formik.errors.state)}
            helperText={formik.touched.state && formik.errors.state}
          />
        </GridComp>
        <GridComp item xs={12} sm={4}>
          <TextFieldComp
            fullWidth
            id="zipCode"
            name="zipCode"
            label="ZIP Code"
            placeholder={"Enter ZIP Code"}
            value={formik.values.zipCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
            helperText={formik.touched.zipCode && formik.errors.zipCode}
          />
        </GridComp>
      </GridComp>
    );
  },
);

EditForm.propTypes = {
  formik: PropTypes.any,
  amountHandler: PropTypes.func,
  campaignData: PropTypes.any,
  currenciesData: PropTypes.any,
  phoneHandler: PropTypes.func,
  campaignHandler: PropTypes.func,
  countryHandler: PropTypes.func,
  isEdit: PropTypes.bool,
  donorData: PropTypes.any,
};
EditForm.displayName = "EditForm";
export default EditForm;
