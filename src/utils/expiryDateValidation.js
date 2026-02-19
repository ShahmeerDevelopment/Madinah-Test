export const validateExpiryDate = (value) => {
	if (!value) return false;
	const parts = value.split("/");
	if (parts.length !== 2) return false;

	const month = parseInt(parts[0], 10);
	const year = parseInt(parts[1], 10) + 2000; // Assuming 21st century
	const expiryDate = new Date(year, month - 1); // Months are 0-indexed in JavaScript Date

	const now = new Date();
	now.setHours(0, 0, 0, 0); // Normalize current date to the start of the day

	return expiryDate > now && month >= 1 && month <= 12;
};
