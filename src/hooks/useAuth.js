"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { isLoginHandler } from "../store/slices/authSlice";
import { getCookie } from "cookies-next";

export const useAuth = () => {
	const dispatch = useDispatch();
	const [token, setToken] = useState(getCookie("token"));

	// Check token on component mount
	useEffect(() => {
		const currentToken = getCookie("token");
		if (currentToken) {
			dispatch(isLoginHandler(true));
		}
		setToken(currentToken);
	}, [dispatch]);

	// Update token state when it changes
	useEffect(() => {
		const handleTokenChange = () => {
			const newToken = getCookie("token");
			if (newToken !== token) {
				setToken(newToken);
			}
		};

		// Poll for token changes (simpler than a full observer)
		const interval = setInterval(handleTokenChange, 5000);

		return () => clearInterval(interval);
	}, [token]);

	return token;
};
