"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { AppleDonationSchema, SignUpSchema } from "./FormFields/validation";
import AuthModelForm from "@/components/advance/AuthModelForm/AuthModelForm";
import {
  CVVField,
  CardNumberField,
  EmailField,
  ExpiryDateField,
  FirstNameField,
  LastNameField,
  NameOnCardField,
  SaveCardDataCheckbox,
} from "./FormFields";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import GridComp from "@/components/atoms/GridComp/GridComp";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { useDispatch } from "react-redux";
import {
  isBillingNameHandler,
  updateDonationEmail,
} from "@/store/slices/donationSlice";
import PhoneInputField from "@/components/atoms/inputFields/PhoneInputField";
import { useGetCountriesList } from "@/api";

const CardPaymentForm = ({
  isStoredCardSelected,
  onClick,
  isLogin,
  isLoader,
  disabledButton = false,
  isSaveCard,
  cardType,
}) => {
  const isBillingNameRedux = useSelector(
    (state) => state?.donation?.isBillingName
  );
  const [isBillingName, setIsBillingName] = useState(
    isBillingNameRedux || false
  );
  const userDetails = useSelector((state) => state.auth.userDetails);
  const dispatch = useDispatch();

  const cardNumberRedux = useSelector(
    (state) => state.donation?.creditCardDetails?.number
  );
  const expiryDateRexux = useSelector(
    (state) => state.donation?.creditCardDetails?.expiryDate
  );
  const cvv = useSelector((state) => state.donation?.creditCardDetails?.cvv);

  const nameOnCard = useSelector(
    (state) => state.donation?.creditCardDetails?.nameOnCard
  );
  const cardFirstName = useSelector(
    (state) => state.donation?.cardHolderName?.firstName
  );
  const cardLastName = useSelector(
    (state) => state.donation?.cardHolderName?.lastName
  );
  const cardEmail = useSelector(
    (state) => state.donation?.cardHolderName?.email
  );

  const cardPhone = useSelector(
    (state) => state.donation?.cardHolderName?.phoneNumber
  );

  const formik = useFormik({
    initialValues: {
      firstName: isLogin ? userDetails.firstName || "" : cardFirstName || "",
      lastName: isLogin ? userDetails.lastName || "" : cardLastName || "",
      email: isLogin ? userDetails.email || "" : cardEmail || "",
      phone: isLogin ? userDetails.phoneNumber : cardPhone,
      cardNumber: cardNumberRedux || "",
      expiryDate: expiryDateRexux || "",
      cvv: cvv || "",
      nameOnCard: nameOnCard || "",
    },
    validationSchema: SignUpSchema,
    onSubmit: (values) => {
      onClick(values);
    },
  });

  const appleFormik = useFormik({
    initialValues: {
      email: isLogin ? userDetails.email || "" : cardEmail || "",
    },
    validationSchema: AppleDonationSchema,
    onSubmit: (values) => {
      dispatch(updateDonationEmail(values.email));
      onClick(values);
    },
  });

  useEffect(() => {
    if (isBillingName && formik.values.firstName && formik.values.lastName) {
      const fullName = `${formik.values.firstName} ${formik.values.lastName}`;
      formik.setFieldValue("nameOnCard", fullName);
    }
  }, [
    isBillingName,
    formik.values.firstName,
    formik.values.lastName,
    formik.setFieldValue,
  ]);

  const allFieldsFilled = useMemo(() => {
    const values = formik.values;
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "cardNumber",
      "expiryDate",
      "cvv",
      "nameOnCard",
    ];
    return requiredFields.every((field) => values[field].trim() !== "");
  }, [formik.values]);

  const allFieldsFilledApple = useMemo(() => {
    const values = appleFormik.values;
    const requiredFields = ["email"];
    return requiredFields.every((field) => values[field].trim() !== "");
  }, [appleFormik.values]);

  const { data: countriesListResponse } = useGetCountriesList();
  const countriesData = countriesListResponse?.data?.data.countries;

  const countryList = countriesData?.map((item) =>
    item?.isoAlpha2.toLowerCase()
  );

  const handlePhoneChange = (value) => {
    formik.setFieldValue("phone", value);
  };

  return (
    <>
      {cardType === 2 ? (
        <AuthModelForm dense mt="25px" formAction={formik.handleSubmit}>
          <GridComp container columnSpacing={{ xs: 1, sm: 2 }}>
            <GridComp item xs={12} sm={6}>
              <FirstNameField
                formik={formik}
                isStoredCardSelected={isStoredCardSelected}
              />
            </GridComp>
            <GridComp item xs={12} sm={6}>
              <LastNameField
                formik={formik}
                isStoredCardSelected={isStoredCardSelected}
              />
            </GridComp>
            <GridComp item xs={12} sm={6}>
              <EmailField
                formik={formik}
                isStoredCardSelected={isStoredCardSelected}
              />
            </GridComp>
            <GridComp item xs={12} sm={6}>
              <PhoneInputField
                label="Phone Number"
                value={formik.values.phone}
                onInputChange={handlePhoneChange}
                countriesData={countryList}
                // previousPhoneNumber={profileData?.phoneNumber}
              />
            </GridComp>
            <GridComp
              item
              xs={12}
              sm={12}
              sx={{
                mt: { xs: 0, sm: 0 },
                mb: { xs: 2, sm: 2.5 },
              }}
            >
              <CheckBoxComp
                ml={-2}
                mt={0.5}
                isStoredCardSelected={isStoredCardSelected}
                specialIcon={true}
                customCheckbox={true}
                specialIconColor={"#0CAB72"}
                label={"Use as billing name"}
                checked={isBillingName}
                onChange={(e) => {
                  setIsBillingName(e.target.checked);
                  dispatch(isBillingNameHandler(e.target.checked));
                }}
              />
            </GridComp>

            <GridComp item xs={12} sm={6}>
              <CardNumberField
                formik={formik}
                isStoredCardSelected={isStoredCardSelected}
              />
            </GridComp>
            <GridComp item xs={12} sm={6}>
              <NameOnCardField
                formik={formik}
                isStoredCardSelected={isStoredCardSelected}
              />
            </GridComp>
            <GridComp item xs={12} sm={6}>
              <ExpiryDateField
                formik={formik}
                isStoredCardSelected={isStoredCardSelected}
              />
            </GridComp>
            <GridComp item xs={12} sm={6}>
              <CVVField
                formik={formik}
                isStoredCardSelected={isStoredCardSelected}
              />
            </GridComp>

            {isLogin && !isSaveCard ? (
              <GridComp item xs={12} sm={12} mt={0}>
                <SaveCardDataCheckbox
                  isStoredCardSelected={isStoredCardSelected}
                />
              </GridComp>
            ) : null}
            {!isStoredCardSelected && (
              <BoxComponent
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <SubmitButton
                  size="large"
                  disabled={!allFieldsFilled || disabledButton}
                >
                  {isLoader ? "loading..." : "Continue"}
                </SubmitButton>
              </BoxComponent>
            )}
          </GridComp>
        </AuthModelForm>
      ) : null}
      {cardType === 0 ? (
        <AuthModelForm dense mt="25px" formAction={appleFormik.handleSubmit}>
          <GridComp container columnSpacing={{ xs: 1, sm: 2 }}>
            <GridComp item xs={12} sm={6}>
              <EmailField formik={appleFormik} />
            </GridComp>
            <BoxComponent
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <SubmitButton
                size="large"
                disabled={!allFieldsFilledApple || disabledButton}
              >
                {isLoader ? "loading..." : "Continue"}
              </SubmitButton>
            </BoxComponent>
          </GridComp>
        </AuthModelForm>
      ) : null}
    </>
  );
};
CardPaymentForm.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  onClick: PropTypes.func,
  isLogin: PropTypes.any,
  isLoader: PropTypes.bool,
  disabledButton: PropTypes.bool,
  isSaveCard: PropTypes.bool,
};

const MemoizedCardPaymentForm = React.memo(CardPaymentForm);

export default MemoizedCardPaymentForm;
