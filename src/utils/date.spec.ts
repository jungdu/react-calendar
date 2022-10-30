import { getLastElement } from "./array";
import {
	getDay,
	getLastDate,
	getNextMonth,
	getNextMonthDisplayDates,
	getPrevMonth,
	getPrevMonthDisplayDates,
} from "./date";

test("getDay", () => {
	expect(getDay({ year: 2022, month: 9, date: 1 })).toBe(4);
	expect(getDay({ year: 2022, month: 10, date: 1 })).toBe(6);
	expect(getDay({ year: 2022, month: 10, date: 30 })).toBe(0);
	expect(getDay({ year: 2022, month: 10, date: 31 })).toBe(1);
});

describe("getLastDate", () => {
	test("2022년 10월 마지막 날", () => {
		expect(getLastDate({ year: 2022, month: 10 })).toBe(31);
	});

	test("2022년 2월 마지막 날", () => {
		expect(getLastDate({ year: 2022, month: 2 })).toBe(28);
	});

	test("2020년 2월 마지막 날", () => {
		expect(getLastDate({ year: 2020, month: 2 })).toBe(29);
	});
});

describe("getPrevMonth", () => {
	test("이전 달 정보 조회", () => {
		expect(getPrevMonth({ year: 2022, month: 10 })).toEqual({
			year: 2022,
			month: 9,
		});
	});

	test("이전 달이 작년일 때 이전 달 정보 조회", () => {
		expect(getPrevMonth({ year: 2022, month: 1 })).toEqual({
			year: 2021,
			month: 12,
		});
	});
});

describe("getPrevMonthDisplayDate", () => {
	test("이전 달 표시할 날짜 시작일", () => {
		expect(getPrevMonthDisplayDates({ year: 2022, month: 10 })[0]).toEqual({
			year: 2022,
			month: 9,
			date: 25,
		});

		expect(getPrevMonthDisplayDates({ year: 2022, month: 8 })[0]).toEqual({
			year: 2022,
			month: 7,
			date: 31,
		});
	});

	test("이전 달 표시할 날짜 마지막 일", () => {
		expect(
			getLastElement(getPrevMonthDisplayDates({ year: 2022, month: 10 }))
		).toEqual({
			year: 2022,
			month: 9,
			date: 30,
		});
	});

	expect(
		getLastElement(getPrevMonthDisplayDates({ year: 2022, month: 8 }))
	).toEqual({
		year: 2022,
		month: 7,
		date: 31,
	});
});

describe("getNextMonth", () => {
	test("다음 달의 년도와 월 정보 조회", () => {
		expect(getNextMonth({ year: 2022, month: 10 })).toEqual({
			year: 2022,
			month: 11,
		});
	});
	test("다음 달이 내년일 때 다음달 정보 조회", () => {
		expect(getNextMonth({ year: 2022, month: 12 })).toEqual({
			year: 2023,
			month: 1,
		});
	});
});

describe("getNextMonthDisplayDates", () => {
	test("다음 달 표시할 날짜 시작일", () => {
		expect(getNextMonthDisplayDates({ year: 2022, month: 10 })[0]).toEqual({
			year: 2022,
			month: 11,
			date: 1,
		});
	});

	test("다음 달 표시할 날짜 마지막 일", () => {
		expect(
			getLastElement(getNextMonthDisplayDates({ year: 2022, month: 10 }))
		).toEqual({
			year: 2022,
			month: 11,
			date: 5,
		});

		expect(
			getLastElement(getNextMonthDisplayDates({ year: 2022, month: 6 }))
		).toEqual({
			year: 2022,
			month: 7,
			date: 2,
		});
	});
});

export {};
