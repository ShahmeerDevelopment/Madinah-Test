import { styled } from "@mui/material/styles";
import { BOX_SHADOW_STYLE } from "../../../config/constant";

export const FooterWrapper = styled("footer")(({
	theme,
	withSidebar,
	smallerThan900,
}) => {
	const commonStyles = {
		marginTop: "24px",
		padding: `32px ${smallerThan900 ? "40px" : "160px"} 24px ${smallerThan900 ? "40px" : "160px"
			}`,
		zIndex: 10,
		boxShadow: BOX_SHADOW_STYLE,

		[theme.breakpoints.down("sm")]: {
			// Adjust for mobile view
			width: "100%",
			padding: "47px 16px 47px 16px",
			left: 0,
			right: 0,
			// bottom: 0,
			marginLeft: "0px",
			marginRight: "0px",
		},
	};
	if (!withSidebar) {
		return {
			background: "white",
			position: "relative",
			bottom: "-65px",
			left: 0,
			right: 0,
			// marginLeft: '-54px',
			// marginRight: '-56px',
			...commonStyles,
		};
	} else
		return {
			backgroundColor: "white",
			position: "relative",
			// bottom: '-42px',
			left: 0,
			right: 0,
			// marginLeft: '-355px',
			// marginRight: '-129px',
			...commonStyles,
		};
});
