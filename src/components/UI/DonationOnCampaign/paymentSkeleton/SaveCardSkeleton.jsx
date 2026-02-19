"use client";

import GridComp from "@/components/atoms/GridComp/GridComp";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import React from "react";

const SaveCardSkeleton = () => {
	return (
		<div>
			<GridComp container spacing={2}>
				<GridComp item xs={12} sm={3}>
					<SkeletonComponent
						sx={{ borderRadius: "28px" }}
						variant={"rounded"}
						height={"41px"}
					/>
				</GridComp>
			</GridComp>
		</div>
	);
};

export default SaveCardSkeleton;
