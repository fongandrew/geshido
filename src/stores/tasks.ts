import { firestore } from 'firebase/app';
import { createAction } from '../lib/actions';
import { checkType } from '../lib/check-type';
import { db } from '../lib/firebase';
import { useSelector } from '../lib/firestore-selector';
import { useDocument, useQuery } from '../lib/firestore-sub';
import { CHECKLISTS_COLLECTION_NAME } from './checklists';

export interface Task {
	name: string;
	lastTouched: Date;
}

export const TASKS_COLLECTION_NAME = 'topics';

/**
 * Create list for current user and topic
 * @param checklistId - ID of checklist to create t
 * @param topic - Initial topic data
 */
export const createTaskForChecklist = createAction(
	'Create topic for a given list',
	async (checklistId: string, topic: { name: string }) => {
		// Check with actual Date because the serverTimestamp below will screw
		// up the type checking.
		const checkedTask = checkType<Task>({
			...topic,
			lastTouched: new Date(),
		});

		return db
			.collection(CHECKLISTS_COLLECTION_NAME)
			.doc(checklistId)
			.collection(TASKS_COLLECTION_NAME)
			.add({
				...checkedTask,
				lastTouched: firestore.FieldValue.serverTimestamp(),
			});
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
				.orderBy('lastTouched', 'desc'),
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
