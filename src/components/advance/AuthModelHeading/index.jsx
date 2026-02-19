"use client";

import React from "react";
import TypographyComp from "../../atoms/typography/TypographyComp";
import LinearText from "../../atoms/typography/LinearText";

const WelcomeToMadinahAuthHeading = () => {
	const headingFontSize = "18px";
	return (
		<TypographyComp
			component={"div"}
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				fontSize: headingFontSize,
				fontWeight: 500,
				color: "#606062",
			}}
		>
			{"Welcome to"}&nbsp;
			<LinearText fontSize={headingFontSize}>{"Madinah"}</LinearText>
		</TypographyComp>
	);
};

export default WelcomeToMadinahAuthHeading;
