import PropTypes from "prop-types";
import React from "react";

const Search = ({ color }) => {
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
        d="M12.375 12.7187L16.125 16.4687"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

Search.propTypes = {
  color: PropTypes.any,
};

export default Search;
