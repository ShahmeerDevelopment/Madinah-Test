"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { AppleDonationSchema } from "./FormFields/validation";
import AuthModelForm from "@/components/advance/AuthModelForm/AuthModelForm";
import { CVVField, CardNumberField, ExpiryDateField } from "./FormFields";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import GridComp from "@/components/atoms/GridComp/GridComp";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { useDispatch } from "react-redux";
import {
  saveCardHandler,
  updateDonationEmail,
} from "@/store/slices/donationSlice";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";

const DonationCardInfoForm = ({
  isStoredCardSelected,
  onClick,
  isLogin,
  isLoader,
  disabledButton = false,
  cardType,
  formik,
  fieldsDisabled = false,
  isSaveCard,
}) => {
  const [isBillingName] = useState(false);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();

  const cardEmail = useSelector(
    (state) => state.donation?.cardHolderName?.email
  );

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

  const allFieldsFilledApple = useMemo(() => {
    const values = appleFormik.values;
    const requiredFields = ["email"];
    return requiredFields.every((field) => values[field].trim() !== "");
  }, [appleFormik.values]);

  const checkHandler = useCallback((e) => {
    setIsChecked(e.target.checked);
    dispatch(saveCardHandler(e.target.checked));
  }, []);

  return (
    <>
      {cardType === 2 ? (
        <AuthModelForm dense mt="25px" formAction={formik.handleSubmit}>
          <GridComp
            container
            sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <GridComp item xs={12} sm={12}>
              <CardNumberField
                formik={formik}
                isStoredCardSelected={isStoredCardSelected}
                fieldsDisabled={fieldsDisabled}
                newDonation
              />
            </GridComp>
            <GridComp container spacing={2}>
              <GridComp item xs={6}>
                <ExpiryDateField
                  formik={formik}
                  isStoredCardSelected={isStoredCardSelected}
                  newDonation
                />
              </GridComp>
              <GridComp item xs={6}>
                <CVVField
                  formik={formik}
                  isStoredCardSelected={isStoredCardSelected}
                  newDonation
                />
              </GridComp>
            </GridComp>
            {isLogin && !isSaveCard ? (
              <GridComp item xs={12} sm={12}>
                <CheckBoxComp
                  ml={-2}
                  mt={"2px"}
                  specialIcon={true}
                  customCheckbox={true}
                  specialIconColor={"#0CAB72"}
                  label="Save card for future donations"
                  checked={isChecked}
                  onChange={(e) => checkHandler(e)}
                />
              </GridComp>
            ) : null}
          </GridComp>
        </AuthModelForm>
      ) : null}
      {cardType === 0 ? (
        <AuthModelForm dense mt="25px" formAction={appleFormik.handleSubmit}>
          <GridComp container columnSpacing={{ xs: 1, sm: 1 }}>
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
DonationCardInfoForm.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  onClick: PropTypes.func,
  isLogin: PropTypes.any,
  isLoader: PropTypes.bool,
  disabledButton: PropTypes.bool,
  isSaveCard: PropTypes.bool,
};

const MemoizedDonationCardInfoForm = React.memo(DonationCardInfoForm);

export default MemoizedDonationCardInfoForm;
