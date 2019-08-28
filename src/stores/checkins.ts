import { createAction } from '~/lib/actions';
import { getCurrentUser } from '~/lib/auth';
import {
	checkFirestoreType,
	checkFirestoreUpdateType,
} from '~/lib/check-firestore-type';
import { db, firebase } from '~/lib/firebase';
import { UserNotLoggedInError } from '~/lib/firestore-errors';
import { useSelector } from '~/lib/firestore-selector';
import { useQuery } from '~/lib/firestore-sub';
import { CHECKLISTS_COLLECTION_NAME } from './checklists';
import { TASKS_COLLECTION_NAME } from './tasks';
import { Checkin, Task, Checklist } from './model-types';

export const CHECKINS_COLLECTION_NAME = 'checkins';

/**
 * Create list for current user and topic
 * @param checklistId - ID of checklist which owns task
 * @param taskId - ID of task to check into
 * @param topic - Initial topic data
 */
export const checkInToTask = createAction(
	'check-in on a task',
	async (checklistId: string, taskId: string) => {
		const currentUser = getCurrentUser();
		if (!currentUser) throw new UserNotLoggedInError();

		// Checkin object is going to be used as part of multiple documents
		// because of NoSQL de-normalization
		const checkin = checkFirestoreType<Checkin>({
			uid: currentUser.uid,
			createdOn: firebase.firestore.FieldValue.serverTimestamp(),
		});

		// Get refs to things we're going to update. We're going to add
		// a brand new checkin object but also add copies of that object
		// to the paren task and checklists for ordering.
		const checklistRef = db
			.collection(CHECKLISTS_COLLECTION_NAME)
			.doc(checklistId);
		const taskRef = checklistRef
			.collection(TASKS_COLLECTION_NAME)
			.doc(taskId);

		// doc() without path auto-generates an ID
		const checkinRef = taskRef.collection(CHECKINS_COLLECTION_NAME).doc();

		// Firestore batch writes are atomic
		const batch = db.batch();
		batch.set(checkinRef, checkin);
		batch.update(
			taskRef,
			checkFirestoreUpdateType<Task>({
				lastModified: checkin.createdOn,
				// Cast necessary because our Firestore type checker
				// goes only one level depe
				lastCheckin: checkin as Checkin,
			})
		);
		batch.update(
			checklistRef,
			checkFirestoreUpdateType<Checklist>({
				lastModified: checkin.createdOn,
				// Cast necessary because our Firestore type checker
				// goes only one level deep
				lastCheckin: checkin as Checkin,
			})
		);

		return batch.commit();
	}
);

/**
 * React hook to query all checkins for a given task
 * @param checklistId - ID for checklist we're subscribing to
 */
export function useCheckinsForTask(checklistId: string, taskId: string) {
	const query = useSelector(
		() =>
			db
				.collection(CHECKLISTS_COLLECTION_NAME)
				.doc(checklistId)
				.collection(TASKS_COLLECTION_NAME)
				.doc(taskId)
				.collection(CHECKINS_COLLECTION_NAME)
				.orderBy('createdOn', 'desc'),
		[]
	);
	return useQuery<Task>(query);
}
