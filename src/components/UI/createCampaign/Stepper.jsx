"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import LocationForm from "./LocationForm";
import { scrollToTop } from "@/utils/helpers";
import { getSingleCampaignData } from "@/api";
import { STEPPER_STEP } from "@/config/constant";

import {
  createCampaignHandler,
  resetActiveStepper,
  resetCampaignValues,
} from "@/store/slices/campaignSlice";

import RecipientForm from "./RecipientForm";
import PageTransitionWrapper from "@/components/atoms/PageTransitionWrapper";
import StartingGoalForm from "./StartingGoalForm";
import CharityFundraiser from "./charity/CharityFundraiser";
import { ASSET_PATHS } from "@/utils/assets";
const charityActiveStep = ASSET_PATHS.campaign.charityActiveStep;
import CampaignDescription from "./campaignDescription/CampaignDescription";
import CoverPhoto from "./coverPhoto/CoverPhoto";
import StepperComp from "@/components/molecules/StepperComp/StepperComp";
import {
  getAllVisits,
  useGetCategoriesList,
  useGetCountriesList,
} from "@/api/get-api-services";
import PersonalInformation from "../SetupTransfers/PersonalInformation";
import BankDetailLayout from "@/Layouts/BankDetailLayout";
import HomeAddressFrom from "../SetupTransfers/homeAddressForm/HomeAddressFrom";
import BankInformation from "../SetupTransfers/bankInformation/BankInformation";
import AddDocumentsUI from "../AddDocuments/AddDocumentsUI";
import TermsForm from "../SetupTransfers/TermsForm";
// import { WrapperLayout } from "./createCampaign.style";

