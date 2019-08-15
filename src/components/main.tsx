import React from 'react';
import { AuthCheck } from './auth-check';
import { ChecklistsList } from './checklists-list';
import { CreateChecklist } from './create-checklist';
import { SigninSignoutButton } from './signin-signout-button';

export function Main() {
	return (
		<div>
			<nav>
				<SigninSignoutButton />
			</nav>
			<main>
				<AuthCheck>
					<h1>Hello World</h1>
					<ChecklistsList />
					<CreateChecklist />
				</AuthCheck>
			</main>
		</div>
	);
}
