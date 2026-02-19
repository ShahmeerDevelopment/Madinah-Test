/* eslint-disable no-mixed-spaces-and-tabs */
"use client";

import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

import { theme } from "../../../config/customTheme";
import { formatNumberWithCommas } from "../../../utils/helpers";
import SubHeading from "../../atoms/createCampaigns/SubHeading";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import TypographyComp from "../../atoms/typography/TypographyComp";

const boxStyle = (selectedBox, index, isClickable) => ({
  width: "100%",
  height: "80px",
  borderRadius: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.06)",
  padding: "16px 16px 16px 18px",
  cursor: isClickable ? "pointer" : "default",
  border: `1px solid ${
    selectedBox === index ? theme.palette.primary.main : "transparent"
  }`,
});

const textStyle = (selectedBox, index) => ({
  fontSize: "14px",
  lineHeight: "16px",
  mb: "4px",
  color: selectedBox === index ? "#C1C1F5" : theme.palette.primary.gray,
});

const StatisticsCardComp = ({
  selectedIndex = null,
  currentIndex = 0,
  cardHandler = () => {},
  name = "name",
  currencyUnit,
  currencySymbol,
  value = 0,
  icon,
  altName,
  isClickable = true,
}) => {
  const onClick = () => {
    if (isClickable) {
      cardHandler();
    }
  };
  return (
    <BoxComponent
      sx={boxStyle(selectedIndex, currentIndex, isClickable)}
      onClick={onClick}
    >
      <BoxComponent sx={{ display: "flex", flexDirection: "column" }}>
        <TypographyComp sx={textStyle(selectedIndex, currentIndex)}>
          {name}
        </TypographyComp>
        <SubHeading
          sx={{
            color:
              selectedIndex === currentIndex
                ? theme.palette.primary.main
                : theme.palette.primary.dark,
          }}
        >
          {currencyUnit} {currencySymbol}
          {formatNumberWithCommas(value)}
        </SubHeading>
      </BoxComponent>
      <Image src={icon} alt={`${altName} icon`} width={48} height={48} />
    </BoxComponent>
  );
};

StatisticsCardComp.propTypes = {
  name: PropTypes.string,
  cardHandler: PropTypes.func,
  selectedIndex: PropTypes.number,
  currentIndex: PropTypes.number,
  currencyUnit: PropTypes.string,
  currencySymbol: PropTypes.string,
  value: PropTypes.any,
  icon: PropTypes.any,
  altName: PropTypes.string,
  isClickable: PropTypes.bool,
};
export default StatisticsCardComp;
