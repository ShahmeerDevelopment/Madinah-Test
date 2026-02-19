"use client";

import PropTypes from "prop-types";
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";

export default function OverlayComponent({
	children,
	open,
	handleClose,
	sx,
	...props
}) {
	return (
		<Backdrop
			sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, ...sx }}
			open={open}
			onClick={handleClose}
			{...props}
		>
			{children}
		</Backdrop>
	);
}

OverlayComponent.propTypes = {
	children: PropTypes.any,
	handleClose: PropTypes.func.isRequired,
	open: PropTypes.any.isRequired,
	sx: PropTypes.any,
};
