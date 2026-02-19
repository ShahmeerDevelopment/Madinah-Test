import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = useState(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.log(error);
			return initialValue;
		}
	});

	useEffect(() => {
		const handleStorageChange = () => {
			try {
				const item = window.localStorage.getItem(key);
				setStoredValue(item ? JSON.parse(item) : initialValue);
			} catch (error) {
				console.log(error);
			}
		};

		// Set up event listener for changes in localStorage
		window.addEventListener("storage", handleStorageChange);

		// Remove event listener on cleanup
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, [key, initialValue]);

	return storedValue;
}

export default useLocalStorage;
