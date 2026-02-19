"use client";

import React, { useId } from "react";

const DashboardIcon = () => {
  const gradientId0 = useId(); // Generates a unique ID for the first gradient
  const gradientId1 = useId(); // Generates a unique ID for the second gradient

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.02 2.83992L3.63 7.03992C2.73 7.73992 2 9.22992 2 10.3599V17.7699C2 20.0899 3.89 21.9899 6.21 21.9899H17.79C20.11 21.9899 22 20.0899 22 17.7799V10.4999C22 9.28992 21.19 7.73992 20.2 7.04992L14.02 2.71992C12.62 1.73992 10.37 1.78992 9.02 2.83992Z"
        stroke={`url(#paint0_linear_${gradientId0})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17.99V14.99"
        stroke={`url(#paint1_linear_${gradientId1})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={`paint0_linear_${gradientId0}`}
          x1="2"
          y1="12.0036"
          x2="22.0015"
          y2="12.0244"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6363E6" />
          <stop offset="1" stopColor="#59C9F9" />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_${gradientId1}`}
          x1="12"
          y1="16.49"
          x2="13.0001"
          y2="16.4903"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6363E6" />
          <stop offset="1" stopColor="#59C9F9" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default DashboardIcon;
