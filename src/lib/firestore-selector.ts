/**
 * Firestore references don't benefit from reference equality. These are quick
 * types + hacks to memoize references using arguments passed to a selector.
 */
import { useMemo } from 'react';
import { firestore } from 'firebase/app';

// Symbol to color a reference as memozied
const memoized = Symbol('Memoized reference');

// Type of enforce memoization via type-checking
export type Memoized<T> = T & { [memoized]: true };
export type MemoizedDocumentReference = Memoized<firestore.DocumentReference>;
export type MemoizedQuery = Memoized<firestore.Query>;

/**
 * Wrap a selector that returns a document reference so that it always
 * returns the same refeerence given the same shallowly equal params
 * @param selector - Callback function that returns a Firestore document ref
 * @returns Wrapped selector
 */
export function useSelector<T extends any[]>(
	selector: (...args: T) => firestore.DocumentReference,
	args: T
): MemoizedDocumentReference;
export function useSelector<T extends any[]>(
	selector: (...args: T) => firestore.Query,
	args: T
): MemoizedQuery;
export function useSelector<T extends any[]>(
	selector: (...args: T) => firestore.DocumentReference | firestore.Query,
	args: T
): MemoizedDocumentReference | MemoizedQuery {
	return useMemo(
		() => {
			const ref = selector(...args) as
				| MemoizedDocumentReference
				| MemoizedQuery;
			ref[memoized] = true;
			return ref;
		},

		// Disable linter because it wants both selector + args as a single
		// item. We don't include selector we can define as an arrow function
		// for convenience (presumably this isn't something that would ever
		// change). We also want args spread out because the array itself is
		// probably a literal and created anew each render.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		args
	);
}
