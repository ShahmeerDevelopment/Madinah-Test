"use client";

import React, { memo } from "react";
import BoxComponent from "../boxComponent/BoxComponent";
import StackComponent from "../StackComponent";
import { theme } from "../../../config/customTheme";
import PropTypes from "prop-types";
import { ASSET_PATHS } from "@/utils/assets";
import SubHeading1 from "../createCampaigns/SubHeading1";
import IconButtonComp from "../buttonComponent/IconButtonComp";
import Edit from "../../../assets/iconComponent/Edit";
import Delete from "../../../assets/iconComponent/Delete";
import Image from "next/image";

const checkBox = ASSET_PATHS.donations.checkBox;

const SelectAbleSavedCard = memo(
  ({
    onClick,
    isActive = true,
    heading = "heading",
    icon = checkBox,
    isStoredCard = false,
    height = "48px",
    onEdit = () => { },
    onDelete = () => { },
  }) => {
    return (
      <div>
        <BoxComponent
          onClick={onClick}
          sx={{
            height: height,
            width: "100%",
            mb: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            padding: "1rem",
            borderRadius: "28px",
            border: isActive
              ? isStoredCard
                ? `2px solid ${theme.palette.primary.main}`
                : "2px solid transparent"
              : "1px solid #E9E9EB",
            background:
              "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box",
          }}
        >
          <StackComponent direction={"row"} spacing={2} alignItems={"center"}>
            <Image
              src={icon}
              alt="field-ico"
              width={33}
              height={22}
              style={{ borderRadius: "4px" }}
            />

            <SubHeading1
              sx={{
                color: isActive ? "black" : theme.palette.primary.gray,
              }}
            >
              {" "}
              {heading}
            </SubHeading1>
          </StackComponent>
          <StackComponent spacing={0}>
            <IconButtonComp onClick={(event) => onEdit(event)}>
              <Edit />
            </IconButtonComp>
            <IconButtonComp onClick={(event) => onDelete(event)}>
              <Delete />
            </IconButtonComp>
          </StackComponent>
          {/* {!isStoredCard ? isActive && <SmallCheckBox /> : null} */}
        </BoxComponent>
      </div>
    );
  },
);

SelectAbleSavedCard.displayName = "SelectAbleSavedCard";

SelectAbleSavedCard.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  heading: PropTypes.string,
  icon: PropTypes.string,
  isStoredCard: PropTypes.bool,
  height: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default SelectAbleSavedCard;
