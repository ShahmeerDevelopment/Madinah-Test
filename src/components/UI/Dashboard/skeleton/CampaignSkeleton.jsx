"use client";

import React from "react";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import StackComponent from "@/components/atoms/StackComponent";

const CampaignSkeleton = () => {
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

export default CampaignSkeleton;
