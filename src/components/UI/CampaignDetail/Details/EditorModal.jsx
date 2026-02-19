"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import SubHeading from "../../../../components/atoms/createCampaigns/SubHeading";
import TypographyComp from "../../../../components/atoms/typography/TypographyComp";
// import QuillEditor from "../../../../components/molecules/textEditor/QuillEditor";
import PropTypes from "prop-types";
import BoxComponent from "../../../../components/atoms/boxComponent/BoxComponent";
import { ASSET_PATHS } from "@/utils/assets";
import ButtonComp from "../../../../components/atoms/buttonComponent/ButtonComp";
import { theme } from "../../../../config/customTheme";
import CampaignHeading from "../../../../components/atoms/createCampaigns/CampaignHeading";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css"; // Include Quill stylesheet
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const EditorModal = ({
  submitHandler = () => { },
  textEditorHandler,
  editorData,
  setSetEditorModal,
}) => {
  const { isSmallScreen } = useResponsiveScreen();
  const [editorError, setEditorError] = useState(false);
  const QuillEditor = useMemo(
    () =>
      dynamic(
        () => import("../../../../components/molecules/textEditor/QuillEditor"),
        { ssr: false }
      ),
    []
  );
  const saveButtonHandler = () => {
    submitHandler(editorData);
    setSetEditorModal(false);
  };
  return (
    <BoxComponent
      sx={{
        height: { xs: "540px", sm: "600px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "auto",
        gap: 3,
      }}
    >
      <div>
        <CampaignHeading
          sx={{ color: theme.palette.primary.dark }}
          marginBottom={2.8}
        >
          Tell your story
        </CampaignHeading>
        <TypographyComp
          align="left"
          sx={{
            color: theme.palette.primary.gray,
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "18px",
          }}
        >
          Tell your story
        </TypographyComp>
        <BoxComponent
          sx={{
            borderTop: "1px solid rgb(189, 185, 185)",
            borderRadius: "14px",
          }}
        >
          <QuillEditor
            placeholder={"Write your story..."}
            height="280px"
            textEditorHandler={textEditorHandler}
            editorData={editorData}
            setEditorError={setEditorError}
          />
        </BoxComponent>
      </div>
      <BoxComponent>
        {editorError ? (
          <TypographyComp
            sx={{
              marginBottom: "5px",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#e61d1d",
            }}
          >
            Maximum story character limit of 50,000 is allowed.
          </TypographyComp>
        ) : null}
        <BoxComponent
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 2 },
            backgroundColor: "#FFF9D6",
            borderRadius: "12px",
            padding: { xs: "14px", sm: "24px" },
            height: { xs: "118px", sm: "94px" },
            marginTop: `${isSmallScreen ? "70px" : "revert"}`,
          }}
        >
          <Image
            src={ASSET_PATHS.campaign.notification}
            alt="notification"
            width={24}
            height={24}
          />
          <BoxComponent>
            <SubHeading sx={{ color: theme.palette.primary.dark }}>
              Share the details of the story
            </SubHeading>
            <TypographyComp
              sx={{
                fontSize: "14px",
                lineHeight: "16px",
                color: theme.palette.primary.dark,
              }}
            >
              Longer fundraiser stories often inspire more donations. Your
              supports especially want to know how donations will be used.
            </TypographyComp>
          </BoxComponent>
        </BoxComponent>
        <BoxComponent
          sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}
        >
          <ButtonComp
            size="normal"
            padding={"12px 32px"}
            sx={{ width: { xs: "100%", sm: "148px" } }}
            onClick={saveButtonHandler}
            disabled={editorError}
          >
            Save
          </ButtonComp>
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
};

EditorModal.propTypes = {
  editorData: PropTypes.any,
  setSetEditorModal: PropTypes.func,
  submitHandler: PropTypes.func,
  textEditorHandler: PropTypes.func,
};

export default EditorModal;
