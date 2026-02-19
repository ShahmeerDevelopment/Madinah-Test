"use client";

import React, { useState } from "react";
import SectionHeading from "../UI/SectionHeading";
import SearchWithTextAndCategory from "@/components/advance/SearchWithTextAndCategory";
import BoxWithImageBackground from "@/components/atoms/BoxWithImageBackground";
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { buildSimpleTypography } from "@/utils/helpers";

const IMAGE_URL = "https://madinah.s3.us-east-2.amazonaws.com/general-images/1000X1000/PHS125-1742631084.jpg";
const DESCRIPTION =
	"After today’s events in Palestine, hundreds of Palestinians have been killed, thousands of civilians have been injured, and more than 20000 homes destroyed";

const Explore = ({ initialCategories = [] }) => {
	const [categoryData, setCategoryData] = useState({
		name: "Palestine",
		imageUrl: IMAGE_URL,
		description: DESCRIPTION,
	});

	return (
		<>
			<SectionHeading>Explore</SectionHeading>
			<SearchWithTextAndCategory
				dataHandler={(item) => setCategoryData(item)}
				initialCategories={initialCategories}
			/>
			<BoxWithImageBackground
				sx={{
					height: "594px",
					mt: "40px !important",
					borderRadius: "16px",
					"@media (max-width: 600px)": {
						height: "auto",
						aspectRatio: "1 / 1.1",
					},
				}}
				fullWidth
				imageUrl={categoryData?.imageUrl}
				priority={true}
			>
				<StackComponent
					sx={{
						position: "absolute",
						left: "32px",
						right: "32px",
						bottom: "32px",
					}}
					direction="column"
					spacing={1}
				>
					<TypographyComp
						sx={{
							fontSize: "32px",
							fontWeight: "500",
							lineHeight: "38px",
							letterSpacing: "-0.417px",
							color: "#ffffff",
						}}
					>
						{categoryData.name}
					</TypographyComp>
					<TypographyComp
						sx={{
							fontSize: "18px",
							fontWeight: "500",
							lineHeight: "22px",
							letterSpacing: "-0.417px",
							color: "#ffffff",
							"@media (max-width: 600px)": {
								...buildSimpleTypography(400, 14, 16),
							},
						}}
					>
						{categoryData?.description}
					</TypographyComp>
				</StackComponent>
			</BoxWithImageBackground>
		</>
	);
};

export default Explore;
