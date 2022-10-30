export type CalendarDate = {
	year: number;
	month: number;
	date: number;
};

export type CalendarMonth = Pick<CalendarDate, "year" | "month">;
