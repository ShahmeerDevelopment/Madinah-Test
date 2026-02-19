"use client";


import PropTypes from "prop-types";
import React from "react";
import { CardActionArea } from "@mui/material";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";
import LimitedParagraph from "@/components/atoms/limitedParagraph/LimitedParagraph";
import { truncateString } from "@/utils/helpers";

// Next
const CarouselItemWithImageDescriptionInsideCard = ({
  title,
  image,
  subTitle,
  clickAction = () => {},
  ...props
}) => {
  return (
    <BoxComponent
      sx={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        width: "163px",
        height: "223px",
        borderRadius: "16px",
        position: "relative",
        backgroundPosition: "center",
      }}
    >
      <CardActionArea
        className="cancel-drag" // Add this class to cancel dragging
        sx={{
          background: "#ffffff",
          position: "absolute",
          width: "auto !important",
          top: "141px",
          left: "8.3px",
          bottom: "8px",
          right: "8.67px",
          borderRadius: "16px",
          padding: "6px !important",
          // height: '-webkit-fill-available',
        }}
        onClick={() => {
          clickAction({ title, image, subTitle, ...props });
        }}
      >
        <StackComponent direction="column" spacing={0}>
          <LimitedParagraph
            line={1}
            style={{
              color: "#090909",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "22px",
              letterSpacing: "-0.41px",
            }}
          >
            {truncateString(title)}
          </LimitedParagraph>
          <LimitedParagraph
            line={2}
            style={{
              color: "#090909",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "16px",
              letterSpacing: "-0.41px",
              textOverflow: "ellipsis",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {subTitle}
          </LimitedParagraph>
        </StackComponent>
      </CardActionArea>
    </BoxComponent>
  );
};

CarouselItemWithImageDescriptionInsideCard.propTypes = {
  clickAction: PropTypes.func,
  image: PropTypes.any,
  subTitle: PropTypes.any,
  title: PropTypes.any,
};

export default CarouselItemWithImageDescriptionInsideCard;
