"use client";

import React, { useState, useEffect } from "react";
import HelpIcon from "./../../../../assets/icons/HelpIcon";
import { ASSET_PATHS } from "@/utils/assets";
import StackComponent from "@/components/atoms/StackComponent";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import SectionHeading from "../UI/SectionHeading";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import Image from "next/image";
import { getBlogPosts } from "@/api/blog-api-services";

const YearInHelpReview = ({ serverBlogPost = null }) => {
	const { isMediumScreen } = useResponsiveScreen();
	// Use server data if available
	const [firstBlogPost, setFirstBlogPost] = useState(serverBlogPost);
	const [loading, setLoading] = useState(serverBlogPost === null);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Skip client fetch if we have server data
		if (serverBlogPost !== null) {
			setFirstBlogPost(serverBlogPost);
			setLoading(false);
			return;
		}

		// Fallback: fetch client-side only if no server data
		const fetchFirstBlogPost = async () => {
			try {
				setLoading(true);
				const response = await getBlogPosts(1); // Fetch only the first post

				if (response.data.success && response.data.data.length > 0) {
					setFirstBlogPost(response.data.data[0]);
					setError(null);
				} else {
					throw new Error("No blog posts available");
				}
			} catch (err) {
				console.error("Error fetching first blog post:", err);
				setError("Failed to load blog post");
				setFirstBlogPost(null);
			} finally {
				setLoading(false);
			}
		};

		fetchFirstBlogPost();
	}, [serverBlogPost]);

	// Helper function to strip HTML tags from excerpt
	const stripHtmlTags = (html) => {
		if (!html) return "";
		return html.replace(/<[^>]*>/g, "").trim();
	};

	return (
		<StackComponent
			justifyContent="space-between"
			sx={{ width: "100%" }}
			direction={isMediumScreen ? "column-reverse" : "row"}
		>
			<StackComponent
				sx={{
					width: "100%",
				}}
				justifyContent="space-between"
				alignItems="flex-start"
				direction="column"
			>
				<StackComponent
					direction="column"
					sx={{
						maxWidth: isMediumScreen ? "100%" : "516px",
						mb: `${isMediumScreen ? "32px" : "0px"} !important`,
					}}
					spacing="16px"
				>
					<StackComponent spacing="12px" alignItems="center">
						<HelpIcon />
						<SectionHeading>
							{loading
								? "Loading..."
								: error
									? "Blog Post"
									: firstBlogPost?.title || "No title available"
							}
						</SectionHeading>
					</StackComponent>
					<TypographyComp
						sx={{
							color: "#A1A1A8",
							fontWeight: "500",
							fontSize: "22px",
							lineHeight: "28px",
							letterSpacing: "-0.41px",
						}}
					>
						{loading
							? "Please wait while we load the latest content..."
							: error
								? "We're having trouble loading the latest blog post. Please try again later."
								: stripHtmlTags(firstBlogPost?.excerpt) || "No excerpt available"
						}
					</TypographyComp>
				</StackComponent>
				<ButtonComp
					sx={{
						width: isMediumScreen ? "100%" : "135px",
						py: "13px !important",
						px: "0px !important",
					}}
					variant="contained"
					onClick={() => {
						if (firstBlogPost?.link) {
							window.open(firstBlogPost.link, "_blank");
						}
					}}
					disabled={loading || error || !firstBlogPost?.link}
				>
					{loading ? "Loading..." : "Read more"}
				</ButtonComp>
			</StackComponent>
			<div
				style={{
					maxWidth: isMediumScreen ? "100%" : "421px",
					marginBottom: isMediumScreen ? "24px" : "0px",
					position: "relative", // Needed for next/image with layout="fill"
					width: "100%", // Ensures the container takes the full width of its parent
					height: "100%", // Initially set to zero to maintain aspect ratio
					//   paddingBottom: "100%", // Adjust based on the aspect ratio you desire
				}}
			>
				<div
					style={{
						width: "100%", // Ensure the wrapper div takes full width
						height: "0", // Initially set height to 0 to maintain aspect ratio
						paddingBottom: "56.25%", // 16:9 aspect ratio (adjust as needed)
						position: "relative", // Keep this as relative
						borderRadius: "32px",
						overflow: "hidden",
					}}
				>
					<Image
						src={
							firstBlogPost?.featured_image_url && !loading && !error
								? firstBlogPost.featured_image_url
								: ASSET_PATHS.images.imagePlaceholder
						}
						alt={firstBlogPost?.title || "Blog post image"}
						layout="fill"
						objectFit="cover"
						objectPosition="center"
						style={{
							borderRadius: "32px",
						}}
						unoptimized={!!firstBlogPost?.featured_image_url}
					/>
				</div>
			</div>
		</StackComponent>
	);
};

export default YearInHelpReview;
