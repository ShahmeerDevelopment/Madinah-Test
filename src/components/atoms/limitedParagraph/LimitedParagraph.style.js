"use client";

import { styled } from "@mui/material/styles";
import TypographyComp from "../typography/TypographyComp";

export const Paragraph = styled(TypographyComp)(
	({ line, fontSize, fontWeight }) => ({
		overflow: "hidden",
		textOverflow: "ellipsis",
		display: "-webkit-box",
		WebkitLineClamp: `${line}`,
		WebkitBoxOrient: "vertical",
		wordWrap: "break-word",
		fontSize: fontSize ? `${fontSize}px` : "inherit",
		fontWeight,
	}),
);
