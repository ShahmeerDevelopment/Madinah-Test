import { styled } from "@mui/material/styles";
import { CUSTOM_LAYOUT_MARGIN } from "@/config/constant";

export const Video = styled("video")(() => ({
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	minWidth: "100%",
	position: "absolute",
	pointerEvents: "none !important",
	// '&::-webkit-media-controls-start-playback-button': {
	// 	display: 'none !important',
	// 	opacity: 0,
	// },
	// '&::-webkit-media-controls': {
	// 	display: 'none !important',
	// 	opacity: 0,
	// },
	"@media (max-width:1400px)": {
		height: "100%",
	},
	"@media (max-width:1000px)": {
		marginLeft: "-12rem",
	},
	"@media (max-width:600px)": {
		marginLeft: "-20rem",
	},
}));
export const HeroSection = styled("section")(() => ({
	height: "800px",
	marginTop: "-72px",
	// marginLeft: -8 * CUSTOM_LAYOUT_MARGIN.lg,
	// marginRight: -8 * CUSTOM_LAYOUT_MARGIN.lg,
	marginBottom: "24px",
	"@media (max-width:1200px)": {
		marginLeft: -8 * CUSTOM_LAYOUT_MARGIN.md,
		marginRight: -8 * CUSTOM_LAYOUT_MARGIN.md,
	},
	"@media (max-width:900px)": {
		marginLeft: 0,
		marginRight: 0,
		height: "612px",
	},
}));

export const HeroWrapper = styled("div")(({ theme }) => ({
	position: "relative",
	width: "100%",
	height: "100%",
	// backgroundImage: `url(${madinahHero}) `,
	// backgroundSize: 'cover',

	borderRadius: "0px 0px 40px 40px",
	backgroundPositionY: "75.5%",
	backgroundRepeat: "no-repeat",
	overflow: "hidden",

	[theme.breakpoints.down("sm")]: {
		borderRadius: "0px",
	},
}));

export const TextOverlay = styled("div")({
	zIndex: 1000,
	borderRadius: "317px",
	backgroundColor: "rgba(255, 255, 255, 0.5)",
	filter: "blur(70.80000305175781px)",
});
