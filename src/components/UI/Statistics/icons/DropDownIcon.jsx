"use client";

import React from "react";

const DropDownIcon = ({ className, width = "10", height = "5" }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 10 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none" }}
    >
      <path
        d="M0.916016 1.25L4.2184 4.08061C4.66779 4.4658 5.33091 4.4658 5.7803 4.08061L9.08268 1.25"
        stroke="#6363E6"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default DropDownIcon;
