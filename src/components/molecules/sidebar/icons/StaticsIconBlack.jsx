"use client";
import React from "react";
import PropTypes from "prop-types";

const StaticsIconBlack = ({ width = "24px", height = "24px" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 22H22"
        stroke="#444447"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 4V22H14.25V4C14.25 2.9 13.8 2 12.45 2H11.55C10.2 2 9.75 2.9 9.75 4Z"
        stroke="#444447"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 10V22H7V10C7 8.9 6.6 8 5.4 8H4.6C3.4 8 3 8.9 3 10Z"
        stroke="#444447"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 15V22H21V15C21 13.9 20.6 13 19.4 13H18.6C17.4 13 17 13.9 17 15Z"
        stroke="#444447"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

StaticsIconBlack.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};
export default StaticsIconBlack;
