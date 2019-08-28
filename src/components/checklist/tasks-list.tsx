import React, { useCallback } from 'react';
import { QueryDocumentDataObject } from '~/lib/data';
import { List } from '~/components/kit/list';
import { Task } from '~/stores/model-types';
import { useTasksForChecklist } from '~/stores/tasks';
import { CheckinButton } from './checkin-button';

export interface Props {
	checklistId: string;
}

/**
 * React component for a list of checklists this user has created
 */
export function TasksList(props: Props) {
	const renderItem = useCallback(
		(task: QueryDocumentDataObject<Task>) => (
			<>
				<span>{task.data.name}</span>
				<CheckinButton
					checklistId={props.checklistId}
					taskId={task.id}
				/>
			</>
		),
		[props.checklistId]
	);

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
