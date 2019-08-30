import React from 'react';
import { RouteLink } from './route-link';
import { SigninSignoutButton } from './signin-signout-button';

export function Nav() {
	return (
		<nav>
			<RouteLink route={{ type: 'home' }} data-testid="nav__home">
				Home
			</RouteLink>
			{' | '}
			<SigninSignoutButton />
		</nav>
	);
}
