"use client";

import PropTypes from "prop-types";
import React from "react";
import { theme } from "@/config/customTheme";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

const BasicText = ({ children, sx, quillEditor = false, ...otherProps }) => {
  return (
    <TypographyComp
      {...otherProps}
      align={quillEditor ? "" : "left"}
      sx={{ fontSize: "16px", color: "#424243", ...sx }}
    >
      {children}
    </TypographyComp>
  );
};

BasicText.propTypes = {
  children: PropTypes.any,
  sx: PropTypes.any,
  quillEditor: PropTypes.bool,
};

export default BasicText;
