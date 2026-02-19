import { styled } from "@mui/material/styles";
export const UpsellCardWrapper = styled("div")(({ theme, type }) => ({
	height: "120px",
	backgroundColor: theme.palette.white.light,
	width: "100%",
	marginBottom: "32px",
	borderRadius: "20px",
	padding: "16px 24px 16px 24px",
	display: "flex",
	gap: "13px",
	alignItems: "center",

	[theme.breakpoints.down("sm")]: {
		padding: "8px 8px 8px 12px",
		display: "flex",
		flexDirection: "column",
		gap: "8px",
		height: type !== "orderBump" ? "220px" : "124px",
	},
}));

export const UpSellText = styled("div")(({ theme, type }) => ({
	height: "34px",
	backgroundColor: "#E3E3FD",
	width: type !== "orderBump" ? "80px" : "113px",
	borderRadius: "25px",
	padding: "10px 14px 10px 14px",
	color: theme.palette.primary.main,
	textAlign: "center",
	display: "block",
	fontSizeZ: "14px",
	fontWeight: 500,
	lineHeight: "16px",
	[theme.breakpoints.down("sm")]: {
		display: "none",
	},
}));

export const UpsellButtonWrapper = styled("div")(({ theme }) => ({
	display: "flex",
	gap: 8,
	alignItems: "center",
	[theme.breakpoints.down("sm")]: {
		display: "none",
	},
	// alignItems: 'center',
}));

export const UpsellIconButtonWrapper = styled("div")(({ theme }) => ({
	display: "none",
	[theme.breakpoints.down("sm")]: {
		display: "flex",
		flexWrap: "wrap",
		gap: 8,
		alignItems: "center",
	},

	// alignItems: 'center',
}));
