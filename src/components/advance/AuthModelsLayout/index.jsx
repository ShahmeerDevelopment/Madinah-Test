

"use client";

import PropTypes from "prop-types";
import React from "react";
import StackComponent from "../../atoms/StackComponent";

const AuthModelsLayout = ({ children }) => {
	return (
		<StackComponent
			direction="column"
			sx={{
				// px: { xs: 2, sm: 4, md: '24px' },
				// py: '16px',
				// maxHeight: '99vh',
				overflowY: "auto",
				// width: '454px',
				// backgroundColor: 'pink',
				textAlign: "center",
				"@media (max-width:1000px)": {
					width: "100%",
				},
			}}
			spacing={0}
		>
			{children}
		</StackComponent>
	);
};

AuthModelsLayout.propTypes = {
	children: PropTypes.any,
};

export default AuthModelsLayout;
