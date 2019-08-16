/**
 * React component that displays Firebase auth UI if we're not logged in
 */
import React, { Fragment } from 'react';
import { useCurrentUser } from '~/lib/auth';
import { SigninSignoutButton } from './signin-signout-button';

export interface Props {
	children: React.ReactNode;
}

export function AuthCheck(props: Props) {
	const { pending, data: user } = useCurrentUser();

	if (pending) return <span>Loading…</span>;
	if (user) return <Fragment>{props.children}</Fragment>;
	return (
		<div>
			<p>Please sign in.</p>
			<SigninSignoutButton />
		</div>
	);
}
