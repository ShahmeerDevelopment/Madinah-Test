"use client";

import React from "react";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";

const TransferSkeleton = () => {
	return (
		<SkeletonComponent
			height={"88px"}
			sx={{
				borderRadius: "28px",
				mt: 3,
				mb: 1,
			}}
		/>
	);
};

export default TransferSkeleton;
