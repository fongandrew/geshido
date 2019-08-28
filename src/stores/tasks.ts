import { createAction } from '~/lib/actions';
import { checkFirestoreType } from '~/lib/check-firestore-type';
import { db, firebase } from '~/lib/firebase';
import { useSelector } from '~/lib/firestore-selector';
import { useDocument, useQuery } from '~/lib/firestore-sub';
import { CHECKLISTS_COLLECTION_NAME } from './checklists';
import { Task } from './model-types';

export const TASKS_COLLECTION_NAME = 'tasks';

/**
 * Create list for current user and topic
 * @param checklistId - ID of checklist to create t
 * @param topic - Initial topic data
 */
export const createTaskForChecklist = createAction(
	'Create topic for a given list',
	async (checklistId: string, task: { name: string }) => {
		return db
			.collection(CHECKLISTS_COLLECTION_NAME)
			.doc(checklistId)
			.collection(TASKS_COLLECTION_NAME)
			.add(
				checkFirestoreType<Task>({
					...task,
					createdOn: firebase.firestore.FieldValue.serverTimestamp(),
					lastModified: firebase.firestore.FieldValue.serverTimestamp(),
				})
			);
	}
);

/**
 * React hook to query all topics for a given checklist
 * @param checklistId - ID for checklist we're subscribing to
 */
export function useTasksForChecklist(checklistId: string) {
	const query = useSelector(
		() =>
			db
				.collection(CHECKLISTS_COLLECTION_NAME)
				.doc(checklistId)
				.collection(TASKS_COLLECTION_NAME)
				.orderBy('lastModified', 'desc')
				.orderBy('createdOn', 'desc'),
		[]
	);
	return useQuery<Task>(query);
}

/**
 * React hook to use a topic with given IDs
 * @param checklistId - ID of checklist
 * @param topicId - ID of checklist
 */
export function useTask(checklistId: string, topicId: string) {
	const ref = useSelector(
		(checklistDocId, topicDocId) =>
			db
				.collection(CHECKLISTS_COLLECTION_NAME)
				.doc(checklistDocId)
				.collection(TASKS_COLLECTION_NAME)
				.doc(topicDocId),
		[checklistId, topicId]
	);
	return useDocument<Task>(ref);
}
