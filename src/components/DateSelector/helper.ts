export function getDay(num: number) {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return days[num];
}

export function getLastDate(year: number, month: number) {
	const date = new Date(year, month, 0);
	return date.getDate();
}
