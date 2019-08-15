/**
 * A simple identity function that TS can look to assert a type
 * @param t - The value to check
 * @returns The value passed
 */
export function checkType<T>(t: T) {
	return t;
}
