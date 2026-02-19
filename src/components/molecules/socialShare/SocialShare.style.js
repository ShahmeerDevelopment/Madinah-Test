import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { styled } from "@mui/material/styles";

export const SocialWrapper = styled("div")(() => ({
	border: "1px solid #E9E9EB",
	borderRadius: "16px ",
	padding: "8px",
	height: "40px",
	width: "100%",
	display: "flex",
	justifyContent: "flex-start",
	alignItems: "center",

	cursor: "pointer",
	gap: "8px",
}));
export const SocialText = styled(TypographyComp)(() => ({
	fontWeight: 400,
	fontSize: "16px",
	lineHeight: "16px",
	color: "#606062",
	marginTop: "4px",
}));
