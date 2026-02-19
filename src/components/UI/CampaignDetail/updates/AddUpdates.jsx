/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */

"use client";

import React, { startTransition, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import SubHeading from "../../../../components/atoms/createCampaigns/SubHeading";
import TextFieldComp from "../../../../components/atoms/inputFields/TextFieldComp";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import { LevelWrapper } from "@/styles/CampaignDetails.style";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import StackComponent from "../../../../components/atoms/StackComponent";
import StoryEditor from "../../createCampaign/campaignDescription/StoryEditor";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import { useSelector } from "react-redux";

const AddUpdates = ({
  onAddUpdate,
  isLoader,
  isShowForm,
  setIsShowForm,
  editedValue,
  setShowAddButton,
  notifyHandler,
}) => {
  const { isSmallScreen } = useResponsiveScreen();
  const [editorData, setEditorData] = useState(
    notifyHandler === "edit" ? editedValue?.body : ""
  );
  const mutateCampaign = useSelector((state) => state.mutateCampaign);
  const [editorError, setEditorError] = useState(false);
  const [isFormModified, setIsFormModified] = useState(false);
  // Update signature to be in a single line with br tags
  const signature = `Regards,<br/>${mutateCampaign?.creator}<br/>${mutateCampaign?.creatorEmail}`;
  // Update initial state to properly handle line breaks
  const [emailFooterDisplay, setEmailFooterDisplay] = useState(
    notifyHandler === "edit"
      ? editedValue?.emailFooter?.replace(/<br\/>/g, "\n")
      : signature?.replace(/<br\/>/g, "\n")
  );

  // Add this helper function
  const getCharacterCount = (text) => {
    if (!text) return 0;
    return text.replace(/\n/g, "").length;
  };

  // Add these helper functions
  const isTextTooLong = (text, limit) => {
    return text?.length > limit;
  };

  const isEmailFooterTooLong = (text) => {
    if (!text) return false;
    return text.replace(/\n/g, "").length > 500;
  };

  const levelsSchema = Yup.object().shape({
    title: Yup.string()
      .required("Subject is required")
      .max(500, "Subject cannot exceed 500 characters"),
    emailHeader: Yup.string().max(
      500,
      "Email Header cannot exceed 500 characters"
    ),
    emailFooter: Yup.string().test(
      "max-length",
      "Email Footer cannot exceed 500 characters",
      (value) => !value || value.replace(/<br\/>/g, "").length <= 500
    ),
    body: Yup.string().required("Body is required"),
  });
  const formik = useFormik({
    initialValues: {
      title: notifyHandler === "edit" ? editedValue?.title || "" : "",
      emailHeader:
        notifyHandler === "edit"
          ? editedValue?.emailHeader || ""
          : "Dear [Donor Name],",
      emailFooter:
        notifyHandler === "edit" ? editedValue?.emailFooter || "" : signature,
      body: notifyHandler === "edit" ? editedValue?.body || "" : "",
    },
    validationSchema: levelsSchema,
    onSubmit: (values) => {
      onAddUpdate(values);
      formik.resetForm();
      setIsFormModified(false);
    },
  });

  // Add this computed value
  const isAnyFieldTooLong =
    isTextTooLong(formik.values.title, 500) ||
    isTextTooLong(formik.values.emailHeader, 500) ||
    isEmailFooterTooLong(emailFooterDisplay);

  const cancelButtonHandler = () => {
    // e.stopPropagation(); // Prevent event from propagating if needed
    startTransition(() => {
      setIsShowForm({ ...isShowForm, add: false, edit: false });
      setShowAddButton(true);
    });
  };

  const isFormEmpty = !formik.values.title || !formik.values.body;
  // const isTitleTooLong = formik.values.title.length > 500;
  const buttonData =
    isShowForm.edit || isShowForm.duplicate
      ? isLoader
        ? "Saving..."
        : "Save"
      : isLoader
        ? "Adding..."
        : "Add";

  const textEditorHandler = (data) => {
    const cleanedData = data.replace(/&nbsp;/g, " ");
    setEditorData(cleanedData);
    formik.setFieldValue("body", cleanedData);
    setIsFormModified(true);
  };

  const handleTitleChange = (e) => {
    // const maxLength = 500;
    const value = e.target.value;

    // if (value.length <= maxLength) {
    if (e.target.name === "emailFooter") {
      setEmailFooterDisplay(value);
      const formattedValue = value.replace(/\n/g, "<br/>");
      formik.setFieldValue("emailFooter", formattedValue);
    } else {
      formik.setFieldValue(e.target.name, value);
    }
    setIsFormModified(true);
    // }
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <LevelWrapper>
          <SubHeading sx={{ mb: 1 }}>
            {" "}
            {isShowForm.edit
              ? "Edit update"
              : isShowForm.duplicate
                ? "Duplicate giving levels"
                : "Add update"}
          </SubHeading>
          <BoxComponent sx={{ mt: 2 }}>
            <TextFieldComp
              label={"Subject*"}
              placeholder={"Enter email subject here"}
              fullWidth
              name="title"
              value={formik.values.title}
              onChange={handleTitleChange}
              onBlur={formik.handleBlur}
              // inputProps={{ maxLength: 500 }}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={
                (formik.touched.title && formik.errors.title) ||
                `${
                  formik.values.title?.length ? formik.values.title.length : 0
                }/500 characters`
              }
            />
          </BoxComponent>
          <BoxComponent sx={{ mt: 2 }}>
            <TextFieldComp
              label={"Email Header"}
              placeholder={"Enter your email header here"}
              fullWidth
              name="emailHeader"
              value={formik.values.emailHeader}
              onChange={handleTitleChange}
              onBlur={formik.handleBlur}
              // inputProps={{ maxLength: 500 }}
              error={
                formik.touched.emailHeader && Boolean(formik.errors.emailHeader)
              }
              helperText={
                (formik.touched.emailHeader && formik.errors.emailHeader) ||
                `${
                  formik.values.emailHeader?.length
                    ? formik.values.emailHeader.length
                    : 0
                }/500 characters`
              }
            />
          </BoxComponent>
          <StoryEditor
            editorData={editorData}
            textEditorHandler={textEditorHandler}
            title={formik.values.body}
            setEditorError={setEditorError}
            placeholder="Write your update body..."
            header="Update body*"
          />
          {editorError ? (
            <TypographyComp
              sx={{
                mt: { xs: 8, sm: 4 },
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "16px",
                color: "#e61d1d",
              }}
            >
              Maximum body character limit of 50,000 is allowed.
            </TypographyComp>
          ) : null}
          <BoxComponent sx={{ mt: { xs: editorError ? 4 : 8, sm: 4 } }}>
            <TextFieldComp
              label={"Email Footer"}
              placeholder={"Enter your email footer here"}
              fullWidth
              multiline
              minRows={3}
              name="emailFooter"
              value={emailFooterDisplay} // Use display value here
              onChange={handleTitleChange}
              onBlur={formik.handleBlur}
              // inputProps={{ maxLength: 500 }}
              error={
                formik.touched.emailFooter && Boolean(formik.errors.emailFooter)
              }
              helperText={
                (formik.touched.emailFooter && formik.errors.emailFooter) ||
                `${getCharacterCount(emailFooterDisplay)}/500 characters`
              }
            />
          </BoxComponent>
          <StackComponent
            mb={2}
            justifyContent={{ xs: "space-between", sm: "flex-start" }}
            spacing={2}
            sx={{ marginTop: isSmallScreen ? "60px" : "40px" }}
          >
            <ButtonComp
              type="submit"
              // fullWidth={isSmallScreen ? true : false}
              disabled={
                isFormEmpty ||
                isLoader ||
                !isFormModified ||
                editorError ||
                isAnyFieldTooLong // Add this condition
              }
              sx={{
                width: { xs: "100%", sm: "135px" },
                p: "12px 32px 12px 32px",
                fontSize: "16px",
                height: "40px",
              }}
            >
              {buttonData}
            </ButtonComp>
            {isShowForm.add || isShowForm.edit ? (
              <ButtonComp
                variant="outlined"
                onClick={cancelButtonHandler}
                sx={{
                  width: "135px",
                  p: "12px 32px 12px 32px",
                  fontSize: "16px",
                  height: "40px",
                }}
              >
                Cancel
              </ButtonComp>
            ) : null}
          </StackComponent>
        </LevelWrapper>
      </form>
    </div>
  );
};

AddUpdates.propTypes = {
  onAddLevel: PropTypes.func.isRequired,
  isLoader: PropTypes.bool.isRequired,
  editedValue: PropTypes.object,
  duplicateData: PropTypes.object,
  setIsShowForm: PropTypes.func,
  isShowForm: PropTypes.object,
};
export default AddUpdates;
