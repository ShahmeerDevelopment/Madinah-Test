"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AuthModelForm from "@/components/advance/AuthModelForm/AuthModelForm";
import {
  EmailField,
  FirstNameField,
  LastNameField,
  DonateAnon,
} from "./FormFields";
import GridComp from "@/components/atoms/GridComp/GridComp";
import PhoneInputField from "@/components/atoms/inputFields/PhoneInputField";
import { useGetCountriesList } from "@/api";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";
import { useSelector } from "react-redux";
import {
  provideNameAndEmailHandler,
  provideNumberHandler,
} from "@/store/slices/donationSlice";
import { useDispatch } from "react-redux";
import { isUserFromEuropeOrUK } from "@/utils/helpers";

const PersonalInfoDonationForm = ({
  formik,
}) => {
  const dispatch = useDispatch();
  const [isBillingName] = useState(false);

  const currentProvideNameAndEmail = useSelector((state) => state?.donation?.provideNameAndEmail);
  const currentProvideNumber = useSelector((state) => state?.donation?.provideNumber);

  const isEuropeanUser = isUserFromEuropeOrUK();
  const defaultEmailUpdates = !isEuropeanUser;
  const defaultSMSUpdates = !isEuropeanUser;

  const [provideNameAndEmail, setProvideNameAndEmail] = useState(defaultEmailUpdates);
  const [provideNumber, setProvideNumber] = useState(defaultSMSUpdates);

  useEffect(() => {
    if (isEuropeanUser) {
      dispatch(provideNameAndEmailHandler(false));
      dispatch(provideNumberHandler(false));
      setProvideNameAndEmail(false);
      setProvideNumber(false);
    } else {
      if (currentProvideNameAndEmail === undefined || currentProvideNameAndEmail === null) {
        dispatch(provideNameAndEmailHandler(true));
        setProvideNameAndEmail(true);
      } else {
        setProvideNameAndEmail(currentProvideNameAndEmail);
      }

      if (currentProvideNumber === undefined || currentProvideNumber === null) {
        dispatch(provideNumberHandler(true));
        setProvideNumber(true);
      } else {
        setProvideNumber(currentProvideNumber);
      }
    }
  }, []);

  useEffect(() => {
    if (currentProvideNameAndEmail !== undefined && currentProvideNameAndEmail !== null) {
      setProvideNameAndEmail(currentProvideNameAndEmail);
    }
  }, [currentProvideNameAndEmail]);

  useEffect(() => {
    if (currentProvideNumber !== undefined && currentProvideNumber !== null) {
      setProvideNumber(currentProvideNumber);
    }
  }, [currentProvideNumber]);

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
      <AuthModelForm dense mt="25px" formAction={formik.handleSubmit}>
        <GridComp
          container
          sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <GridComp item xs={12} sm={12}>
            <FirstNameField formik={formik} />
          </GridComp>
          <GridComp item xs={12} sm={12}>
            <LastNameField formik={formik} />
          </GridComp>
          <GridComp item xs={12} sm={12}>
            <EmailField formik={formik} />
          </GridComp>
          <GridComp item xs={12} sm={12}>
            <PhoneInputField
              // label="Phone Number"
              value={formik.values.phone}
              onInputChange={handlePhoneChange}
              countriesData={countryList}
              borderRadius="10px"
              height="52px"
            />
          </GridComp>
          <GridComp item xs={12} sm={12}>
            <DonateAnon formik={formik} />
            <CheckBoxComp
              ml={-2}
              mt={0.3}
              sx={{ marginTop: "-2px" }}
              specialIcon={true}
              customCheckbox={true}
              specialIconColor={"#0CAB72"}
              label="Receive email updates"
              checked={provideNameAndEmail}
              onChange={(e) => {
                setProvideNameAndEmail(e.target.checked);
                dispatch(provideNameAndEmailHandler(e.target.checked));
              }}
            />
            <CheckBoxComp
              ml={-2}
              mt={0.3}
              sx={{ marginTop: "-2px" }}
              specialIcon={true}
              customCheckbox={true}
              specialIconColor={"#0CAB72"}
              label="Receive SMS updates"
              checked={provideNumber}
              onChange={(e) => {
                setProvideNumber(e.target.checked);
                dispatch(provideNumberHandler(e.target.checked));
              }}
            />
          </GridComp>
        </GridComp>
      </AuthModelForm>
    </>
  );
};
PersonalInfoDonationForm.propTypes = {
  isStoredCardSelected: PropTypes.bool,
  onClick: PropTypes.func,
  isLogin: PropTypes.any,
  isLoader: PropTypes.bool,
  disabledButton: PropTypes.bool,
  isSaveCard: PropTypes.bool,
};

const MemoizedPersonalInfoDonationForm = React.memo(PersonalInfoDonationForm);

export default MemoizedPersonalInfoDonationForm;
