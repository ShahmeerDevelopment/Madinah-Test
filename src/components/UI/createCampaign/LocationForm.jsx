/* eslint-disable indent */
"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { postZipCodeValidation } from "@/api";

import {
  campaignStepperIncrementHandler,
  createCampaignHandler,
  isCreateCampaignHandler,
} from "@/store/slices/campaignSlice";

import { TAGS } from "@/config/constant";
import { WrapperLayout } from "./createCampaign.style";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import PopOver from "@/components/molecules/popOver/PopOver";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import DropDown from "@/components/atoms/inputFields/DropDown";
import MaskedInputComponent from "@/components/advance/MaskedInputComponent";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import SelectAbleButton from "@/components/atoms/selectAbleField/SelectAbleButton";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";

const LocationForm = ({ countriesData, categoriesList }) => {
  const dispatch = useDispatch();

  const { zipCode, categoryNumber, country } = useSelector(
    (state) => state.campaign.campaignValues,
  );

  const tagIndex = categoryNumber === 0 ? 0 : categoryNumber;

  const [selectedTag, setSelectedTag] = useState(tagIndex);
  const [isLoader, setIsLoader] = useState(false);
  const defaultCountry = countriesData?.find((el) => el.name === country);
  const [isZipCodeValid, setIsZipCodeValid] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultCountry || null);
  const [zipTouched, setZipTouched] = useState(false);
  const [zip, setZip] = useState(zipCode);
  const [errors, setErrors] = useState({});

  const addError = (key, val) => {
    let temp = { ...errors };
    temp[key] = val;
    setErrors(temp);
  };

  const removeError = (key) => {
    let temp = { ...errors };
    delete temp[key];
    setErrors(temp);
  };

  const postZipCodeValidationApi = (values) => {
    const selectedCategory = categoriesList?.[selectedTag];

    if (!selectedCategory || !selectedValue) {
      toast.error("Please select a category and country");
      setIsLoader(false);
      return;
    }

    // Check if the selected country's currency is active, if not use USD
    let currencyToUse = selectedValue?.currency?.code;
    if (!selectedValue?.currency?.isActive) {
      currencyToUse = "USD";
    }

    const payload = {
      zipCode: values.zipCode,
      country: selectedValue?.name,
      countryId: selectedValue?._id,
      categoryId: selectedCategory._id,
      category: TAGS[selectedTag]?.name,
      categoryNumber: selectedTag,
      currency: currencyToUse,
    };

    const zipCodePayload = {
      countryCode: selectedValue.isoAlpha2,
      zipCode: values.zipCode,
    };

    postZipCodeValidation(zipCodePayload)
      .then((res) => {
        const result = res?.data;
        if (result.success) {
          if (result.data.zipCodeValidity === true) {
            dispatch(isCreateCampaignHandler(true));
            dispatch(createCampaignHandler(payload));
            dispatch(campaignStepperIncrementHandler(1));
          } else {
            toast.error("Zip code is invalid! please add correct zip code");
            setIsZipCodeValid(true);
          }
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoader(false);
      });
  };

  const handleBoxClick = (index) => {
    setSelectedTag((prevSelected) => (prevSelected === index ? null : index));
  };

  const handleDropDownChange = (value) => {
    setSelectedValue(value);
    if (value === null) {
      setZip("");
    }
  };

  const isFormEmpty = errors.zipCode;

  const isNoButtonSelected = selectedTag === undefined || selectedTag === null;
  const isDropDownEmpty = selectedValue === null;
  const isCategoriesLoaded = categoriesList && categoriesList.length > 0;

  useEffect(() => {
    if (!zip || zip === "" || zip.includes("_")) {
      addError("zipCode", "Required Field");
    } else {
      removeError("zipCode");
    }

    if (
      selectedValue &&
      selectedValue?.name !== "United Kingdom" &&
      selectedValue.postalCodeValidator
    ) {
      const fixedPostalCodeValidator =
        selectedValue.postalCodeValidator.replace(/d/g, "\\d");

      const postalCodeRegex = new RegExp(fixedPostalCodeValidator);
      const isValidZip = postalCodeRegex.test(zip);
      // If the zip is not valid and not already in errors, add it to the errors object
      if (!isValidZip) {
        addError("zipCode", "Invalid ZIP/Postal Code format");
      }
      // If the zip is valid and is in errors, remove it from the errors object
      else if (isValidZip && errors["zipCode"]) {
        removeError("zipCode");
      }
    }
  }, [zip]);

  const handlePageSubmission = (e) => {
    e.preventDefault();
    setIsLoader(true);
    postZipCodeValidationApi({ zipCode: zip });
  };

  const isContinueButtonDisabled =
    isFormEmpty || isNoButtonSelected || isDropDownEmpty || !isCategoriesLoaded;

  return (
    <WrapperLayout isFullHeight={true}>
      <form onSubmit={handlePageSubmission}>
        <BoxComponent sx={{ mt: { xs: 3, sm: 5 } }}>
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: { xs: "space-between", sm: "flex-start" },
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <CampaignHeading>
              Let&apos;s begin your fundraising journey
            </CampaignHeading>
            <PopOver
              maxWidth={"250px"}
              popoverContent={
                "This will determine what currency you will receive funds in. Donors will see your country on your campaign page"
              }
            />
          </BoxComponent>
          <SubHeading>Where are you located?</SubHeading>
          <Paragraph>We use your location to determine your currency</Paragraph>

          <BoxComponent
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 0, sm: 2 },
              justifyContent: "space-between",
              alignItems: "center",
              my: 3,
            }}
          >
            <DropDown
              label="Country*"
              placeholder={"Select campaign country"}
              data={countriesData}
              onChange={handleDropDownChange}
              selectedValue={selectedValue}
            />
            {selectedValue ? (
              <>
                {selectedValue.name !== "United Kingdom" &&
                selectedValue.postalCodeValidator !== "" ? (
                  <MaskedInputComponent
                    mask={selectedValue.mask}
                    textFieldProps={{
                      error:
                        (zipTouched && Boolean(errors.zipCode)) ||
                        isZipCodeValid,
                      helperText:
                        (zipTouched && errors.zipCode) ||
                        (isZipCodeValid && "Zip/Postal code is invalid!"),
                    }}
                    label={
                      selectedValue?.name === "United States" ||
                      selectedValue?.name === "Philippines"
                        ? "Zip Code"
                        : "Postal Code"
                    }
                    placeholder={
                      selectedValue === null
                        ? "Enter Postal Code"
                        : selectedValue?.postalCodeFormat === ""
                          ? "123123"
                          : selectedValue?.postalCodeFormat
                    }
                    fullWidth
                    name="zipCode"
                    value={zip}
                    onInputChange={(e) => {
                      setZip(e);
                    }}
                    onBlur={() => {
                      setZipTouched(true);
                    }}
                  />
                ) : (
                  <TextFieldComp
                    isRequired={true}
                    label={
                      selectedValue?.name === "United States"
                        ? "Zip Code"
                        : "Postal Code"
                    }
                    placeholder={
                      selectedValue === null
                        ? "Enter Postal Code"
                        : selectedValue?.postalCodeFormat === ""
                          ? "123123"
                          : selectedValue?.postalCodeFormat
                    }
                    fullWidth
                    name="zipCode"
                    value={zip}
                    onChange={(e) => {
                      setZip(e.target.value);
                    }}
                    onBlur={() => {
                      setZipTouched(false);
                    }}
                    error={zipTouched && Boolean(errors.zipCode)}
                    helperText={zipTouched && errors.zipCode}
                  />
                )}
              </>
            ) : (
              <BoxComponent sx={{ width: "100%" }}>&nbsp;</BoxComponent>
            )}
          </BoxComponent>
          <SubHeading>
            What best describes why you&apos;re fundraising?
          </SubHeading>

          <Paragraph>
            Pick one category that best describes your campaign
          </Paragraph>
          <BoxComponent
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 3,
              mt: "16px",
            }}
          >
            {categoriesList?.map((item, index) => (
              <SelectAbleButton
                key={index}
                isActive={selectedTag === index}
                onClick={() => handleBoxClick(index)}
                title={item.name}
              />
            ))}
          </BoxComponent>
        </BoxComponent>
        <SubmitButton
          withSticky
          isContinueButtonDisabled={isContinueButtonDisabled || isLoader}
        >
          {isLoader ? "Verifying..." : "Continue"}
        </SubmitButton>
      </form>
    </WrapperLayout>
  );
};

LocationForm.propTypes = {
  countriesData: PropTypes.arrayOf(PropTypes.object).isRequired,
  categoriesList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LocationForm;
