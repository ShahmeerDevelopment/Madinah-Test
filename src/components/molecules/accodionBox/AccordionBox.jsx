"use client";

import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";
import SubHeading from "../../atoms/createCampaigns/SubHeading";

const accordionStyle = {
	boxShadow: "none",
	color: "black",
};

const AccordionBox = ({ heading = "Heading", children }) => {
	const [expanded, setExpanded] = React.useState(true);

	const toggleAccordion = () => {
		setExpanded(!expanded);
	};

	return (
		<div>
			<Accordion disableGutters expanded={expanded} sx={accordionStyle}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id={heading}
					sx={{ p: 0 }}
					onClick={toggleAccordion}
				>
					<SubHeading sx={{ mb: 1 }}>{heading}</SubHeading>
				</AccordionSummary>
				<AccordionDetails sx={{ p: 0 }}>{children}</AccordionDetails>
			</Accordion>
		</div>
	);
};

AccordionBox.propTypes = {
	heading: PropTypes.string,
	children: PropTypes.node,
};

export default AccordionBox;
