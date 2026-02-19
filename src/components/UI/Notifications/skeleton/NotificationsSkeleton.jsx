"use client";

import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import StackComponent from "@/components/atoms/StackComponent";
import React from "react";

const NotificationsSkeleton = () => {
  return (
    <div>
      <StackComponent direction={"column"} spacing={2}>
        <SkeletonComponent height="160px" sx={{ borderRadius: "32px" }} />
        <SkeletonComponent height="160px" sx={{ borderRadius: "32px" }} />
        <SkeletonComponent height="160px" sx={{ borderRadius: "32px" }} />
      </StackComponent>
    </div>
  );
};

export default NotificationsSkeleton;
