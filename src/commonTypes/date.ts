export type CalendarDateTime = {
	year: number;
	month: number;
	date: number;
	hour: number;
	minute: number;
};

export type CalendarDate = Pick<CalendarDateTime, "year" | "month" | "date">;

export type CalendarMonth = Pick<CalendarDateTime, "year" | "month">;

export type Schedule = {
	id: string;
	title: string;
	startTime: number;
	endTime: number;
};
