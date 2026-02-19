"use client";

import React, { memo, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

import toast from "react-hot-toast";
import { updateUserAddress } from "@/api";
import BankDetailLayout from "@/Layouts/BankDetailLayout";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import DropDown from "@/components/atoms/inputFields/DropDown";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import PostalCodeField from "./PostalCodeField";
import {
  campaignStepperIncrementHandler,
  homeAddressHandler,
  homeCountryHandler,
} from "@/store/slices/campaignSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export const FieldWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
  gap: 20,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    marginBottom: "20px",
    gap: 5,
  },
}));
const HomeAddressFrom = memo(
  ({
    countriesData = [],
    setActiveStep,
    setCurrentIndex,
    activeStep,
    defaultFormState,
    createCampaign,
  }) => {
    const dispatch = useDispatch();
    const homeAddress = useSelector((state) => state?.campaign?.homeAddress);
    const homeCountry = useSelector((state) => state?.campaign?.homeCountry);

    // Add safety check for countriesData
    if (!countriesData || countriesData.length === 0) {
      return <div>Loading countries...</div>;
    }

    const defaultCountry = countriesData.find(
      (country) =>
        country._id ===
        (createCampaign
          ? homeCountry?._id
          : defaultFormState?.addressDetails?.countryId)
    );
    const [selectedValue, setSelectedValue] = useState(defaultCountry);
    const [isLoading, setIsLoading] = useState(false);
    const [zipError, setZipError] = useState(false);
    const [zipValue, setZipValue] = useState(
      createCampaign
        ? homeAddress?.zipCode || null
        : defaultFormState?.addressDetails?.zipCode || null
    );

    const userInformationSchema = Yup.object().shape({
      city: Yup.string().required("Required field"),
      address: Yup.string().required("Required field"),
      region: Yup.string().required("Required field"),
    });
    const formik = useFormik({
      initialValues: {
        city: createCampaign
          ? homeAddress?.city || ""
          : defaultFormState?.addressDetails?.city || "",
        address: createCampaign
          ? homeAddress?.address || ""
          : defaultFormState?.addressDetails?.address || "",
        region: createCampaign
          ? homeAddress?.state || ""
          : defaultFormState?.addressDetails?.state || "",
      },
      validationSchema: userInformationSchema,
      onSubmit: (values) => {
        setIsLoading(true);
        const payload = {
          countryId: selectedValue?._id,
          city: values.city,
          address: values.address,
          state: values.region,
          zipCode: zipValue,
        };

        if (createCampaign) {
          dispatch(homeAddressHandler(payload));
          dispatch(homeCountryHandler(selectedValue));
          dispatch(campaignStepperIncrementHandler(1));
        } else {
          updateUserAddress(payload)
            .then((res) => {
              const result = res?.data;
              if (result.success) {
                setIsLoading(false);
                toast.success(result.message);
                setActiveStep((prevActiveStep) => {
                  if (!createCampaign) {
                    setCurrentIndex(prevActiveStep);
                  }
                  if (createCampaign) {
                    dispatch(campaignStepperIncrementHandler(1));
                  }
                  return prevActiveStep + 1;
                });
              } else {
                setIsLoading(false);
              }
            })
            .catch((error) => {
              console.log(error);
              setIsLoading(false);
            });
        }
      },
    });

    const handleDropDownChange = (value) => {
      setSelectedValue(value);
    };

    const postalCodeHandler = (zip, hasError) => {
      setZipValue(zip);
      setZipError(hasError);
    };
    const isFormEmpty =
      !formik.values.city ||
      !formik.values.address ||
      !formik.values.region ||
      !zipValue ||
      zipError;
    return (
      <BankDetailLayout
        isFullHeight={true}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        setCurrentIndex={setCurrentIndex}
        heading="Your Home Address "
        createCampaign={createCampaign}
      >
        <form onSubmit={formik.handleSubmit}>
          <BoxComponent sx={{ mt: { xs: 3, sm: 5 } }}>
            <DropDown
              label="Country*"
              placeholder={"Select country"}
              data={countriesData}
              onChange={handleDropDownChange}
              selectedValue={selectedValue}
            />
            <FieldWrapper>
              <TextFieldComp
                isRequired
                id="city"
                name="city"
                label={"City/town"}
                autoComplete="city"
                placeholder={"Enter city address"}
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
                fullWidth
              />
              <TextFieldComp
                isRequired
                id="address"
                name="address"
                label={"Address"}
                autoComplete="address"
                placeholder={"Street and house number "}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                fullWidth
              />
            </FieldWrapper>
            <FieldWrapper>
              <TextFieldComp
                isRequired
                fullWidth
                id="region"
                name="region"
                autoComplete="region"
                label={"State/Province/Region "}
                placeholder={"Enter State/Province/Region here"}
                value={formik.values.region}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.region && Boolean(formik.errors.region)}
                helperText={formik.touched.region && formik.errors.region}
              />

              <PostalCodeField
                zipValue={zipValue}
                selectedValue={selectedValue}
                onClick={postalCodeHandler}
              />
            </FieldWrapper>
          </BoxComponent>
          <SubmitButton isContinueButtonDisabled={isFormEmpty || isLoading}>
            {isLoading ? "Loading..." : "Continue"}
          </SubmitButton>
        </form>
      </BankDetailLayout>
    );
  }
);

HomeAddressFrom.displayName = "HomeAddressFrom";
HomeAddressFrom.propTypes = {
  activeStep: PropTypes.number,
  countriesData: PropTypes.array,
  defaultFormState: PropTypes.any,
  setActiveStep: PropTypes.func,
  setCurrentIndex: PropTypes.func,
};

export default HomeAddressFrom;
