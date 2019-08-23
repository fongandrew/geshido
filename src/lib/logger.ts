/**
 * Wrappers for console logging in case we want to do something with this later
 */

/* eslint-disable no-console */
export const debug = (...args: any[]) => console.debug(...args);
export const info = (...args: any[]) => console.info(...args);
export const warn = (...args: any[]) => console.warn(...args);
export const error = (...args: any[]) => console.error(...args);
