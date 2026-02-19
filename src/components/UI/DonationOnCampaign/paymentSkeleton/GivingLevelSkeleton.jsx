"use client";

import GridComp from "@/components/atoms/GridComp/GridComp";
import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import React from "react";

const GivingLevelSkeleton = () => {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
			<GridComp container spacing={1.5}>
				{[1, 2, 3].map((i) => (
					<GridComp item xs={4} sm={4} key={i}>
						<BoxComponent
							sx={{
								height: "45px",
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								padding: "1rem",
								borderRadius: "10px",
								border: "2px solid #E9E9EB",
								background: "white",
							}}
						>
							<SkeletonComponent
								sx={{ borderRadius: "4px" }}
								variant={"rounded"}
								width={80}
								height={20}
							/>
						</BoxComponent>
					</GridComp>
				))}
			</GridComp>
		</div>
	);
};

export default GivingLevelSkeleton;
