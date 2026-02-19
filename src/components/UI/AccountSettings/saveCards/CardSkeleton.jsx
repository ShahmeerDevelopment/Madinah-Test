"use client";

import React from "react";
import SkeletonComponent from "../../../../components/atoms/SkeletonComponent";

const CardSkeleton = () => {
  return (
    <div>
      <SkeletonComponent
        sx={{
          borderRadius: "28px",
          mb: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant={"rounded"}
        height={"48px"}
      />
      <SkeletonComponent
        sx={{
          borderRadius: "28px",
          mb: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant={"rounded"}
        height={"48px"}
      />
      <SkeletonComponent
        sx={{
          borderRadius: "28px",
          mb: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant={"rounded"}
        height={"48px"}
      />
    </div>
  );
};

export default CardSkeleton;
