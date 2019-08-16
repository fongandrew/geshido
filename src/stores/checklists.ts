import { createAction } from '../lib/actions';
import { checkFirestoreType } from '../lib/check-firestore-type';
import { auth, db } from '../lib/firebase';
import { UserNotLoggedInError } from '../lib/firestore-errors';
import { useSelector } from '../lib/firestore-selector';
import { useDocument, useQuery } from '../lib/firestore-sub';
import {
	HasPermissions,
	firestorePermissionQuery,
	READ,
	WRITE,
} from '../lib/permissions';

export interface Checklist extends HasPermissions {
	name: string;
}

export const CHECKLISTS_COLLECTION_NAME = 'checklists';

/**
 * Createlist for current user
 * @param list - Initial checklist data
 */
export const createChecklistForCurrentUser = createAction(
	'Create list for current user',
	async (list: { name: string }) => {
		if (!auth.currentUser) throw new UserNotLoggedInError();
		return db.collection(CHECKLISTS_COLLECTION_NAME).add(
			checkFirestoreType<Checklist>({
				...list,
				permissions: {
					[auth.currentUser.uid]: [READ, WRITE],
				},
			})
		);
	}
);

/**
 * React hook to query all checklists owned by current user
 */
export function useChecklistsForCurrentUser() {
	if (!auth.currentUser) throw new UserNotLoggedInError();
	const query = useSelector(
		currentUserId =>
			db
				.collection(CHECKLISTS_COLLECTION_NAME)
				.where(...firestorePermissionQuery(currentUserId, READ)),
		[auth.currentUser.uid]
	);
	return useQuery<Checklist>(query);
}

/**
 * React hook to use a checklist with a given ID
 * @param id ID of checklist
 */
export function useChecklist(id: string) {
	const ref = useSelector(
		docId => db.collection(CHECKLISTS_COLLECTION_NAME).doc(docId),
		[id]
	);
	return useDocument<Checklist>(ref);
}
