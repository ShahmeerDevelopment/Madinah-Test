"use client";

import React from "react";
import PropTypes from "prop-types";

const UpArrow = ({ color = "#A1A1A8" }) => {
  return (
    <svg
      width="6"
      height="11"
      viewBox="0 0 6 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.25 3L3.53033 1.28033C3.23744 0.987436 2.76256 0.987436 2.46967 1.28033L0.749999 3M3 1.5L3 10.5"
        stroke={color}
        strokeLinecap="round"
      />
    </svg>
  );
};

UpArrow.propTypes = {
  color: PropTypes.string,
};

export default UpArrow;
