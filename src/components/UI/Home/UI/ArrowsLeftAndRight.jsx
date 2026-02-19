"use client";

import StackComponent from "@/components/atoms/StackComponent";
import IconButtonComp from "@/components/atoms/buttonComponent/IconButtonComp";
import PropTypes from "prop-types";
import React from "react";
import ArrowLeft from "../icons/ArrowLeft";
import ArrowRight from "../icons/ArrowRight";

const ArrowsLeftAndRight = ({
  rightAction = () => {},
  leftAction = () => {},
  disabledRight = false,
  disabledLeft = false,
}) => {
  return (
    <StackComponent spacing="16px">
      <IconButtonComp
        id="featured-left-icon"
        onClick={() => {
          leftAction();
        }}
        disabled={disabledLeft}
      >
        <ArrowLeft disabled={disabledLeft} />
      </IconButtonComp>
      <IconButtonComp
        id="featured-right-icon"
        onClick={() => {
          rightAction();
        }}
        disabled={disabledRight}
      >
        <ArrowRight disabled={disabledRight} />
      </IconButtonComp>
    </StackComponent>
  );
};

ArrowsLeftAndRight.propTypes = {
  disabledLeft: PropTypes.any,
  disabledRight: PropTypes.any,
  leftAction: PropTypes.any,
  rightAction: PropTypes.any,
};

export default ArrowsLeftAndRight;
