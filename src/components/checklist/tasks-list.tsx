import React from 'react';
import { QueryDocumentDataObject } from '~/lib/data';
import { List } from '~/components/kit/list';
import { useTasksForChecklist, Task } from '~/stores/tasks';

export interface Props {
	checklistId: string;
}

/**
 * Render a single task in list, passed to list renderer
 * @param task - Task to render
 * @returns - JSX
 */
function renderItem(task: QueryDocumentDataObject<Task>) {
	return <span>{task.data.name}</span>;
}

/**
 * React component for a list of checklists this user has created
 */
export function TasksList(props: Props) {
	const tasks = useTasksForChecklist(props.checklistId);
	if (tasks.pending) return <span>Loading…</span>;
	if (tasks.error) return <span>There was an error loading your data.</span>;
	if (!tasks.data || !tasks.data.length)
		return <span data-testid="tasks-list">No tasks found</span>;

	return (
		<List
			data-testid="tasks-list"
			items={tasks.data}
			renderItem={renderItem}
		/>
	);
}
