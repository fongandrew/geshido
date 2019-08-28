import { firestore } from 'firebase/app';

/**
 * This allows substituting a Date type with a server-generated timestamp
 */
export type WithServerTS<T> = {
	[P in keyof T]: T[P] extends Date ? (T[P] | firestore.FieldValue) : T[P]
};

/**
 * A simple identity function that TS can look to assert a type, with mappings
 * for Firestore
 * @param t - The value to check
 * @returns The value passed
 */
export function checkFirestoreType<T>(t: WithServerTS<T>) {
	return t;
}

/**
 * Same as checkFirestoreType, but checks a partial for update operations
 * @param t - The value to check
 * @returns The value passed
 */
export function checkFirestoreUpdateType<T>(t: Partial<WithServerTS<T>>) {
	return t;
}
