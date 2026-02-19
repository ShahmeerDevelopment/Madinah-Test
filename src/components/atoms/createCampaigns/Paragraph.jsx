"use client";

import React from "react";
import PropTypes from "prop-types";
import TypographyComp from "../typography/TypographyComp";

// Next
const Paragraph = ({ sx, children, textColor = "#A1A1A8", align = "left" }) => {
  return (
    <TypographyComp
      align={align}
      sx={{
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "20px",
        color: textColor,
        ...sx,
      }}
    >
      {children}
    </TypographyComp>
  );
};

Paragraph.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
  isActive: PropTypes.bool,
  textColor: PropTypes.string,
  align: PropTypes.string,
};

export default Paragraph;
