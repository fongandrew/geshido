/* eslint-disable no-console */
const original = {
	warn: console.warn,
	error: console.error,
};
/* eslint-enable no-console */

beforeEach(() => {
	if (!process.env.DEBUG) {
		jest.spyOn(console, 'debug').mockImplementation(() => {});
		jest.spyOn(console, 'info').mockImplementation(() => {});
	}

	jest.spyOn(console, 'warn').mockImplementation((...args) => {
		original.warn(...args);
		throw new Error(`Unexpected console.warn: ${args[0]}`);
	});
	jest.spyOn(console, 'error').mockImplementation((...args) => {
		original.error(...args);
		throw new Error(`Unexpected console.error: ${args[0]}`);
	});
});
