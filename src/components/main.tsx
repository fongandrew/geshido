import React from 'react';
import { Checklist } from './checklist';
import { Home } from './home';
import { SigninSignoutButton } from './signin-signout-button';
import { useRoute } from '~/lib/routes';

function MainContent() {
	const route = useRoute();
	switch (route.type) {
		case 'checklist':
			return <Checklist id={route.id} />;
		default:
			return <Home />;
	}
}

export function Main() {
	return (
		<div>
			<nav>
				<SigninSignoutButton />
			</nav>
			<main>
				<MainContent />
			</main>
		</div>
	);
}
