"use client";

import PropTypes from "prop-types";
import React from "react";
import { buildSimpleTypography } from "@/utils/helpers";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

// Next
const CountryCard = ({
  countryName,
  image,
  clickAction = () => {},
  id,
  ...props
}) => {
  return (
    <BoxComponent
      className="country-card"
      onClick={() => {
        clickAction({ id, countryName, payload: { ...props } });
      }}
      sx={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "100% 100%",
        width: "185px",
        height: "222px",
        borderRadius: "16px",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <TypographyComp
        sx={{
          ...buildSimpleTypography(500, 22, 28),
          color: "#ffffff",
          position: "absolute",
          bottom: "10px",
          left: "14px",
        }}
      >
        {countryName}
      </TypographyComp>
    </BoxComponent>
  );
};

CountryCard.propTypes = {
  clickAction: PropTypes.func,
  countryName: PropTypes.any,
  id: PropTypes.any,
  image: PropTypes.any,
};

export default CountryCard;
