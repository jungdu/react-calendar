export function getSteppedValue(value: number, step: number, roundUp: boolean) {
	if (roundUp) {
		return Math.ceil(value / step) * step;
	}
	return Math.floor(value / step) * step;
}
