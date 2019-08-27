import React from 'react';
import { useTasksForChecklist } from '~/stores/tasks';

export interface Props {
	checklistId: string;
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
		<ul data-testid="tasks-list">
			{tasks.data.map(task => (
				<li
					key={task.id}
					data-testid="tasks-list__item"
					data-itemid={task.id}
				>
					{task.data.name}
				</li>
			))}
		</ul>
	);
}
