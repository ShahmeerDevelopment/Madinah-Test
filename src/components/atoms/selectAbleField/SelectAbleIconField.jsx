"use client";

import React, { memo } from "react";
import BoxComponent from "../boxComponent/BoxComponent";
import { theme } from "@/config/customTheme";
import StackComponent from "../StackComponent";

import Paragraph from "../createCampaigns/Paragraph";
import SmallCheckBox from "@/assets/iconComponent/SmallCheckBox";
import { ASSET_PATHS } from "@/utils/assets";
const checkBox = ASSET_PATHS.svg.checkBox;
import PropTypes from "prop-types";

import Image from "next/image";

// Next
const SelectAbleIconField = memo(
  ({
    onClick = () => { },
    isActive = true,
    heading = "heading",
    icon = checkBox,
    isStoredCard = false,
    height = "64px",
    isGoogleButton = false,
    isPaymentButton = false,
    newPayment = false
  }) => {
    return (
      <BoxComponent
        onClick={onClick}
        sx={{
          height: height,
          width: "100%",
          mb: 1,
          display: "flex",
          justifyContent: isActive ? "space-between" : "flex-start",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          padding: "1rem",
          borderRadius: newPayment ? "10px" : "28px",
          border: isActive
            ? isStoredCard
              ? `2px solid ${theme.palette.primary.main}`
              : "2px solid transparent"
            : "2px solid #E9E9EB",
          background:
            "linear-gradient(white, white) padding-box, linear-gradient(90deg, #6363E6 0.05%, #59C9F9 99.96%) border-box",
        }}
      >
        <StackComponent direction={"row"} spacing={2} alignItems={"center"}>
          {isGoogleButton ? (
            <div style={{ marginLeft: "-20px", marginTop: "4px" }}>
              <Image src={icon} alt="Google Button" width={100} height={100} />
            </div>
          ) : (
            <Image
              src={icon}
              alt="field-ico"
              width={33}
              height={22}
              style={{ borderRadius: "6px" }}
            />
          )}

          <Paragraph
            textColor={isActive ? "black" : theme.palette.primary.gray}
            sx={{
              marginLeft: isGoogleButton ? "-10px !important" : "auto",
              mt: isPaymentButton ? "6px !important" : "auto",
            }}
          >
            {heading}
          </Paragraph>
        </StackComponent>
        {!isStoredCard ? isActive && <SmallCheckBox /> : null}
      </BoxComponent>
    );
  },
);

SelectAbleIconField.displayName = "SelectAbleIconField";

SelectAbleIconField.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  heading: PropTypes.string,
  icon: PropTypes.string,
  isStoredCard: PropTypes.bool,
  height: PropTypes.string,
  isGoogleButton: PropTypes.bool,
  isPaymentButton: PropTypes.bool,
};

export default SelectAbleIconField;
