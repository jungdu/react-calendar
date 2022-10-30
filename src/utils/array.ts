export function getLastElement<T>(array: T[]) {
	return array[array.length - 1];
}

export function getChunkedArray<T>(array: T[], size: number) {
	const chunkedArray: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunkedArray.push(array.slice(i, i + size));
	}
	return chunkedArray;
}
