import React, { useCallback } from 'react';
import { QueryDocumentDataObject } from '~/lib/data';
import { StableList } from '~/components/kit/stable-list';
import { RelativeTimestamp } from '~/components/task/relative-timestamp';
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
				<span data-testid="tasks-list__task-name">
					{task.data.name}
				</span>
				<RelativeTimestamp
					timestamp={
						task.data.lastCheckin && task.data.lastCheckin.createdOn
					}
				/>
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
		<StableList
			data-testid="tasks-list"
			items={tasks.data}
			renderItem={renderItem}
		/>
	);
}
