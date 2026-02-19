"use client";

import React, { startTransition, useState } from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import {
  updateBankInfo,
  updateBankInfoReview,
  updateUserAddress,
  updateUserPersonalInformation,
} from "@/api/update-api-service";
import BankDetailLayout from "@/Layouts/BankDetailLayout";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { theme } from "@/config/customTheme";
// import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
// import CustomSwitchButton from "@/components/atoms/buttonComponent/CustomSwitchButton";
// import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import CustomCheckBox from "@/components/atoms/checkBoxComp/CustomCheckBox";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  resetActiveStepper,
  resetCampaignValues,
} from "@/store/slices/campaignSlice";
import { createCampaign } from "@/api";
import { handleVerificationDocumentApproval } from "@/api/post-api-services";

const TermsForm = ({
  activeStep,
  setActiveStep,
  setCurrentIndex,
  createCampaignPage = false,
  defaultFormState,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSwitchOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const campaignValues = useSelector(
    (state) => state?.campaign?.campaignValues
  );
  const personalInformation = useSelector(
    (state) => state?.campaign?.personalInformation
  );
  const homeAddress = useSelector((state) => state?.campaign?.homeAddress);
  const bankInformation = useSelector(
    (state) => state?.campaign?.bankInformation
  );
  const [isChecked, setIsChecked] = useState({
    isPrivacy: false,
    isTermsOfUse: false,
    isPaymentPolicy: false,
  });

  const submitHandler = async () => {
    setIsLoading(true);
    const payload = { isUrgent: isSwitchOn };

    if (createCampaignPage) {
      try {
        if (defaultFormState?.bankInfo?.bankDocuments?.length < 1) {
          // Execute all API calls sequentially and wait for each to complete
          const personalInfoRes =
            await updateUserPersonalInformation(personalInformation);
          const personalInfoResult = personalInfoRes?.data;
          if (!personalInfoResult.success) {
            console.error(personalInfoResult.error);
            toast.error(personalInfoResult.message);
            setIsLoading(false);
            return;
          }

          const addressRes = await updateUserAddress(homeAddress);
          const addressResult = addressRes?.data;
          if (!addressResult.success) {
            toast.error(addressResult.message);
            setIsLoading(false);
            return;
          }

          const bankInfoRes = await updateBankInfo(bankInformation);
          const bankInfoResult = bankInfoRes?.data;
          if (!bankInfoResult.success) {
            toast.error(bankInfoResult.message);
            setIsLoading(false);
            return;
          }

          const verificationRes = await handleVerificationDocumentApproval();
          const verificationResult = verificationRes?.data;
          if (!verificationResult.success) {
            toast.error(verificationResult.message);
            setIsLoading(false);
            return;
          }
        }
        // Only create campaign if all previous API calls were successful
        const payloadCampaign = {
          countryId: campaignValues?.countryId,
          categoryId: campaignValues?.categoryId,
          campaignTitle: campaignValues?.campaignTitle,
          coverImageUrl: campaignValues?.coverImageUrl,
          zipCode: campaignValues?.zipCode,
          fundraisingGoal: campaignValues?.fundraisingGoal,
          fundraiser: campaignValues?.fundraiser,
          charityOrganizationId: campaignValues?.charityOrganizationId,
          campaignStory: campaignValues?.campaignStory,
          videoLinks: campaignValues?.videoLinks,
          isRecurringDonation: campaignValues?.isRecurringDonation,
          isZakatEligible: campaignValues?.isZakatEligible,
          isOneTimeDonation: campaignValues?.isOneTimeDonation,
          isTaxDeductable: campaignValues?.isTaxDeductable,
          isDraft: false,
          draftId: campaignValues?.draftId,
        };

        const campaignRes = await createCampaign(payloadCampaign);
        const campaignResult = campaignRes?.data;

        if (campaignResult.success) {
          toast.success("Campaign Created Successfully");
          startTransition(() => {
            router.push("/campaign-success");
          });
          setIsLoading(false);

          setTimeout(() => {
            dispatch(resetCampaignValues());
            dispatch(resetActiveStepper(0));
          }, 5000);
        } else {
          toast.error(campaignResult.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        setIsLoading(false);
      }
    } else {
      updateBankInfoReview(payload)
        .then((res) => {
          const result = res?.data;

          if (result.success) {
            setIsLoading(false);
            toast.success(result.message);
            router.push("/dashboard");
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

  const isDisable = !(isChecked.isPrivacy && isChecked.isTermsOfUse);

  return (
    <BankDetailLayout
      isFullHeight={true}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      setCurrentIndex={setCurrentIndex}
      isSkipForNow={false}
      heading="Terms and Conditions"
      createCampaign={createCampaignPage}
    >
      <SubHeading1 sx={{ color: theme.palette.primary.gray }}>
        By fundraising on Madinah, I agree to the following conditions:
      </SubHeading1>

      <BoxComponent
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItem: "center",
          gap: { xs: 0, sm: 2 },
          mt: 3,
        }}
      >
        <CustomCheckBox
          checked={isChecked.isPrivacy}
          onChange={(e) =>
            setIsChecked({ ...isChecked, isPrivacy: e.target.checked })
          }
          label={
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
              }}
            >
              Privacy Policy
            </a>
          }
          labelStyling={{
            color: theme.palette.primary.main,
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "16px",
          }}
        />
        <CustomCheckBox
          checked={isChecked.isTermsOfUse}
          onChange={(e) =>
            setIsChecked({ ...isChecked, isTermsOfUse: e.target.checked })
          }
          label={
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
              }}
            >
              Terms of Use
            </a>
          }
          labelStyling={{
            color: theme.palette.primary.main,
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "16px",
          }}
        />
      </BoxComponent>
      {/* <BoxComponent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          mt: 6,
        }}
      >
        <SubHeading sx={{ color: "#606062" }}> Urgent?</SubHeading>
        <CustomSwitchButton
          withMargins={false}
          checked={isSwitchOn}
          onChange={handleSwitchChange}
        />
      </BoxComponent> */}
      {/* <Paragraph sx={{ mb: { xs: 10, sm: 0 } }}>
        Submit for an expedited review
      </Paragraph> */}
      <SubmitButton
        isContinueButtonDisabled={isDisable}
        onClick={submitHandler}
      >
        {isLoading ? "Updating..." : "Continue"}
      </SubmitButton>
    </BankDetailLayout>
  );
};

TermsForm.propTypes = {
  activeStep: PropTypes.number,
  setActiveStep: PropTypes.func,
  setCurrentIndex: PropTypes.func,
};
export default TermsForm;
