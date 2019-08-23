import { useState, useEffect, useReducer } from 'react';
import {
	DocumentDataObject,
	QueryDocumentDataObject,
	QueryDataObject,
} from './data';
import * as logger from './logger';
import { DocumentDoesNotExistError } from './firestore-errors';
import { MemoizedDocumentReference, MemoizedQuery } from './firestore-selector';

/**
 * Hook to subscribe to a single Firestore document
 * @param ref A document reference that is referentially equal on each render
 * @returns Most recent snapshot + some metadata
 */
export function useDocument<T>(ref: MemoizedDocumentReference) {
	const [state, setState] = useState<DocumentDataObject<T>>({
		id: ref.id,
		pending: true,
	});

	useEffect(
		() =>
			// onSnapshot returns an unsubscribe function that useEffect
			// takes advantage of when unmounting
			ref.onSnapshot(
				snapshot => {
					const { id } = ref;

					// Note that each call to a snapshot's data() method creates
					// a clone of the data object. Premature optimization now, but
					// this could probably be memoized globally for React perf.
					const data = snapshot.data() as T;
					if (snapshot.exists) {
						setState({ id, data });
					} else {
						setState({
							id,
							error: new DocumentDoesNotExistError(),
						});
					}
				},
				error => {
					logger.error(error);
					setState({ id: ref.id, error });
				}
			),
		// Ref inclusion is fine because it's a MemoizedDocumentReference and
		// not a regular Firestore document reference
		[ref]
	);

	return state;
}

/**
 * Hook to subscribe to a Firestore document query
 * @param ref A document reference that is referentially equal on each render
 * @returns List of documents + some metadata
 */
export function useQuery<T>(query: MemoizedQuery) {
	// useReducer instead of setState because we'd otherwise have to pass
	// state to useEffect, which triggers an infinite render loop
	const [state, dispatch] = useReducer(
		(
			queryState: QueryDataObject<T>,
			action:
				| {
						snapshot: firebase.firestore.QuerySnapshot;
						error?: undefined;
				  }
				| { error: Error }
		): QueryDataObject<T> => {
			if (action.error) {
				return { error: action.error };
			}

			const { snapshot } = action;
			if (snapshot.empty && queryState.pending) {
				return { data: [] };
			}

			// Preserve map of docs by key so we can reuse objects
			// for reference equality
			const docMap: Record<
				string,
				QueryDocumentDataObject<T> | void
			> = {};
			(queryState.data || []).forEach(doc => {
				docMap[doc.id] = doc;
			});

			// Modify data as needed
			snapshot.docChanges().forEach(change => {
				switch (change.type) {
					case 'added':
					case 'modified':
						docMap[change.doc.id] = {
							id: change.doc.id,
							data: change.doc.data() as T,
						};
						break;
					case 'removed':
						// Can ignore since we iterate through below
						// and reconstruct hash on each snapshot
						break;
					default:
						// Unexpected, so return exact same state
						logger.error(
							`Unexpected doc change type: ${change.type}`
						);
				}
			});

			// Use order given by snapshot
			const data: QueryDocumentDataObject<T>[] = [];
			snapshot.docs.forEach(docRef => {
				const docData = docMap[docRef.id];
				if (docData) {
					data.push(docData);
				} else {
					logger.error(`Missing doc ID in map: ${docRef.id}`);
					data.push({
						id: docRef.id,
						data: docRef.data() as T,
					});
				}
			});
			return { data };
		},
		{
			pending: true,
		}
	);

	useEffect(
		() =>
			// onSnapshot returns an unsubscribe function that useEffect
			// takes advantage of when unmounting
			query.onSnapshot(
				snapshot => dispatch({ snapshot }),
				error => {
					logger.error(error);
					dispatch({ error });
				}
			),
		// This is fine because it's a MemoizedDocumentReference and not a
		// regular Firestore document reference
		[query]
	);

	return state;
}
