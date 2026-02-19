"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputAdornment from "@mui/material/InputAdornment";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useFormik } from "formik";
// import axios from "axios";
import * as Yup from "yup";

import {
  campaignStepperIncrementHandler,
  createCampaignHandler,
} from "@/store/slices/campaignSlice";

import { createCampaign } from "@/api";
import StoryEditor from "./StoryEditor";
import { theme } from "@/config/customTheme";
// import { stripHtmlTags } from "@/utils/helpers";
// import AIIcon from "@/assets/iconComponent/AIIcon";
import { WrapperLayout } from "../createCampaign.style";
import PopOver from "@/components/molecules/popOver/PopOver";
import StackComponent from "@/components/atoms/StackComponent";
import BackButton from "@/components/atoms/createCampaigns/BackButton";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import CheckBoxComp from "@/components/atoms/checkBoxComp/CheckBoxComp";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
// import IconButtonComp from "@/components/atoms/buttonComponent/IconButtonComp";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import LoadingBtn from "@/components/advance/LoadingBtn";
import { getTextLengthWithoutHTML, getTextWithoutHTML } from "@/utils/helpers";

const CampaignDescription = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isSmallScreen } = useResponsiveScreen();

  const campaignValues = useSelector((state) => state.campaign.campaignValues);
  const [editorError, setEditorError] = useState(false);
  const [editorData, setEditorData] = useState(
    campaignValues.story || campaignValues.campaignStory
  );
  const [randomToken, setRandomToken] = useState(null);
  const [loading, setLoading] = useState(campaignValues?.title ? true : false);

  const [isChecked, setIsChecked] = useState({
    isZakatEligible: false,
    isRecurringDonation: campaignValues.isRecurringDonation || false,
    isMonthlyDonation: campaignValues.isOneTimeDonation ?? true,
    isTaxDeductable: campaignValues.isTaxDeductable ?? false,
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const campaignValuesRef = useRef(campaignValues);
  const editorDataRef = useRef(editorData);
  const isCheckedRef = useRef(isChecked);

  const descriptionSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(10, "Minimum 10 characters"),
  });

  const formik = useFormik({
    initialValues: {
      title: campaignValues?.title || campaignValues?.campaignTitle,
      story: editorData,
    },
    validationSchema: descriptionSchema,
    onSubmit: async () => {
      const editorDataRefContent = editorDataRef?.current || "";
      const maxLength = 50000;

      if (getTextLengthWithoutHTML(editorDataRefContent) <= maxLength) {
        const {
          zipCode,
          linkType,
          fundraisingFor,
          youtubeLink,
          imageUrl,
          currency,
          startingGoal,
          countryId,
          categoryId,
          charityOrganizationId,
        } = campaignValues;

        const fundraising = { currencyUnit: currency, amount: startingGoal };

        const charityId =
          fundraisingFor === "charity-organization"
            ? charityOrganizationId
            : null;

        const payload = {
          countryId: countryId,
          categoryId: categoryId,
          campaignTitle: campaignTitleRef.current,
          coverImageUrl: imageUrl,
          zipCode: zipCode,
          fundraisingGoal: fundraising,
          fundraiser: fundraisingFor,
          charityOrganizationId: charityId,
          campaignStory: editorDataRef.current,
          videoLinks: youtubeLink ? [{ url: youtubeLink, type: linkType }] : [],
          isRecurringDonation: isChecked.isRecurringDonation,
          isZakatEligible: isChecked.isZakatEligible,
          isOneTimeDonation: isChecked.isMonthlyDonation,
          isTaxDeductable: isChecked?.isTaxDeductable,
          isDraft: true,
          draftId: campaignValues.draftId,
        };

        const res = await saveDraft(payload);
        const response = res?.data?.data;
        dispatch(createCampaignHandler(payload));
        payload.randomToken = res?.data?.data?.randomToken;
        if (!campaignValuesRef?.current?.draftId) {
          payload.draftId = response?._id;
        }
        dispatch(createCampaignHandler(payload));
        dispatch(campaignStepperIncrementHandler(1));
      } else {
        toast.error("Maximum story character limit of 50,000 is allowed.");
      }
    },
  });

  const campaignTitleRef = useRef(formik.values.title);

  useEffect(() => {
    isCheckedRef.current = isChecked;
    campaignValuesRef.current = campaignValues;
    campaignTitleRef.current = formik.values.title;
    editorDataRef.current = editorData;
  });

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const {
        zipCode,
        linkType,
        fundraisingFor,
        youtubeLink,
        imageUrl,
        currency,
        startingGoal,
        countryId,
        categoryId,
        charityOrganizationId,
      } = campaignValuesRef.current;

      const charityId =
        fundraisingFor === "charity-organization"
          ? charityOrganizationId
          : null;

      const fundraising = { currencyUnit: currency, amount: startingGoal };
      const campaignPayload = {
        countryId: countryId,
        categoryId: categoryId,
        campaignTitle: campaignTitleRef.current,
        coverImageUrl: imageUrl,
        zipCode: zipCode,
        fundraisingGoal: fundraising,
        fundraiser: fundraisingFor,
        charityOrganizationId: charityId,
        campaignStory: editorDataRef.current,
        videoLinks: youtubeLink ? [{ url: youtubeLink, type: linkType }] : [],
        isRecurringDonation: isCheckedRef.current.isRecurringDonation,
        isZakatEligible: isCheckedRef.current.isZakatEligible,
        isOneTimeDonation: isCheckedRef.current.isMonthlyDonation,
        isTaxDeductable: isCheckedRef.current.isTaxDeductable,
        isDraft: true,
        draftId: campaignValuesRef?.current?.draftId,
      };

      const payload = {
        isDraft: true,
        zipCode: zipCode,
        countryId: countryId,
        categoryId: categoryId,
        coverImageUrl: imageUrl,
        fundraiser: fundraisingFor,
        story: editorDataRef.current,
        fundraisingGoal: fundraising,
        draftId: campaignValuesRef?.current?.draftId,
        title: campaignTitleRef.current,
        charityOrganizationId: charityOrganizationId,
        isZakatEligible: isCheckedRef.current.isZakatEligible,
        isOneTimeDonation: isCheckedRef.current.isMonthlyDonation,
        isRecurringDonation: isCheckedRef.current.isRecurringDonation,
        isTaxDeductable: isCheckedRef.current.isTaxDeductable, //Need to modify
        videoLinks: youtubeLink ? [{ url: youtubeLink, type: linkType }] : [],
      };

      const res = await saveDraft(campaignPayload);
      const response = res?.data?.data;
      if (!campaignValuesRef?.current?.draftId) {
        payload.draftId = response._id;
      }

      setRandomToken(response?.randomToken);
      payload.randomToken = response?.randomToken;
      setLoading(false);
      dispatch(createCampaignHandler(payload));
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const saveDraft = async (campaignPayload) => {
    return await createCampaign(campaignPayload);
  };

  const textEditorHandler = (data) => {
    setEditorData(data);
  };

  const handleCheckboxChange = (key, value) => {
    setIsChecked((prevIsChecked) => {
      // Checking the current states before making changes
      const { isRecurringDonation, isMonthlyDonation } = prevIsChecked;

      // Prevent turning off this checkbox if it would result in both being off
      if (!value && key === "isRecurringDonation" && !isMonthlyDonation) {
        toast.dismiss(); // Dismiss any previous toast to prevent multiple toasts
        toast.error("At least one type of donation must be enabled.");
        return prevIsChecked; // Return previous state without changes
      } else if (
        !value &&
        key === "isMonthlyDonation" &&
        !isRecurringDonation
      ) {
        toast.dismiss(); // Dismiss any previous toast to prevent multiple toasts
        toast.error("At least one type of donation must be enabled.");
        return prevIsChecked; // Return previous state without changes
      }

      // Regular update
      return {
        ...prevIsChecked,
        [key]: value,
      };
    });
  };

  const isFormEmpty = !formik.values.title || formik.errors.title;
  const isEditorEmpty = !editorData || editorData === "<p><br></p>";
  const isTitleTooShort = formik.values.title?.length < 10;

  const isContinueButtonDisabled =
    isFormEmpty || isEditorEmpty || isTitleTooShort;
  const isDisabledPreviewButton =
    formik.values.title === undefined || formik.values.title?.length === 0
      ? true
      : false || randomToken === null;

  // const handleAiDescription = async () => {
  //   const toastId = toast.loading("Generating description from AI");
  //   const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  //   const endpoint = "https://api.openai.com/v1/chat/completions"; // Adjust the engine if needed

  //   try {
  //     const response = await axios.post(
  //       endpoint,
  //       {
  //         model: "gpt-4o", // Specify the model, for example, gpt-3.5-turbo
  //         messages: [
  //           {
  //             role: "system",
  //             content:
  //               "Generate a charity campaign title with a maximum length of 20 tokens without any special character or inverted commas on the passage",
  //           },
  //           {
  //             role: "user",
  //             content: editorData,
  //           },
  //         ],
  //         max_tokens: 1000,
  //         temperature: 1,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${apiKey}`,
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     );
  //     toast.dismiss(toastId);
  //     toast.success("Description generated.");
  //     formik.setFieldValue(
  //       "title",
  //       response.data.choices[0].message.content,
  //       true,
  //     );
  //   } catch (error) {
  //     toast.dismiss(toastId);
  //     toast.error("Error generating description:", error);
  //   }
  //   toast.dismiss(toastId);
  // };

  useEffect(() => {
    setLoading(true);
  }, [editorData, formik.values.title]);

  return (
    <>
      <WrapperLayout isFullHeight={true}>
        <form onSubmit={formik.handleSubmit}>
          <BoxComponent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BackButton />
          </BoxComponent>
          <BoxComponent sx={{ mt: { xs: 3, sm: 5 } }}>
            <StackComponent direction="row" justifyContent="space-between">
              <BoxComponent
                sx={{
                  display: "flex",
                  justifyContent: { xs: "space-between", sm: "flex-start" },
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <CampaignHeading marginBottom={1}>
                  Tell donors why you&apos;re fundraising
                </CampaignHeading>
                <PopOver
                  maxWidth={isSmallScreen ? "300px" : "500px"}
                  popoverContent={
                    "Your story not only shares your mission but also highlights the value it brings to donors. Clearly articulate how supporting your campaign benefits the donor, whether it&apos;s emotional fulfillment, community impact, or personal connection.Make your story brief yet impactful. Convey your passion and the significance of your cause. Need a Hand? Click the “AI Help” button for our AI tool&apos;s assistance in creating an engaging narrative that resonates with donors. For more insights, check out our blog post on writing an effective campaign story."
                  }
                />
              </BoxComponent>
              <LoadingBtn
                disabled={isDisabledPreviewButton && !formik.values.title}
                loadingState={
                  loading &&
                  formik.values.title &&
                  formik.values.title.length > 0
                }
                loadingLabel="Loading"
                sx={{
                  height: "34px",
                }}
                onClick={() => {
                  const editorDataRefContent = editorDataRef?.current || "";
                  const maxLength = 50000;

                  if (
                    getTextLengthWithoutHTML(editorDataRefContent) <= maxLength
                  ) {
                    dispatch(
                      createCampaignHandler({
                        title: formik.values.title,
                        story: editorData,
                      })
                    );
                    router.push(`/preview?id=${randomToken}`);
                  } else {
                    toast.error(
                      "Maximum story character limit of 50,000 is allowed."
                    );
                  }
                }}
                variant="outlined"
                size={"small"}
              >
                Preview
              </LoadingBtn>
            </StackComponent>
            <SubHeading1 sx={{ color: theme.palette.primary.gray, mb: 3 }}>
              Tell users about the situation that required creating a campaign
              on our website
            </SubHeading1>
          </BoxComponent>
          <TextFieldComp
            isRequired
            label={"Fundraiser title"}
            placeholder={"Enter fundraiser title"}
            fullWidth
            sx={{ border: "1px solid #FFEDED" }}
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <TypographyComp
                    sx={{
                      color:
                        formik.values.title?.length > 100 ||
                        formik.values.title?.length < 10
                          ? "#E61D1D"
                          : theme.palette.primary.gray,
                      ml: 1,
                    }}
                    component="span"
                  >
                    {formik.values.title ? formik.values.title?.length : 0}
                  </TypographyComp>
                  <span style={{ color: "#444447" }}>/</span>
                  <span style={{ color: "#606062" }}>100</span>
                  {/* <InputAdornment position="end">
                    <IconButtonComp
                      onClick={handleAiDescription}
                      disabled={
                        !stripHtmlTags(editorData) || editorData === undefined
                      }
                    >
                      <AIIcon />
                    </IconButtonComp>
                  </InputAdornment> */}
                </InputAdornment>
              ),
            }}
          />
          <StoryEditor
            editorData={editorData}
            textEditorHandler={textEditorHandler}
            title={formik.values.title}
            setEditorError={setEditorError}
          />
          {editorError ? (
            <TypographyComp
              sx={{
                marginTop: "25px",
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "16px",
                color: "#e61d1d",
              }}
            >
              Maximum story character limit of 50,000 is allowed.
            </TypographyComp>
          ) : null}
          <BoxComponent sx={{ mt: { xs: 8, sm: editorError ? 0 : 4 } }}>
            <BoxComponent
              sx={{
                display: "flex",

                justifyContent: "flex-start",
                alignItems: "flex-end",
                mb: -1,
              }}
            >
              <CheckBoxComp
                specialIcon={true}
                customCheckbox={true}
                ml={-2}
                mt={0.4}
                specialIconColor={"#0CAB72"}
                isStoredCardSelected={true}
                label={"Zakat eligible"}
                checked={isChecked.isZakatEligible}
                onChange={(e) =>
                  setIsChecked({
                    ...isChecked,
                    isZakatEligible: e.target.checked,
                  })
                }
              />
            </BoxComponent>

            <CheckBoxComp
              specialIcon={true}
              customCheckbox={true}
              ml={-2}
              mt={0.4}
              specialIconColor={"#0CAB72"}
              label={
                <TypographyComp
                  component="span"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "16px",
                    color: "#090909",
                  }}
                >
                  Allow recurring donations
                </TypographyComp>
              }
              checked={isChecked.isRecurringDonation}
              onChange={(e) =>
                handleCheckboxChange("isRecurringDonation", e.target.checked)
              }
            />
            <BoxComponent sx={{ mt: -0.9 }}>
              <CheckBoxComp
                specialIcon={true}
                customCheckbox={true}
                ml={-2}
                mt={0.4}
                specialIconColor={"#0CAB72"}
                label={
                  <TypographyComp
                    component="span"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "16px",
                      color: "#090909",
                    }}
                  >
                    Allow one-time donations
                  </TypographyComp>
                }
                checked={isChecked.isMonthlyDonation}
                onChange={(e) =>
                  handleCheckboxChange("isMonthlyDonation", e.target.checked)
                }
              />
            </BoxComponent>
            <BoxComponent sx={{ mt: -0.9 }}>
              <CheckBoxComp
                specialIcon={true}
                customCheckbox={true}
                ml={-2}
                mt={0.4}
                specialIconColor={"#0CAB72"}
                label={
                  <TypographyComp
                    component="span"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "16px",
                      color: "#090909",
                    }}
                  >
                    Tax deductible
                  </TypographyComp>
                }
                checked={isChecked?.isTaxDeductable}
                onChange={(e) =>
                  handleCheckboxChange("isTaxDeductable", e.target.checked)
                }
              />
            </BoxComponent>
          </BoxComponent>

          <SubmitButton
            withSticky
            type="submit"
            isContinueButtonDisabled={isContinueButtonDisabled}
            disabled={
              editorError ||
              !formik.values.title ||
              formik.values.title?.length < 10 ||
              !getTextWithoutHTML(editorData) ||
              !editorData
            }
          />
        </form>
      </WrapperLayout>
    </>
  );
};

CampaignDescription.propTypes = {};

export default CampaignDescription;
