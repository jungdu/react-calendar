import {
	CalendarDate,
	CalendarDateTime,
	CalendarMonth,
	Schedule,
} from "../commonTypes/date";

export function convertToCalendarDate(date: Date): CalendarDateTime {
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		date: date.getDate(),
		hour: date.getHours(),
		minute: date.getMinutes(),
	};
}

export function getMilliseconds(
	calendarDateTime: Partial<CalendarDateTime>
): number {
	const minuteToMs = 60 * 1000;
	const hourToMs = 60 * minuteToMs;
	const dateToMs = 24 * hourToMs;
	const monthToMs = 30 * dateToMs;
	const yearToMs = 12 * monthToMs;
	return (
		(calendarDateTime.year || 0) * yearToMs +
		(calendarDateTime.month || 0) * monthToMs +
		(calendarDateTime.date || 0) * dateToMs +
		(calendarDateTime.hour || 0) * hourToMs +
		(calendarDateTime.minute || 0) * minuteToMs
	);
}

export function convertToJsDate(date: Partial<CalendarDateTime>): Date {
	return new Date(
		date.year || 0,
		(date.month || 1) - 1,
		date.date,
		date.hour || 0,
		date.minute || 0
	);
}

export function getTodayDate(): CalendarDate {
	return convertToCalendarDate(new Date());
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

export function getCurrentWeek({
	year,
	month,
	date,
}: CalendarDate): CalendarDate[] {
	const today = getDay({ year, month, date });
	const startDate = date - today;
	const dates = Array.from({ length: 7 }, (_, i) => startDate + i);
	const lastDate = getLastDate({ year, month });
	return dates.map((date) => {
		if (date < 1) {
			return {
				...getPrevMonth({ year, month }),
				date: getLastDate(getPrevMonth({ year, month })) + date,
			};
		}
		if (date > lastDate) {
			return {
				...getNextMonth({ year, month }),
				date: date - lastDate,
			};
		}
		return { year, month, date };
	});
}

// format hour with am/pm
export function formatHour(hour: number): string {
	if (hour < 12) {
		return `${hour} am`;
	}
	if (hour === 12) {
		return `${hour} pm`;
	}
	return `${hour - 12} pm`;
}

export function getDateTime(date: CalendarDate): number {
	const d = convertToJsDate(date);
	return d.getTime();
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

export const ADayByMs = 1000 * 60 * 60 * 24;

export function getMsInADay(percent: number) {
	return percent * ADayByMs;
}

export function getPercentInADay(ms: number) {
	return (ms / ADayByMs) * 100;
}

export function isDateInRange(
	date: Date,
	range: { start: CalendarDate; end: CalendarDate }
) {
	return (
		date.getTime() >= getDateTime(range.start) &&
		date.getTime() < getDateTime(range.end)
	);
}

export function isScheduleInTheDate(
	schedule: Schedule,
	calendarDate: CalendarDate
) {
	return isDateInRange(new Date(schedule.startTime), {
		start: calendarDate,
		end: {
			...calendarDate,
			date: calendarDate.date + 1,
		},
	});
}
