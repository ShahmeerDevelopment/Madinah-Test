"use client";

import StackComponent from "@/components/atoms/StackComponent";
import React from "react";
import PropTypes from "prop-types";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

const SmallCard = ({ label = "", amount = 0 }) => {
  return (
    <StackComponent
      sx={{
        background: "#ffffff",
        boxShadow: "0px 0px 100px 0px #0000000F",
        borderRadius: "16px",
        p: "12px !important",
        minWidth: { xs: "auto", sm: "120px" },
        height: "68px",
      }}
      direction="column"
      alignItems="flex-start"
      spacing={0}
    >
      <TypographyComp
        sx={{
          color: "#090909",
          fontWeight: 500,
          fontSize: "22px",
          lineHeight: "28px",
          letterSpacing: "-0.41px",
        }}
      >
        {amount}
      </TypographyComp>
      <TypographyComp
        sx={{
          color: "#606062",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "16px",
          letterSpacing: "-0.41px",
        }}
      >
        {label}
      </TypographyComp>
    </StackComponent>
  );
};

SmallCard.propTypes = {
  amount: PropTypes.string,
  label: PropTypes.string,
};

export default SmallCard;
