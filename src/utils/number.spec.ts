import { getSteppedValue } from "./number";

describe("getSteppedValue", () => {
	test("Round up value", () => {
		expect(getSteppedValue(1.5, 1, true)).toBe(2);
		expect(getSteppedValue(5, 2, true)).toBe(6);
		expect(getSteppedValue(1000, 300, true)).toBe(1200);
	});

	test("Round down value", () => {
		expect(getSteppedValue(1.5, 1, false)).toBe(1);
		expect(getSteppedValue(5, 2, false)).toBe(4);
		expect(getSteppedValue(1000, 300, false)).toBe(900);
	});
});

export {};
