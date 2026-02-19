import PropTypes from "prop-types";
import React from "react";

const BackIcon = ({ isDisabled, ...props }) => {
  return (
    <svg
      width="7"
      height="14"
      viewBox="0 0 7 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.25 12.625L0.625 7L6.25 1.375"
        stroke={isDisabled ? "#A1A1A8" : "#606062"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

BackIcon.propTypes = {
  isDisabled: PropTypes.any,
};

export default BackIcon;
