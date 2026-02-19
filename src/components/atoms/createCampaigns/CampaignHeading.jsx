"use client";

import React from "react";
import PropTypes from "prop-types";
import TypographyComp from "../typography/TypographyComp";

// Next
const CampaignHeading = ({
  children,
  marginBottom = 4,
  mobileMarginBottom = 2,
  align = "left",
  sx,
}) => {
  return (
    <TypographyComp
      align={align}
      sx={{
        fontSize: { xs: "30px", sm: "32px" },
        fontWeight: 500,
        lineHeight: "38px",
        color: "rgba(9, 9, 9, 1)",
        mb: {
          xs: mobileMarginBottom,
          sm: marginBottom,
        },
        ...sx,
      }}
    >
      {children}
    </TypographyComp>
  );
};

CampaignHeading.propTypes = {
  children: PropTypes.node,
  marginBottom: PropTypes.any,
  mobileMarginBottom: PropTypes.number,
  sx: PropTypes.object,
  align: PropTypes.string,
};

export default CampaignHeading;
