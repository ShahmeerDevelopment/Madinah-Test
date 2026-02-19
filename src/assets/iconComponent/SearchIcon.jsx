import React from "react";
import PropTypes from "prop-types";

const SearchIcon = ({ color = "#A1A1A8" }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8.25"
        cy="8.25"
        r="6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.375 12.7185L16.125 16.4685"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
SearchIcon.propTypes = {
  color: PropTypes.string,
};

export default SearchIcon;
