import React from 'react';
import { Checklist } from './checklist';
import { Home } from './home';
import { Nav } from './nav';
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
			<Nav />
			<main>
				<MainContent />
			</main>
		</div>
	);
}
