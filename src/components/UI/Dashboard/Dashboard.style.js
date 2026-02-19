import { styled } from "@mui/material/styles";
import { BOX_SHADOW_STYLE } from "@/config/constant";

export const Wrapper = styled("div")(({ theme, isBackground }) => ({
	// backgroundColor: isBackground ? theme.palette.primary.light : 'transparent',
	boxShadow: isBackground ? BOX_SHADOW_STYLE : null,
	padding: "32px",
	width: "100%",
	// minHeight: '72vh',
	marginTop: "24px",
	marginLeft: "10px",
	borderRadius: "32px",
	[theme.breakpoints.down("sm")]: {
		padding: "16px 16px 32px 16px",
		width: "100%",
		marginLeft: "0px",
	},
}));
export const ButtonWrapper = styled("div")(() => ({
	display: "flex",
	justifyContent: "space-between",
	gap: 10,
}));

export const LoaderWrapper = styled("div")(({ theme }) => ({
	// marginTop: '30px',
	[theme.breakpoints.down("sm")]: {
		marginTop: "0px",
	},
}));
export const CarouselWrapper = styled("div")(({ theme, isCustom }) => ({
	backgroundColor: theme.palette.primary.light,
	boxShadow: BOX_SHADOW_STYLE,
	padding: "24px",
	borderRadius: "32px",
	width: "100%",
	marginTop: isCustom ? "24px" : "48px",
	overflow: "hidden",
	[theme.breakpoints.down("sm")]: {
		padding: "16px",
	},
}));
const ButtonBox = styled("div")(() => ({
	display: "flex",
	justifyContent: "flex-start",
}));
export default ButtonBox;
