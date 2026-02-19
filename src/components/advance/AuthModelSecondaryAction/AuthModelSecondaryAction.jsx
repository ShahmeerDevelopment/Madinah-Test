
"use client";

import PropTypes from "prop-types";
import React from "react";
import TypographyComp from "../../atoms/typography/TypographyComp";

const AuthModelSecondaryAction = ({ action, mainText, actionText }) => {
	return (
		<TypographyComp
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				color: "#606062",
				marginTop: "0px !important",
				fontSize: "14px",
				fontWeight: 500,
			}}
			component={"div"}
		>
			{mainText}
			<TypographyComp
				sx={{ marginLeft: "4px", cursor: "pointer" }}
				component="span"
				color="primary"
				onClick={action}
				variant="text"
			>
				{actionText}
			</TypographyComp>
		</TypographyComp>
	);
};

AuthModelSecondaryAction.propTypes = {
	action: PropTypes.any,
	actionText: PropTypes.any,
	mainText: PropTypes.any,
};

export default AuthModelSecondaryAction;
