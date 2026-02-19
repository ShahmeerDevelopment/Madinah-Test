"use client";

import { styled } from "@mui/material/styles";
import LinearProgress, {
	linearProgressClasses,
} from "@mui/material/LinearProgress";

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: "12px",
	borderRadius: "25px",
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor:
			theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: "14px",
		backgroundColor: theme.palette.primary.main,
	},
}));
