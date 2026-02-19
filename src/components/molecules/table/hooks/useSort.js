"use client";

import { useMemo, useState } from "react";

export const useSort = (data) => {
	const [sortConfig, setSortConfig] = useState(null);

	const requestSort = (key) => {
		let direction = "ascending";
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "ascending"
		) {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

	const sortedData = useMemo(() => {
		let sortableItems = [...data];
		if (sortConfig !== null) {
			sortableItems.sort((a, b) => {
				let aValue = a[sortConfig.key];
				let bValue = b[sortConfig.key];

				// Handle case-insensitive comparison for strings
				if (typeof aValue === "string" && typeof bValue === "string") {
					aValue = aValue.toLowerCase();
					bValue = bValue.toLowerCase();
				}

				if (aValue < bValue) {
					return sortConfig.direction === "ascending" ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortConfig.direction === "ascending" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableItems;
	}, [data, sortConfig]);

	return { sortedData, requestSort, sortConfig };
};
