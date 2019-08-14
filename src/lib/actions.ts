/**
 * Wrapper around generic "actions". Serves as a place to add functionality
 * typically implemented by middleware in something like Redux
 */
import { info } from './logger';

/**
 * Wraps a function with logging and other logic
 * @param name Name of action to log
 * @param fn Function we're wrapping
 * @returns Same return value as fn
 */
export function createAction<I extends any[], O>(
	name: string,
	fn: (...inputs: I) => O
) {
	return function runAction(...inputs: I) {
		info(name, ...inputs);
		return fn(...inputs);
	};
}
