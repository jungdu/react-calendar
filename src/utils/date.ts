import { CalendarDate, CalendarMonth } from "../commonTypes/date";

export function getTodayDate(): CalendarDate {
	const d = new Date();
	const month = d.getMonth() + 1;
	const year = d.getFullYear();
	const date = d.getDate();
	return {
		year,
		month,
		date,
	};
}

export function getDay(date: CalendarDate): number {
	const d = new Date(date.year, date.month - 1, date.date);
	return d.getDay();
}

export function getLastDate({ year, month }: CalendarMonth): number {
	const date = new Date(year, month, 0);
	return date.getDate();
}

export function getDisplayDates({
	year,
	month,
}: CalendarMonth): CalendarDate[] {
	const lastDate = getLastDate({ year, month });
	const dates = Array.from({ length: lastDate }, (_, i) => i + 1);
	const currentMonthDates = dates.map((date) => ({
		year,
		month,
		date,
	}));

	return [
		...getPrevMonthDisplayDates({ year, month }),
		...currentMonthDates,
		...getNextMonthDisplayDates({ year, month }),
	];
}

export function getPrevMonth({ year, month }: CalendarMonth) {
	const prevMonth = month === 1 ? 12 : month - 1;
	const prevYear = month === 1 ? year - 1 : year;
	return { year: prevYear, month: prevMonth };
}

export function getPrevMonthDisplayDates({
	year,
	month,
}: CalendarMonth): CalendarDate[] {
	const { year: prevYear, month: prevMonth } = getPrevMonth({ year, month });
	const lastDate = getLastDate({ year: prevYear, month: prevMonth });
	const firstDay = getDay({ year, month, date: 1 });

	const startDate = lastDate - firstDay + 1;

	const dates = Array.from(
		{ length: lastDate - startDate + 1 },
		(_, i) => startDate + i
	);

	return dates.map((date) => ({
		year: prevYear,
		month: prevMonth,
		date,
	}));
}

export function getNextMonth({ year, month }: CalendarMonth) {
	const nextMonth = month === 12 ? 1 : month + 1;
	const nextYear = month === 12 ? year + 1 : year;
	return { year: nextYear, month: nextMonth };
}

export function getNextMonthDisplayDates({
	year,
	month,
}: CalendarMonth): CalendarDate[] {
	const { month: nextMonth, year: nextYear } = getNextMonth({ year, month });
	const lastDate = getLastDate({ year, month });
	const lastDay = getDay({ year, month, date: lastDate });
	const dates = Array.from({ length: 6 - lastDay }, (_, i) => i + 1);

	return dates.map((date) => ({
		year: nextYear,
		month: nextMonth,
		date,
	}));
}

export function isSameDate(date1: CalendarDate, date2: CalendarDate) {
	return (
		date1.year === date2.year &&
		date1.month === date2.month &&
		date1.date === date2.date
	);
}

export function isSameMonth(
	month1: CalendarMonth | CalendarMonth,
	month2: CalendarMonth | CalendarDate
) {
	return month1.year === month2.year && month1.month === month2.month;
}
