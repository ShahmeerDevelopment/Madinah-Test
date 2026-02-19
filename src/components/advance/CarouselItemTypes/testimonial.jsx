"use client";


import PropTypes from "prop-types";
import React from "react";

import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { buildSimpleTypography } from "@/utils/helpers";
import ShowMoreComponent from "@/components/atoms/ShowMoreComponent";
import Image from "next/image";

// Next
const TestimonialCarouselItem = ({ author, image, raisedAmount, comment }) => {
  return (
    <StackComponent alignItems="flex-start" spacing={"8px"}>
      <Image
        src={image}
        alt="user-image"
        width="46"
        height="46"
        containerStyles={{
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
      <StackComponent direction="column" sx={{ width: "234px" }}>
        <TypographyComp
          sx={{
            color: "rgba(9, 9, 9, 1)",
            ...buildSimpleTypography(500, 18, 22),
          }}
        >
          {author}
        </TypographyComp>
        <TypographyComp
          sx={{
            color: "rgba(9, 9, 9, 1)",
            ...buildSimpleTypography(400, 16, 20),
          }}
        >
          {raisedAmount}
        </TypographyComp>

        <ShowMoreComponent lines={4}>
          <TypographyComp
            sx={{
              color: "#606062",
              ...buildSimpleTypography(400, 16, 20),
            }}
          >
            <q>{comment}</q>
          </TypographyComp>
        </ShowMoreComponent>
      </StackComponent>
    </StackComponent>
  );
};

TestimonialCarouselItem.propTypes = {
  author: PropTypes.any,
  comment: PropTypes.any,
  image: PropTypes.any,
  raisedAmount: PropTypes.any,
};

export default TestimonialCarouselItem;
