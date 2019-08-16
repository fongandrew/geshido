import React from 'react';
import { useChecklistsForCurrentUser } from '../../stores/checklists';
import { RouteLink } from '../route-link';

/**
 * React component for a list of checklists this user has created
 */
export function ChecklistsList() {
	const checklists = useChecklistsForCurrentUser();
	if (checklists.pending) return <span>Loading…</span>;
	if (checklists.error)
		return <span>There was an error loading your data.</span>;
	if (!checklists.data || !checklists.data.length)
		return <span>No checklists found</span>;

	return (
		<ul>
			{checklists.data.map(list => (
				<li key={list.id}>
					<RouteLink route={{ type: 'checklist', id: list.id }}>
						{list.data.name}
					</RouteLink>
				</li>
			))}
		</ul>
	);
}
