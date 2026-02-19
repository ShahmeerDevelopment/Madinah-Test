import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import StackComponent from "@/components/atoms/StackComponent";
import React from "react";

const AppLoader = () => {
	return (
		<StackComponent justifyContent="center" spacing={2}>
			<SkeletonComponent
				width="50%"
				sx={{
					borderRadius: "10px",
				}}
				height="150px"
			/>
			<StackComponent spacing={2} sx={{ width: "50%" }} direction="column">
				<SkeletonComponent
					width="100%"
					height="150px"
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
				<SkeletonComponent
					width="100%"
					height="150px"
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

export default AppLoader;
