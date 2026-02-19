"use client";

import React from "react";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import { theme } from "@/config/customTheme";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import PropTypes from "prop-types";

const ContactDetail = ({ data }) => {
	return (
		<BoxComponent mt={4} mb={4}>
			<SubHeading sx={{ color: theme.palette.primary.dark }}>
				Contact detail
			</SubHeading>
			<BoxComponent
				display="flex"
				flexDirection="column"
				gap={2}
				mt={2}
				sx={{ width: { xs: "90%", sm: "300px" } }}
			>
				<BoxComponent
					display={"flex"}
					justifyContent="space-between"
					alignItems="center"
					gap={1}
					sx={{ width: "100%" }}
				>
					<Paragraph textColor={theme.palette.primary.gray}>
						Phone number
					</Paragraph>
					<Paragraph textColor={theme.palette.primary.darkGray}>
						{data?.phoneNumber}
					</Paragraph>
				</BoxComponent>
				<BoxComponent
					display={"flex"}
					justifyContent="space-between"
					alignItems="center"
					gap={1}
					sx={{ width: "100%" }}
				>
					<Paragraph textColor={theme.palette.primary.gray}>Email</Paragraph>
					<Paragraph textColor={theme.palette.primary.darkGray}>
						{data?.email}
					</Paragraph>
				</BoxComponent>
			</BoxComponent>
		</BoxComponent>
	);
};

ContactDetail.propTypes = {
	data: PropTypes.any,
};
export default ContactDetail;
