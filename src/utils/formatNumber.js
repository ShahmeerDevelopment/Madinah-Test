export function formatNumber(number) {
	// Attempt to convert the input to a number if it's a string
	let num = typeof number === "string" ? Number(number) : number;

	if (isNaN(num)) return null; // Check if the input is not a number
	if (!Number.isFinite(num)) return null; // Check if the input is finite

	// Round the number to the nearest integer and convert to a string with localization
	let formattedNumber = Math.round(num).toLocaleString();

	return formattedNumber;
}
