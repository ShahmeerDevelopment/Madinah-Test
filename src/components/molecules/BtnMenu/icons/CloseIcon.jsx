"use client";

import PropTypes from "prop-types";
import React from "react";

const CloseIcon = ({ color = "white" }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.81641 12.182L12.1804 5.81805"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.1804 12.182L5.81641 5.81799"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

CloseIcon.propTypes = {
  color: PropTypes.any,
};

export default CloseIcon;