const CreateCampaignStepper = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const utmParameters = useSelector((state) => state.utmParameters);

  const fundraisingFor = useSelector(
    (state) => state?.campaign?.campaignValues?.fundraisingFor,
  );
  const draftId = useSelector(
    (state) => state?.campaign?.campaignValues?.draftId,
  );

  const {
    data: countriesListResponse,
    // isLoading,
    // isError,
    // error,
  } = useGetCountriesList();

  const {
    data: categoriesListResponse,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
    // error: categoriesError,
  } = useGetCategoriesList();

  const activeSteps = useSelector((state) => state?.campaign?.activeStep);
  const currentIndex = useSelector((state) => state?.campaign?.currentIndex);

  const countriesData = countriesListResponse?.data?.data.countries;
  const categoriesData = categoriesListResponse?.data?.data.categories;
  const [charitySelected, setCharitySelected] = useState(
    fundraisingFor === "charity-organization" ? true : false,
  );
  const [activeStep, setActiveStep] = useState(0);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const profileData = useSelector((state) => state.auth.userDetails);

  // Memoized selectors to prevent unnecessary re-renders
  const bankInfoFromState = useSelector(
    (state) => state.auth.userDetails?.bankInfo,
  );
  const bankInfo = useMemo(() => bankInfoFromState || {}, [bankInfoFromState]);

  const verificationDocumentsFromState = useSelector(
    (state) => state.auth.userDetails?.verificationDocuments,
  );
  const verificationDocuments = useMemo(
    () => verificationDocumentsFromState || [],
    [verificationDocumentsFromState],
  );

  const needsDocumentVerification = React.useCallback(() => {
    // If no documents exist, verification is needed
    if (!verificationDocuments || verificationDocuments.length === 0) {
      return true;
    }
    // If all documents are either pending or approved, no verification needed
    const allDocsValid = verificationDocuments.every(
      (doc) => doc.status === "pending" || doc.status === "approved",
    );
    return !allDocsValid;
  }, [verificationDocuments]);

  const [dynamicStepperSteps, setDynamicStepperSteps] = useState([
    ...STEPPER_STEP,
  ]);

  const [previousStep, setPreviousStep] = useState(null);
  const [singleCampaignDetails, setSingleCampaignDetails] = useState(null);

  // Get query parameters from URL
  const campaignId = searchParams.get("id");
  const option = searchParams.get("option");

  useEffect(() => {
    // Reset campaign values and state immediately when campaignId changes
    dispatch(resetCampaignValues());
    setSingleCampaignDetails(null);
    
    if (campaignId) {
      const fetchCampaign = async () => {
        const { data: singleCampaign } = await getSingleCampaignData(
          campaignId,
          null,
          "update",
        );
        if (
          singleCampaign &&
          singleCampaign.data &&
          singleCampaign.data.campaignDetails
        ) {
          setSingleCampaignDetails(singleCampaign.data.campaignDetails);
        }
      };
      fetchCampaign();
    }
    
    // Cleanup function to reset campaign values when component unmounts
    return () => {
      dispatch(resetCampaignValues());
    };
  }, [campaignId, dispatch]);

  useEffect(() => {
    setPreviousStep(activeSteps - 1);
  }, [activeSteps]);

  useEffect(() => {
    if (draftId || campaignId) {
      if (singleCampaignDetails) {
        if (singleCampaignDetails?.fundraiser === "charity-organization") {
          setCharitySelected(true);
          dispatch(resetActiveStepper(4));
        } else {
          dispatch(resetActiveStepper(3));
        }
      }
    } else {
      dispatch(resetActiveStepper(0));
    }
    if (campaignId && singleCampaignDetails) {
      if (categoriesData && categoriesData.length) {
        const categoryId = singleCampaignDetails?.categoryId?._id;
        const index = categoriesData?.findIndex(
          (category) => category._id === categoryId,
        );
        const payload = {
          status: singleCampaignDetails?.status,
          draftId: singleCampaignDetails?._id,
          title: singleCampaignDetails?.title,
          story: singleCampaignDetails?.story,
          startingGoal: singleCampaignDetails?.targetAmount,
          currency: singleCampaignDetails?.amountCurrency,
          imageUrl: singleCampaignDetails?.coverImageUrl,
          country: singleCampaignDetails?.countryId?.name,
          zipCode: singleCampaignDetails?.zipCode,
          fundraisingFor: singleCampaignDetails?.fundraiser,
          categoryId: singleCampaignDetails?.categoryId?._id,
          categoryNumber: index,
          selectedBox: getFundraising(),
          countryId: singleCampaignDetails?.countryId?._id,
          isOneTimeDonation: singleCampaignDetails?.isOneTimeDonation,
          isRecurringDonation: singleCampaignDetails?.isRecurringDonation,
          isZakatEligible: singleCampaignDetails?.isZakatEligible,
          charityOrganizationId: singleCampaignDetails?.charityOrganizationId,
        };

        dispatch(createCampaignHandler(payload));
      }
    }
  }, [singleCampaignDetails, categoriesData, campaignId, draftId, dispatch]);

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

  const getFundraising = () => {
    if (campaignId) {
      if (singleCampaignDetails?.fundraiser === "myself") {
        return 0;
      }
      if (singleCampaignDetails?.fundraiser === "someone-else") {
        return 1;
      }
      if (!singleCampaignDetails?.fundraiser) {
        return undefined;
      }
      return 2;
    }
  };

  useEffect(() => {
    let updatedSteps = [...STEPPER_STEP];
    const hasBankInfo = bankInfo?.bankDocuments?.length > 0;
    const needsDocs = needsDocumentVerification();

    // First handle charity step if needed
    if (charitySelected) {
      updatedSteps.splice(2, 0, {
        id: 3,
        heading: "STEP 3",
        title: "Select Charities",
        icon: charityActiveStep,
        activeIcon: charityActiveStep,
      });
    }

    // Now handle conditional steps based on user state
    if (hasBankInfo) {
      const stepsToRemove = [
        "Personal Information",
        "Home Address",
        "Bank Information",
      ];

      // If we have valid documents (pending/approved), also remove the documents step
      if (!needsDocs) {
        stepsToRemove.push("Documents Verification");
      }

      // Filter out all steps that should be removed
      updatedSteps = updatedSteps.filter(
        (step) => !stepsToRemove.includes(step.title),
      );
    }

    // Reindex steps
    updatedSteps.forEach((step, index) => {
      step.id = index + 1;
      step.heading = `STEP ${index + 1}`;
    });

    setDynamicStepperSteps(updatedSteps);
  }, [
    charitySelected,
    bankInfo,
    verificationDocuments,
    needsDocumentVerification,
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      scrollToTop();
    }
  }, []);

  return (
    // <StackComponent
    //   direction="column"
    //   alignItems="center"
    //   sx={{
    //     width: "100%",
    //   }}
    // >
    <StepperComp
      activeStep={activeSteps}
      currentIndex={currentIndex}
      STEPPER_DATA={dynamicStepperSteps}
      isCardResponsive={true}
      isDragAble={true}
      previousStep={previousStep}
    >
      {activeSteps === 0 ? (
        <PageTransitionWrapper uniqueKey={activeSteps}>
          <LocationForm
            countriesData={countriesData}
            categoriesList={categoriesData}
          />
        </PageTransitionWrapper>
      ) : activeSteps === 1 ? (
        <PageTransitionWrapper uniqueKey={activeSteps}>
          <RecipientForm
            defaultOption={option}
            setCharitySelected={setCharitySelected}
          />
        </PageTransitionWrapper>
      ) : activeSteps === 2 ? (
        charitySelected ? (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            <CharityFundraiser />
          </PageTransitionWrapper>
        ) : (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            <StartingGoalForm />
          </PageTransitionWrapper>
        )
      ) : activeSteps === 3 ? (
        charitySelected ? (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            <StartingGoalForm />
          </PageTransitionWrapper>
        ) : (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            <CampaignDescription />
          </PageTransitionWrapper>
        )
      ) : activeSteps === 4 ? (
        charitySelected ? (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            <CampaignDescription />
          </PageTransitionWrapper>
        ) : (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            <CoverPhoto />
          </PageTransitionWrapper>
        )
      ) : activeSteps === 5 ? (
        charitySelected ? (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            <CoverPhoto />
          </PageTransitionWrapper>
        ) : (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            {bankInfo?.bankDocuments?.length < 1 ? (
              <BankDetailLayout
                isFullHeight={true}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                createCampaign
              >
                <PersonalInformation
                  countriesData={countriesData}
                  profileData={profileData}
                  setActiveStep={setActiveStep}
                  activeStep={activeStep}
                  createCampaign
                />
              </BankDetailLayout>
            ) : needsDocumentVerification() ? (
              <AddDocumentsUI createCampaign />
            ) : (
              <TermsForm
                defaultFormState={profileData}
                countriesData={countriesData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                createCampaignPage
              />
            )}
          </PageTransitionWrapper>
        )
      ) : activeSteps === 6 ? (
        charitySelected ? (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            {bankInfo?.bankDocuments?.length < 1 ? (
              <BankDetailLayout
                isFullHeight={true}
                activeStep={activeStep}
                createCampaign
              >
                <PersonalInformation
                  countriesData={countriesData}
                  profileData={profileData}
                  setActiveStep={setActiveStep}
                  activeStep={activeStep}
                  createCampaign
                />
              </BankDetailLayout>
            ) : needsDocumentVerification() ? (
              <AddDocumentsUI createCampaign />
            ) : (
              <TermsForm
                defaultFormState={profileData}
                countriesData={countriesData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                createCampaignPage
              />
            )}
          </PageTransitionWrapper>
        ) : (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            {bankInfo?.bankDocuments?.length < 1 ? (
              <HomeAddressFrom
                defaultFormState={profileData}
                activeStep={activeStep}
                countriesData={countriesData}
                setActiveStep={setActiveStep}
                createCampaign
              />
            ) : (
              <TermsForm
                defaultFormState={profileData}
                countriesData={countriesData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                createCampaignPage
              />
            )}
          </PageTransitionWrapper>
        )
      ) : activeSteps === 7 ? (
        charitySelected ? (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            <HomeAddressFrom
              defaultFormState={profileData}
              activeStep={activeStep}
              countriesData={countriesData}
              setActiveStep={setActiveStep}
              createCampaign
              // setCurrentIndex={setCurrentIndex}
            />
          </PageTransitionWrapper>
        ) : (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            {bankInfo?.bankDocuments?.length < 1 ? (
              <BankInformation
                defaultFormState={profileData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                countriesData={countriesData}
                createCampaign
              />
            ) : (
              <TermsForm
                defaultFormState={profileData}
                countriesData={countriesData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                createCampaignPage
              />
            )}
          </PageTransitionWrapper>
        )
      ) : activeSteps === 8 ? (
        charitySelected ? (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            {bankInfo?.bankDocuments?.length < 1 ? (
              <BankInformation
                defaultFormState={profileData}
                countriesData={countriesData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                createCampaign
              />
            ) : (
              <CoverPhoto />
            )}
          </PageTransitionWrapper>
        ) : (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            {bankInfo?.bankDocuments?.length < 1 ||
            needsDocumentVerification() ? (
              <AddDocumentsUI createCampaign />
            ) : (
              <TermsForm
                defaultFormState={profileData}
                countriesData={countriesData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                createCampaignPage
              />
            )}
          </PageTransitionWrapper>
        )
      ) : activeSteps === 9 ? (
        charitySelected ? (
          <AddDocumentsUI createCampaign />
        ) : (
          <PageTransitionWrapper uniqueKey={activeSteps}>
            {bankInfo?.bankDocuments?.length < 1 ? (
              <TermsForm
                defaultFormState={profileData}
                countriesData={countriesData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                createCampaignPage
              />
            ) : (
              <CoverPhoto />
            )}
          </PageTransitionWrapper>
        )
      ) : activeSteps === 10 ? (
        <PageTransitionWrapper uniqueKey={activeSteps}>
          {bankInfo?.bankDocuments?.length < 1 ? (
            <TermsForm
              defaultFormState={profileData}
              countriesData={countriesData}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              createCampaignPage
            />
          ) : (
            <CoverPhoto />
          )}
        </PageTransitionWrapper>
      ) : null}
    </StepperComp>
  );
};

export default CreateCampaignStepper;
