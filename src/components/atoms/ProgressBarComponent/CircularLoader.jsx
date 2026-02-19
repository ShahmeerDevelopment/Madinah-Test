"use client";

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const CircularLoader = ({ ...props }) => {
	return <CircularProgress {...props} />;
};

export default CircularLoader;
