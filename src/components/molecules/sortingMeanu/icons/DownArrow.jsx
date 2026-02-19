"use client";

import React from "react";
import PropTypes from "prop-types";

const DownArrow = ({ color = "#A1A1A8" }) => {
  return (
    <svg
      width="6"
      height="12"
      viewBox="0 0 6 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.25 8.75011L3.53033 10.4698C3.23744 10.7627 2.76256 10.7627 2.46967 10.4698L0.75 8.75011M3 10.2501L3 1.25011"
        stroke={color}
        strokeLinecap="round"
      />
    </svg>
  );
};

DownArrow.propTypes = {
  color: PropTypes.string,
};

export default DownArrow;
