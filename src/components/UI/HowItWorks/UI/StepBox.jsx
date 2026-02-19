"use client";

import PropTypes from "prop-types";
import React from "react";

import { buildSimpleTypography } from "@/utils/helpers";
import StackComponent from "@/components/atoms/StackComponent";
// import Image from "@/components/atoms/imageComponent/Image";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import Image from "next/image";

const StepBox = ({ icon, title, steps, id }) => {
  console.log(icon);
  return (
    <StackComponent
      sx={{
        p: "16px",
        border: "1px solid rgba(233, 233, 235, 1)",
        borderRadius: "16px",
        flexGrow: 1,
      }}
      spacing="16px"
    >
      <Image src={icon} alt="step" width="24" height="24" />
      <StackComponent sx={{ flexGrow: 1 }} direction="column">
        <TypographyComp
          sx={{
            color: "rgba(9, 9, 9, 1)",
            ...buildSimpleTypography(500, 22, 28),
            mb: "12px",
          }}
        >
          {id + 1}. {title}
        </TypographyComp>
        <StackComponent component="ul" direction="column" spacing="8px">
          {steps.map(({ type, label }, index) => {
            let commonProps = {
              component: "li",
            };
            if (type === "text") {
              return (
                <TypographyComp
                  sx={{
                    marginLeft: "16px !important",
                    color: "rgba(96, 96, 98, 1)",
                    ...buildSimpleTypography(400, 14, 16),
                  }}
                  {...commonProps}
                  key={index}
                >
                  {label}
                </TypographyComp>
              );
            } else {
              return (
                <TypographyComp
                  {...commonProps}
                  sx={{
                    marginLeft: "20px !important",
                    color: "rgba(99, 99, 230, 1)",
                    ...buildSimpleTypography(500, 14, 16),
                    cursor: "pointer",
                  }}
                  key={index}
                >
                  {label}
                </TypographyComp>
              );
            }
          })}
        </StackComponent>
      </StackComponent>
    </StackComponent>
  );
};

StepBox.propTypes = {
  icon: PropTypes.any,
  id: PropTypes.number,
  steps: PropTypes.shape({
    map: PropTypes.func,
  }),
  title: PropTypes.any,
};

export default StepBox;
