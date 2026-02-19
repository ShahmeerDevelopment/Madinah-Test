"use client";

import SectionHeading from "@/components/advance/SectionHeading";
import SectionSubheading from "@/components/advance/SectionSubheading";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import LinkComponent from "@/components/atoms/LinkComponent";
import StackComponent from "@/components/atoms/StackComponent";
import PropTypes from "prop-types";
import React from "react";

const Section = ({
  heading,
  subHeading,
  children,
  withAction = true,
  actionRoute = "#",
  centered = false,
  spacing = 0,
  stackProps,
}) => {
  return (
    <WhiteBackgroundSection
      spacing={spacing}
      sx={{
        width: "100%",
        "@media (max-width:600px)": {
          px: "16px !important",
        },
      }}
      alignItems={centered ? "center" : "flex-start"}
      direction="column"
    >
      {heading ? (
        <StackComponent sx={{ width: "100%" }} justifyContent="space-between">
          <SectionHeading
            sx={centered ? { textAlign: "center", flexGrow: 1 } : null}
          >
            {heading}
          </SectionHeading>
          {withAction ? (
            <LinkComponent
              styleOverrides={{
                color: "rgba(99, 99, 230, 1)",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "16px",
                letterSpacing: "-0.41px",
                width: "52px",
              }}
              to={actionRoute}
            >
              View all
            </LinkComponent>
          ) : null}
        </StackComponent>
      ) : null}
      {subHeading ? <SectionSubheading>{subHeading}</SectionSubheading> : null}
      <StackComponent
        sx={{ width: "100%" }}
        direction="column"
        spacing={0}
        {...stackProps}
      >
        {children}
      </StackComponent>
    </WhiteBackgroundSection>
  );
};

Section.propTypes = {
  actionRoute: PropTypes.string,
  centered: PropTypes.bool,
  children: PropTypes.any,
  heading: PropTypes.any,
  spacing: PropTypes.number,
  stackProps: PropTypes.any,
  subHeading: PropTypes.any,
  withAction: PropTypes.bool,
};

export default Section;
