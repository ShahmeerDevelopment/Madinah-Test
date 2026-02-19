import { styled } from "@mui/material/styles";

export const Section = styled("section")(({ theme }) => ({
	padding: "32px 32px 32px 32px",
	width: "100%",
	marginTop: "24px",
	marginLeft: "10px",
	borderRadius: "32px",

	[theme.breakpoints.down("sm")]: {
		padding: "16px 16px 32px 16px",
		width: "100%",
		marginLeft: "0px",
	},
}));
