"use client";

import PropTypes from "prop-types";
import React from "react";

const ArrowLeft = ({ disabled = false }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5L9.66939 11.2191C9.2842 11.6684 9.2842 12.3316 9.66939 12.7809L15 19"
        stroke={disabled ? "#C1C1F5" : "#6363E6"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

ArrowLeft.propTypes = {
  disabled: PropTypes.bool,
};

export default ArrowLeft;
