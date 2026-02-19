"use client";


import PropTypes from "prop-types";
import React from "react";
import SubHeading from "../../atoms/createCampaigns/SubHeading";
import StackComponent from "../../atoms/StackComponent";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";
import { theme } from "../../../config/customTheme";

const EditCampaignHeading = ({
  children,
  withEdit = false,
  editAction = () => {},
  editActionLabel = "Edit",
  containerStyleOverrides,
  sx,
  ...otherProps
}) => {
  const headingStyles = { mb: 1, mt: 1, ...sx };

  return (
    <>
      {withEdit ? (
        <StackComponent
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{
            ...containerStyleOverrides,
          }}
        >
          <SubHeading
            sx={{ ...headingStyles, color: theme.palette.primary.dark }}
            {...otherProps}
          >
            {children}
          </SubHeading>
          <ButtonComp
            variant="outlined"
            size="normal"
            height="34px"
            sx={{ width: "60px", padding: "10px 19px" }}
            onClick={(e) => editAction(e)}
          >
            {editActionLabel}
          </ButtonComp>
        </StackComponent>
      ) : (
        <SubHeading sx={headingStyles} {...otherProps}>
          {children}
        </SubHeading>
      )}
    </>
  );
};

EditCampaignHeading.propTypes = {
  children: PropTypes.any,
  containerStyleOverrides: PropTypes.any,
  editAction: PropTypes.func,
  editActionLabel: PropTypes.string,
  withEdit: PropTypes.bool,
};

export default EditCampaignHeading;
