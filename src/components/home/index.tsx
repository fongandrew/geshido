import React from 'react';
import { AuthCheck } from '../auth-check';
import { ChecklistsList } from './checklists-list';
import { CreateChecklist } from './create-checklist';

/**
 * Home view - lists all checklists for current user
 */
export function Home() {
	return (
		<AuthCheck>
			<h1>Hello World</h1>
			<ChecklistsList />
			<CreateChecklist />
		</AuthCheck>
	);
}
