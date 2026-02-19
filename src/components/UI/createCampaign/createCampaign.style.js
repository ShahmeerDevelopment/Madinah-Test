import { BOX_SHADOW_STYLE } from "@/config/constant";
import { styled } from "@mui/material/styles";

export const WrapperLayout = styled("div")(
	({ theme, isFullHeight, height }) => ({
		backgroundColor: theme.palette.primary.light,
		padding: "32px",
		width: "100%",
		marginTop: "0px !important",
		borderRadius: "32px",
		height: isFullHeight ? "100%" : height,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignContent: "flex-start",
		position: "relative",

		boxShadow: BOX_SHADOW_STYLE,
		"@media (max-width: 600px)": {
			padding: "16px 16px 32px 16px",
			height: "100%",
		},
	}),
);

export const SubmitButtonWrapper = styled("div")(() => ({
	display: "flex",
	justifyContent: "flex-end",
	margin: "32px 32px",
	height: "670px",
}));
