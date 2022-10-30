import create from "zustand";
import { CalendarDate, CalendarMonth } from "../commonTypes/date";
import { getTodayDate, isSameMonth } from "../utils/date";

const defaultDate = getTodayDate();

interface CalendarState {
	currentMonthInDateSelector: CalendarMonth;
	selectedDate: CalendarDate;
	selectDate: (date: CalendarDate) => void;
	setCurrentMonthInDateSelector: (month: CalendarMonth) => void;
}

export const useCalendarState = create<CalendarState>((set) => ({
	currentMonthInDateSelector: {
		year: defaultDate.year,
		month: defaultDate.month,
	},
	selectedDate: defaultDate,
	selectDate: (date: CalendarDate) => {
		set((state) => ({
			...state,
			selectedDate: date,
			currentMonthInDateSelector: isSameMonth(
				date,
				state.currentMonthInDateSelector
			)
				? state.currentMonthInDateSelector
				: {
						year: date.year,
						month: date.month,
				  },
		}));
	},
	setCurrentMonthInDateSelector: (month: CalendarMonth) => {
		set((state) => ({
			...state,
			currentMonthInDateSelector: isSameMonth(
				state.currentMonthInDateSelector,
				month
			)
				? state.currentMonthInDateSelector
				: month,
		}));
	},
}));
