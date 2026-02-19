"use client";

import React from "react";
import PropTypes from "prop-types";
import { DeleteButtonWrapper } from "@/styles/CampaignDetails.style";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { theme } from "@/config/customTheme";

const ConfirmationModal = ({
  updateEmailHandler,
  isUpdateLoader,
  //   setOpenUpdateModal,
  heading = "Send Update",
  description = "The update will be sent to all 0 donors. Do you want to send email?",
}) => {
  return (
    <div>
      <CampaignHeading
        align={"center"}
        sx={{ mb: 1, color: theme.palette.primary.dark }}
      >
        {heading}
      </CampaignHeading>

      <SubHeading1 sx={{ color: theme.palette.primary.gray }}>
        {description}
      </SubHeading1>
      <DeleteButtonWrapper>
        <ButtonComp
          padding="12px 32px"
          onClick={() => updateEmailHandler("yes")}
          fullWidth
          size="normal"
          disabled={isUpdateLoader ? true : false}
        >
          Yes
        </ButtonComp>
        <ButtonComp
          variant="outlined"
          size="normal"
          padding="12px 32px"
          onClick={() => updateEmailHandler("no")}
          fullWidth
          disabled={isUpdateLoader ? true : false}
        >
          No
        </ButtonComp>
      </DeleteButtonWrapper>
    </div>
  );
};

ConfirmationModal.propTypes = {
  updateEmailHandler: PropTypes.func,
  isUpdateLoader: PropTypes.bool,
  setOpenUpdateModal: PropTypes.func,
  heading: PropTypes.string,
  description: PropTypes.string,
};

export default ConfirmationModal;
