import { styled } from "@mui/material/styles";

export const SettingTypographyWrapper = styled("div")(() => ({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	// marginBottom: '16px',
}));
export const DeleteButtonWrapper = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	gap: 5,
	marginTop: "32px",
	[theme.breakpoints.down("sm")]: {
		flexDirection: "column",
		gap: 12,
	},
}));
export const LevelWrapper = styled("div")(() => ({
	display: "flex",
	flexDirection: "column",
	// alignItems: 'center',
}));
export const CardWrapper = styled("div")(({ theme }) => ({
	height: { xs: "104px", sm: "120px" },
	backgroundColor: theme.palette.white.light,
	width: "100%",
	marginBottom: "20px",
	borderRadius: "20px",
	padding: "16px 24px 16px 24px",
	[theme.breakpoints.down("sm")]: {
		padding: "8px 8px 8px 12p                      x",
	},
}));
export const CardButtonWrapper = styled("div")(({ theme }) => ({
	display: "flex",
	gap: 5,
	alignItems: "center",
	[theme.breakpoints.down("sm")]: {
		display: "none",
	},
	// alignItems: 'center',
}));
export const CardIconButtonWrapper = styled("div")(({ theme }) => ({
	display: "none",
	[theme.breakpoints.down("sm")]: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "nowrap",
		gap: 4,
		alignItems: "center",
		justifyContent: "flex-start"
	},

	// alignItems: 'center',
}));
