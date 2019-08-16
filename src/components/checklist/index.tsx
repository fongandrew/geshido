/**
 * Page for individual checklist
 */
import React from 'react';
import { AuthCheck } from '../auth-check';
import { useChecklist } from '../../stores/checklists';

export interface Props {
	id: string;
}

export function Checklist({ id }: Props) {
	const { pending, data: checklist } = useChecklist(id);
	if (pending) return <span>Loading…</span>;
	if (!checklist) return <span>Something went wrong.</span>;
	return (
		<AuthCheck>
			<div>
				<h2>{checklist.name}</h2>
			</div>
		</AuthCheck>
	);
}
