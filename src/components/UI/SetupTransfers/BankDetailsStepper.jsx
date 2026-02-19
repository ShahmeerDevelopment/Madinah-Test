"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCountriesList, useGetProfile } from "@/api";
import { addUserDetails } from "@/store/slices/authSlice";
import StepperComp from "@/components/molecules/StepperComp/StepperComp";
import { BANK_STEPPER } from "@/config/constant";
import BankDetailLayout from "@/Layouts/BankDetailLayout";
import PersonalInformation from "./PersonalInformation";
import BankInformation from "./bankInformation/BankInformation";
import TermsForm from "./TermsForm";
import HomeAddressFrom from "./homeAddressForm/HomeAddressFrom";
import { updateAuthValues } from "@/store/slices/mutateAuthSlice";
import { getAllVisits } from "@/api/get-api-services";

const SetupTransfersUI = () => {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const utmParameters = useSelector((state) => state.utmParameters);
  const { data: userProfile, isLoading: profileLoading } =
    useGetProfile(activeStep);
  const {
    data: countriesListResponse,
    isLoading,
    isError,
    error,
  } = useGetCountriesList();

  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral,
    );
  }, []);

  const profileData = useSelector((state) => state.auth.userDetails);

  if (isError) return <p>Error: {error.message}</p>;

  const countriesData = countriesListResponse?.data?.data.countries;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const profileDetails = userProfile?.data?.data;
    if (profileDetails) {
      dispatch(addUserDetails(profileDetails));
      dispatch(updateAuthValues(profileDetails));
    }
  }, [userProfile]);

  return (
    <StepperComp
      activeStep={activeStep}
      currentIndex={currentIndex}
      STEPPER_DATA={BANK_STEPPER}
      isCardResponsive={true}
      isDragAble={true}
    >
      {activeStep === 0 ? (
        <BankDetailLayout
          isFullHeight={true}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          setCurrentIndex={setCurrentIndex}
        >
          {isLoading || profileLoading ? (
            <p>Loading...</p>
          ) : (
            <PersonalInformation
              countriesData={countriesData}
              profileData={profileData}
              setActiveStep={setActiveStep}
              setCurrentIndex={setCurrentIndex}
              activeStep={activeStep}
            />
          )}
        </BankDetailLayout>
      ) : activeStep === 1 ? (
        <HomeAddressFrom
          defaultFormState={profileData}
          activeStep={activeStep}
          countriesData={countriesData}
          setActiveStep={setActiveStep}
          setCurrentIndex={setCurrentIndex}
        />
      ) : activeStep === 2 ? (
        <BankInformation
          defaultFormState={profileData}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          setCurrentIndex={setCurrentIndex}
          countriesData={countriesData}
        />
      ) : activeStep === 3 ? (
        <TermsForm
          defaultFormState={profileData}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          setCurrentIndex={setCurrentIndex}
        />
      ) : null}
    </StepperComp>
  );
};

export default SetupTransfersUI;
