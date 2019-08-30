import React from 'react';
import { QueryDocumentDataObject } from '~/lib/data';
import { StableList } from '~/components/kit/stable-list';
import { Checklist } from '~/stores/model-types';
import { useChecklistsForCurrentUser } from '~/stores/checklists';
import { RouteLink } from '~/components/route-link';

/**
 * Render a single checklist in list, passed to list renderer
 * @param list - Checklist to render
 * @returns - JSX
 */
function renderItem(list: QueryDocumentDataObject<Checklist>) {
	return (
		<RouteLink route={{ type: 'checklist', id: list.id }}>
			{list.data.name}
		</RouteLink>
	);
}

/**
 * React component for a list of checklists this user has created
 */
export function ChecklistsList() {
	const checklists = useChecklistsForCurrentUser();
	if (checklists.pending) return <span>Loading…</span>;
	if (checklists.error)
		return <span>There was an error loading your data.</span>;
	if (!checklists.data || !checklists.data.length)
		return <span data-testid="checklists-list">No checklists found</span>;

	return (
		<StableList
			data-testid="checklists-list"
			items={checklists.data}
			renderItem={renderItem}
		/>
	);
}
