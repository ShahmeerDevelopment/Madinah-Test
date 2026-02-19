"use client";

import React from "react";
import PropTypes from "prop-types";
import { DeleteButtonWrapper } from "@/styles/CampaignDetails.style";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { theme } from "@/config/customTheme";

const DeleteModals = ({
  levelDeleteHandler,
  isDeleteLoader,
  setOpenDeleteMOdel,
  heading = "Delete Giving Levels",
  description = "Are you sure that you want to delete the level? All information about it will be deleted",
  isStory,
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
          onClick={levelDeleteHandler}
          fullWidth
          size="normal"
          disabled={isStory ? false : isDeleteLoader ? true : false}
        >
          {isStory ? "OK" : isDeleteLoader ? "Deleting..." : "Delete"}
        </ButtonComp>
        <ButtonComp
          variant="outlined"
          size="normal"
          padding="12px 32px"
          onClick={() => setOpenDeleteMOdel(false)}
          fullWidth
        >
          {isStory ? "Cancel" : "Close"}
        </ButtonComp>
      </DeleteButtonWrapper>
    </div>
  );
};

DeleteModals.propTypes = {
  levelDeleteHandler: PropTypes.func,
  isDeleteLoader: PropTypes.bool,
  setOpenDeleteMOdel: PropTypes.func,
  heading: PropTypes.string,
  description: PropTypes.string,
  isStory: PropTypes.bool,
};

export default DeleteModals;
