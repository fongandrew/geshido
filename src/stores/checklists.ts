import { createAction } from '~/lib/actions';
import { getCurrentUser } from '~/lib/auth';
import { checkFirestoreType } from '~/lib/check-firestore-type';
import { db, firebase } from '~/lib/firebase';
import { UserNotLoggedInError } from '~/lib/firestore-errors';
import { useSelector } from '~/lib/firestore-selector';
import { useDocument, useQuery } from '~/lib/firestore-sub';
import { firestorePermissionQuery, READ, WRITE } from '~/lib/permissions';
import { Checklist } from './model-types';

export const CHECKLISTS_COLLECTION_NAME = 'checklists';

/**
 * Createlist for current user
 * @param list - Initial checklist data
 */
export const createChecklistForCurrentUser = createAction(
	'Create list for current user',
	async (list: { name: string }) => {
		const currentUser = getCurrentUser();
		if (!currentUser) throw new UserNotLoggedInError();
		return db.collection(CHECKLISTS_COLLECTION_NAME).add(
			checkFirestoreType<Checklist>({
				...list,
				permissions: {
					[READ]: [currentUser.uid],
					[WRITE]: [currentUser.uid],
				},
				createdOn: firebase.firestore.FieldValue.serverTimestamp(),
				lastModified: firebase.firestore.FieldValue.serverTimestamp(),
			})
		);
	}
);

/**
 * React hook to query all checklists owned by current user
 */
export function useChecklistsForCurrentUser() {
	const currentUser = getCurrentUser();
	if (!currentUser) throw new UserNotLoggedInError();
	const query = useSelector(
		currentUserId =>
			db
				.collection(CHECKLISTS_COLLECTION_NAME)
				.where(...firestorePermissionQuery(currentUserId, READ))
				.orderBy('lastModified', 'desc')
				.orderBy('createdOn', 'desc'),
		[currentUser.uid]
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
