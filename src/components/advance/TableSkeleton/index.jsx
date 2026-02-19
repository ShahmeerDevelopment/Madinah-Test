"use client";

import React from "react";
import SkeletonComponent from "../../../components/atoms/SkeletonComponent";
import BoxComponent from "../../../components/atoms/boxComponent/BoxComponent";

const TableSkeleton = () => {
	return (
		<BoxComponent
			sx={{ display: "flex", flexDirection: "column", mt: 4, gap: 2 }}
		>
			<BoxComponent
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<SkeletonComponent variant={"text"} height={"25px"} width={"30%"} />
				<BoxComponent
					sx={{
						display: { xs: "none", sm: "flex" },
						alignItems: "center",
						gap: 1,
						width: "26%",
					}}
				>
					<SkeletonComponent variant={"rounded"} height={"30px"} />
					<SkeletonComponent
						variant={"circular"}
						height={"30px"}
						width={"55px"}
					/>
				</BoxComponent>
			</BoxComponent>
			<SkeletonComponent variant={"rounded"} height={"65px"} />
			<SkeletonComponent variant={"rounded"} height={"65px"} />
			<SkeletonComponent variant={"rounded"} height={"65px"} />
			<SkeletonComponent variant={"rounded"} height={"65px"} />
			<SkeletonComponent variant={"rounded"} height={"65px"} />
		</BoxComponent>
	);
};

export default TableSkeleton;
