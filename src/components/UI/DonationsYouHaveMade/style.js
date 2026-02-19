import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import { theme } from "@/config/customTheme";
export const CustomTabs = styled(Tabs)(() => ({
	"& .MuiTabs-indicator": {
		display: "none",
		// Hide the default indicator line
	},
	"& .MuiTab-root": {
		// Default style for all tabs
		textTransform: "capitalize",
		fontSize: "16px",
		fontWeight: 400,
		lineHeight: "20px",
		color: theme.palette.primary.darkGray,
	},
	"& .MuiTab-root.Mui-selected": {
		backgroundColor: theme.palette.primary.main, // Background color for the selected tab
		color: theme.palette.primary.light,
		padding: "0px 24px 0px 24px",
		borderRadius: "32px",
	},
}));
