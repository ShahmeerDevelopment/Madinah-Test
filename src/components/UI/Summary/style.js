import { styled } from "@mui/material/styles";

export const Section = styled("section")(({ theme }) => ({
	padding: "24px 18px ",
	width: "100%",
	marginTop: "24px",
	marginLeft: "10px",
	borderRadius: "26px",
	boxShadow: "0px 0px 84.5px 0px rgba(0, 0, 0, 0.07)",

	[theme.breakpoints.down("sm")]: {
		padding: "24px 16px",
		width: "100%",
		marginLeft: "0px",
	},
}));
