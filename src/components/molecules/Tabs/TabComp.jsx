"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import Tab from "@mui/material/Tab";
import { theme } from "../../../config/customTheme";
import { CustomTabs } from "./TabComp.style";
import CustomTabPanel from "./CustomTabPanel";
import BoxComponent from "../../atoms/boxComponent/BoxComponent";
import Settings from "@/components/UI/CampaignDetail/Settings";
import Levels from "@/components/UI/CampaignDetail/levels/Levels";
import MemoizedDetails from "@/components/UI/CampaignDetail/Details/Details";
import Upsells from "@/components/UI/CampaignDetail/upsells";
import Teams from "@/components/UI/CampaignDetail/team";
import Referral from "@/components/UI/CampaignDetail/referral";
import Updates from "@/components/UI/CampaignDetail/updates/Updates";

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}
export default function BasicTabs({ singleCampaignDetails, tabSearch }) {
	const getTabValue = () => {
		if (tabSearch === "settings=") {
			return 1;
		}
		if (tabSearch === "givingLevel=") {
			return 3;
		}
		return 0;
	};
	const [value, setValue] = useState(getTabValue);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const tabsValue = [
		"Details",
		"Settings",
		"Team",
		"Giving Levels",
		"Referral Links",
		"Upsells",
		"Updates",
	];

	return (
		<BoxComponent sx={{ width: "100%", mb: 2 }}>
			<BoxComponent
				sx={{
					maxWidth: "95%",
					width: { xs: "100%", sm: "758px" },
					border: 1,
					borderRadius: "38px",
					p: 0.2,
					borderColor: theme.palette.primary.gray,
				}}
			>
				<CustomTabs
					variant="scrollable"
					indicatorColor="primary"
					textColor="inherit"
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					{tabsValue.map((item, index) => (
						<Tab
							key={index}
							// wrapped={true}
							label={item}
							{...a11yProps(index)}
						/>
					))}
				</CustomTabs>
			</BoxComponent>
			<CustomTabPanel value={value} index={0}>
				<MemoizedDetails singleCampaignDetails={singleCampaignDetails} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<Settings singleCampaignDetails={singleCampaignDetails} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				<Teams singleCampaignDetails={singleCampaignDetails} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={3}>
				<Levels singleCampaignDetails={singleCampaignDetails} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={4}>
				<Referral singleCampaignDetails={singleCampaignDetails} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={5}>
				<Upsells />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={6}>
				<Updates />
			</CustomTabPanel>
		</BoxComponent>
	);
}
BasicTabs.propTypes = {
	handleAction: PropTypes.any,
	singleCampaignDetails: PropTypes.object,
	tabSearch: PropTypes.any,
};
