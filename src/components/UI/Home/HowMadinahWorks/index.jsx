"use client";

import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import React from "react";
// import VideoPlayerComponent from '../../../../components/atoms/VideoPlayerComponent';
// import PlayIcon from './../../../../assets/icons/Play.png';
// import Image from '../../../../components/atoms/imageComponent/Image';

const HowMadinahWorks = () => {
	return (
		<StackComponent spacing="40px" direction="column">
			<TypographyComp
				sx={{
					color: "#606062",
					fontSize: "18px",
					fontWeight: 500,
					letterSpacing: "-0.41px",
					lineHeight: "22px",
				}}
			>
				Madinah provides the optimal backdrop for your fundraising endeavors,
				whether you are an individual, group or organization
			</TypographyComp>
			{/* <VideoPlayerComponent
				width="100%"
				height="594px"
				style={{
					borderRadius: '16px',
					overflow: 'hidden',
				}}
				playIcon={
					<Image
						light
						source={PlayIcon}
						width="60px"
						height="60px"
						alt="play"
					/>
				}
			/> */}
		</StackComponent>
	);
};

export default HowMadinahWorks;
