"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { updateBankInfo } from "@/api";
import BankDetailLayout from "@/Layouts/BankDetailLayout";
import BankInformationForm from "./BankInformationForm";
import { bankInfoImagesHandler, bankInformationHandler, campaignStepperIncrementHandler } from "@/store/slices/campaignSlice";
import { useDispatch } from "react-redux";

const BankInformation = ({
  activeStep,
  setActiveStep,
  setCurrentIndex,
  countriesData,
  defaultFormState,
  createCampaign = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const uploadHandler = (
    values,
    selectedValue,
    accountClass,
    countryList,
    accountType,
    payoutMethod,
    imagesData
  ) => {
    setIsLoading(true);
    const payload = {
      countryId: countryList._id,
      currencyId: selectedValue._id,
      accountName: values.accountName,
      bankName: values.bankName,
      accountClass: accountClass.name.toLowerCase(),
      accountType: accountType.name.toLowerCase(),
      payoutMethod: payoutMethod.name.toLowerCase(),
      swiftCode: values.swift,
      ibanNumber: values.iban,
      routingNumber: values.routingNumber,
      sortCode: values.sortCode,
      accountNumber: values.accountNumber,
      instituteNumber: values.instituteNumber,
      transitNumber: values.transitNumber,
      bankDocuments:
        (imagesData &&
          imagesData.map((eachDoc) => ({
            url: eachDoc.url,
            name: eachDoc.name,
          }))) ||
        [],
    };
    if (createCampaign) {
      dispatch(bankInformationHandler(payload));
      dispatch(bankInfoImagesHandler(imagesData));
      dispatch(campaignStepperIncrementHandler(1));
    } else {
      updateBankInfo(payload)
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
            toast.error(result.message);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  };
  return (
    <BankDetailLayout
      isFullHeight={true}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      setCurrentIndex={setCurrentIndex}
      heading="Your Bank Information"
      createCampaign={createCampaign}
    >
      <BankInformationForm
        defaultFormState={defaultFormState}
        countriesData={countriesData}
        onUpload={uploadHandler}
        isLoading={isLoading}
        createCampaign={createCampaign}
      />
    </BankDetailLayout>
  );
};

BankInformation.propTypes = {
  activeStep: PropTypes.number,
  countriesData: PropTypes.array,
  defaultFormState: PropTypes.any,
  setActiveStep: PropTypes.func,
  setCurrentIndex: PropTypes.func,
};

export default BankInformation;
