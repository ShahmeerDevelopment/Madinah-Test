import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import StackComponent from "@/components/atoms/StackComponent";
import React from "react";

const ViewCampaignLoader = () => {
	return (
		<StackComponent spacing={1} direction={{ xs: "column", sm: "row" }} p={2}>
			<SkeletonComponent
				sx={{
					borderRadius: "10px",
				}}
				height="60px"
			/>
			<SkeletonComponent
				sx={{
					borderRadius: "10px",
				}}
			/>
			<StackComponent
				spacing={2}
				sx={{
					width: { xs: "100%", sm: "33.33%" },
					spacingTop: "16px",
				}}
				direction="column"
			>
				<SkeletonComponent
					width="100%"
					height="150px"
					sx={{
						borderRadius: "10px",
					}}
				/>
				<SkeletonComponent
					width="100%"
					height="20px"
					sx={{
						borderRadius: "10px",
					}}
				/>
				<SkeletonComponent
					width="100%"
					sx={{
						borderRadius: "10px",
					}}
				/>
				<SkeletonComponent
					width="100%"
					height="150px"
					sx={{
						borderRadius: "10px",
					}}
				/>
			</StackComponent>
		</StackComponent>
	);
};

export default ViewCampaignLoader;
