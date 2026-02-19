"use client";

import PropTypes from "prop-types";
import React from "react";
import SectionHeading from "./SectionHeading";
import StackComponent from "@/components/atoms/StackComponent";

const Section = ({
  withoutHeading = false,
  children,
  heading,
  sectionRightActions,
  sx,
  ...otherProps
}) => {
  return (
    <StackComponent
      sx={{
        height: "max-content",
        zIndex: 1,
        boxShadow: "0px 0px 100px 0px #0000000F",
        borderRadius: "40px",
        backgroundColor: "#FFFFFF",
        p: "32px",
        ...sx,
        "@media (max-width:600px)": {
          px: "16px !important",
        },
      }}
      component="section"
      {...otherProps}
    >
      {!withoutHeading ? (
        <>
          <StackComponent
            sx={{ width: "100%" }}
            justifyContent="space-between"
            alignItems="center"
          >
            <SectionHeading>{heading}</SectionHeading>
            {sectionRightActions ? sectionRightActions : null}
          </StackComponent>
          {children}
        </>
      ) : (
        <>{children}</>
      )}
    </StackComponent>
  );
};

Section.propTypes = {
  children: PropTypes.any,
  heading: PropTypes.any,
  sectionRightActions: PropTypes.any,
  withoutHeading: PropTypes.bool,
  sx: PropTypes.any,
};

export default Section;
